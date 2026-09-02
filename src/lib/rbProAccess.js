import { requireSupabase } from './supabaseClient';
import { requireAdminWriteSession } from './adminSession';

const STORAGE_KEY = 'rb-pro-access-token-v1';
const EXPIRY_KEY = 'rb-pro-access-expiry-v1';

export const RB_PRO_TELEGRAM_URL = 'https://t.me/+UYjWeMGCV6I1ZmVi';

export const getRbProToken = () => {
  try {
    const expiresAt = localStorage.getItem(EXPIRY_KEY);
    if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
      clearRbProToken();
      return '';
    }
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const saveRbProToken = (token, expiresAt) => {
  try {
    localStorage.setItem(STORAGE_KEY, token);
    if (expiresAt) localStorage.setItem(EXPIRY_KEY, expiresAt);
  } catch {
    // Access still works for the current page even if persistence is blocked.
  }
};

export const clearRbProToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  } catch {
    // Storage is optional.
  }
};

export async function rbProLogin(code) {
  const { data, error } = await requireSupabase().rpc('rb_pro_login', { p_code: code });
  if (error) {
    const message = error.message || '';
    if (message.includes('RB_PRO_DEVICE_ALREADY_BOUND')) {
      throw new Error('Этот код уже привязан к другому устройству. Попросите администратора сбросить старое устройство.');
    }
    if (message.includes('RB_PRO_INVALID_CODE')) {
      throw new Error('Неверный или отключённый код RB PRO.');
    }
    throw new Error('Не удалось проверить код. Попробуйте ещё раз.');
  }
  const token = data?.token || '';
  if (!token) throw new Error('Сервер не выдал доступ RB PRO.');
  saveRbProToken(token, data?.expires_at);
  return data;
}

export async function rbProCheckAccess() {
  const token = getRbProToken();
  const { data, error } = await requireSupabase().rpc('rb_pro_check_access', { p_token: token || null });
  if (error) return false;
  if (!data && token) clearRbProToken();
  return Boolean(data);
}

export async function createRbProCode(label = '') {
  const client = await requireAdminWriteSession();
  const { data, error } = await client.rpc('rb_pro_create_code', { p_label: label || null });
  if (error) throw new Error(error.message || 'Не удалось создать код RB PRO.');
  return data;
}

export async function listRbProCodes() {
  const client = await requireAdminWriteSession();
  const { data, error } = await client.rpc('rb_pro_list_codes');
  if (error) throw new Error(error.message || 'Не удалось загрузить коды RB PRO.');
  return data || [];
}

export async function setRbProCodeActive(id, active) {
  const client = await requireAdminWriteSession();
  const { data, error } = await client.rpc('rb_pro_set_code_active', { p_code_id: id, p_active: Boolean(active) });
  if (error) throw new Error(error.message || 'Не удалось изменить доступ RB PRO.');
  return Boolean(data);
}

export async function resetRbProDevice(id) {
  const client = await requireAdminWriteSession();
  const { data, error } = await client.rpc('rb_pro_reset_device', { p_code_id: id });
  if (error) throw new Error(error.message || 'Не удалось сбросить устройство RB PRO.');
  return Boolean(data);
}
