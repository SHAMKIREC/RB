const SESSION_KEY = 'rb_admin_session';
const SESSION_TTL = 1000 * 60 * 60 * 8;

export const isAdminSessionActive = () => {
  try { return Number(sessionStorage.getItem(SESSION_KEY)) > Date.now(); } catch { return false; }
};

export const startAdminSession = (pin) => {
  const configuredPin = import.meta.env.VITE_ADMIN_PIN;
  if (!configuredPin || pin !== configuredPin) return false;
  sessionStorage.setItem(SESSION_KEY, String(Date.now() + SESSION_TTL));
  return true;
};

export const endAdminSession = () => sessionStorage.removeItem(SESSION_KEY);
