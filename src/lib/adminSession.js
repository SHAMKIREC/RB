import { requireSupabase, supabase } from './supabaseClient';

const isAdminUser = (user) => user?.app_metadata?.role === 'admin';

const isMissingSessionError = (error) =>
  error?.name === 'AuthSessionMissingError' ||
  error?.message?.toLowerCase().includes('auth session missing');
const isExpiredSessionError = (error) =>
  error?.status === 401 ||
  error?.message?.toLowerCase().includes('jwt expired') ||
  error?.message?.toLowerCase().includes('invalid jwt');
const isCredentialError = (error) =>
  error?.status === 400 ||
  error?.message?.toLowerCase().includes('invalid login credentials');

const sessionEndedError = () => new Error('Сессия владельца завершена. Войдите в панель ещё раз и повторите действие.');

export const getAdminSession = async () => {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    if (isMissingSessionError(error) || isExpiredSessionError(error)) return null;
    throw error;
  }

  const session = data.session;
  if (!session || !isAdminUser(session.user)) return null;
  return session;
};

export const isAdminSessionActive = async () => Boolean(await getAdminSession());

/**
 * Admin writes must never silently fall back to the publishable/anon role.
 * Refreshing immediately before a mutation also makes the Supabase client
 * replace an expired/stale access token before PostgREST or Storage is called.
 */
export const requireAdminWriteSession = async () => {
  const client = requireSupabase();
  const { data: current, error: sessionError } = await client.auth.getSession();
  if (sessionError || !current.session || !isAdminUser(current.session.user)) {
    throw sessionEndedError();
  }

  const { data: refreshed, error: refreshError } = await client.auth.refreshSession();
  if (refreshError || !refreshed.session || !isAdminUser(refreshed.session.user)) {
    throw sessionEndedError();
  }

  const { data: verified, error: userError } = await client.auth.getUser();
  if (userError || !isAdminUser(verified.user)) {
    throw sessionEndedError();
  }

  return client;
};

export const startAdminSession = async (password) => {
  const email = import.meta.env.VITE_ADMIN_EMAIL;
  if (!email || !password) return false;

  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    if (isCredentialError(error)) return false;
    throw error;
  }

  if (!data.session || !isAdminUser(data.session.user)) {
    if (data.session) await client.auth.signOut({ scope: 'local' });
    return false;
  }

  // Force the freshly authenticated token into the client before opening the
  // owner panel, so the first database write cannot be sent as `anon`.
  const { data: refreshed, error: refreshError } = await client.auth.refreshSession();
  if (refreshError || !refreshed.session || !isAdminUser(refreshed.session.user)) {
    await client.auth.signOut({ scope: 'local' }).catch(() => {});
    return false;
  }

  return true;
};

export const endAdminSession = async () => {
  if (supabase) await supabase.auth.signOut({ scope: 'local' });
};

export const subscribeToAdminSession = (callback, onError = () => {}) => {
  if (!supabase) {
    callback(false);
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    try {
      callback(Boolean(session && isAdminUser(session.user)));
    } catch {
      onError();
    }
  });

  return () => data.subscription.unsubscribe();
};
