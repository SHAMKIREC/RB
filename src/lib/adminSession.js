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
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    if (isMissingSessionError(sessionError) || isExpiredSessionError(sessionError)) return null;
    throw sessionError;
  }
  if (!sessionData.session) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    if (isMissingSessionError(userError) || isExpiredSessionError(userError)) {
      try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* local cleanup is best-effort */ }
      return null;
    }
    throw userError;
  }
  if (!isAdminUser(userData.user)) {
    try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* local cleanup is best-effort */ }
    return null;
  }
  return { ...sessionData.session, user: userData.user };
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

  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) {
    if (data.session) await client.auth.signOut();
    throw userError;
  }
  if (!data.session || !isAdminUser(userData.user)) {
    if (data.session) await client.auth.signOut();
    return false;
  }
  return true;
};

export const endAdminSession = async () => {
  if (supabase) await supabase.auth.signOut();
};

export const subscribeToAdminSession = (callback, onError = () => {}) => {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      callback(false);
      return;
    }
    Promise.resolve()
      .then(isAdminSessionActive)
      .then(callback)
      .catch(() => {
        callback(false);
        onError();
      });
  });
  return () => data.subscription.unsubscribe();
};
