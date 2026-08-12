import { requireSupabase, supabase } from './supabaseClient';

const isAdminUser = (user) => user?.app_metadata?.role === 'admin';

export const getAdminSession = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session || !isAdminUser(data.session.user)) return null;
  return data.session;
};

export const isAdminSessionActive = async () => Boolean(await getAdminSession());

export const startAdminSession = async (password) => {
  const email = import.meta.env.VITE_ADMIN_EMAIL;
  if (!email || !password) return false;
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user || !isAdminUser(data.user)) {
    if (data.session) await client.auth.signOut();
    return false;
  }
  return true;
};

export const endAdminSession = async () => {
  if (supabase) await supabase.auth.signOut();
};

export const subscribeToAdminSession = (callback) => {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(Boolean(session && isAdminUser(session.user))));
  return () => data.subscription.unsubscribe();
};
