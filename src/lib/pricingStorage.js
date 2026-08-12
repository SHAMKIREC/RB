import { isAdminSessionActive } from './adminSession';

const KEY = 'rb_pricing_mvp';
const EVENT = 'rb-pricing-changed';
const INLINE_EDIT_KEY = 'rb_inline_edit';
const INLINE_EDIT_EVENT = 'rb-inline-edit-changed';

const read = () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
};

const emit = () => window.dispatchEvent(new CustomEvent(EVENT));

export const getPricingOverrides = () => read();
export const subscribeToPricing = (callback) => {
  const onStorage = (event) => { if (event.key === KEY) callback(); };
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener('storage', onStorage); };
};

export const setPriceOverride = (scope, id, price) => {
  const nextPrice = Number(price);
  if (!Number.isFinite(nextPrice) || nextPrice < 0) return false;
  const current = read();
  const next = { ...current, [scope]: { ...(current[scope] || {}), [id]: nextPrice } };
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
  return true;
};

const priceFrom = (overrides, scope, id, fallback) => {
  const value = overrides?.[scope]?.[id];
  return Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback;
};

export const getCalculatorWorkPrice = (item, overrides = read()) => priceFrom(overrides, 'calculatorWorks', item.id, item.mount);
export const getTurnkeyPrice = (option, overrides = read()) => priceFrom(overrides, 'turnkey', option.id, option.price);
export const getMaterialPrice = (material, overrides = read()) => priceFrom(overrides, 'materials', material.id, material.pricePerPackage);
export const getServiceItemPrice = (item, overrides = read()) => priceFrom(overrides, item.pricingScope || 'serviceItems', item.pricingId || item.id, item.price);
export const getServiceCategoryPrice = (category, overrides = read()) => priceFrom(overrides, category.pricingScope || 'serviceCategories', category.pricingId || category.id, category.priceFromValue);

export const isInlineEditModeActive = () => {
  try { return isAdminSessionActive() && sessionStorage.getItem(INLINE_EDIT_KEY) === '1'; } catch { return false; }
};

export const enableInlineEditMode = () => {
  if (!isAdminSessionActive()) return false;
  sessionStorage.setItem(INLINE_EDIT_KEY, '1');
  window.dispatchEvent(new CustomEvent(INLINE_EDIT_EVENT));
  return true;
};

export const disableInlineEditMode = () => {
  sessionStorage.removeItem(INLINE_EDIT_KEY);
  window.dispatchEvent(new CustomEvent(INLINE_EDIT_EVENT));
};

export const subscribeToInlineEditMode = (callback) => {
  window.addEventListener(INLINE_EDIT_EVENT, callback);
  return () => window.removeEventListener(INLINE_EDIT_EVENT, callback);
};

export { EVENT as PRICING_CHANGED_EVENT };
