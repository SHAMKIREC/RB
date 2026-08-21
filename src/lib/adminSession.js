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
