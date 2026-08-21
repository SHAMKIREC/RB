import { supabase } from './supabaseClient';
import { requireAdminWriteSession } from './adminSession';
import { supabaseError } from './mediaStorage';

const EVENT = 'rb-pricing-changed';
const ERROR_EVENT = 'rb-pricing-error';
const INLINE_EDIT_KEY = 'rb_inline_edit';
const INLINE_EDIT_EVENT = 'rb-inline-edit-changed';
let cache = {};
let pricingError = null;
const emit = () => window.dispatchEvent(new CustomEvent(EVENT));
const emitError = () => window.dispatchEvent(new CustomEvent(ERROR_EVENT));

export const getPricingOverrides = () => cache;
export const getPricingError = () => pricingError;
export async function loadPricingOverrides() {
  if (!supabase) {
    pricingError = new Error('Pricing is unavailable because Supabase is not configured.');
    emitError();
    throw pricingError;
  }
  const { data, error } = await supabase.from('pricing_overrides').select('scope,item_id,price');
  if (error) {
    pricingError = supabaseError('Database read error (pricing_overrides)', error);
    emitError();
    throw pricingError;
  }
  cache = (data || []).reduce((result, row) => ({ ...result, [row.scope]: { ...(result[row.scope] || {}), [row.item_id]: Number(row.price) } }), {});
  pricingError = null;
  emitError();
  emit(); return cache;
}
export const subscribeToPricing = (callback) => { window.addEventListener(EVENT, callback); return () => window.removeEventListener(EVENT, callback); };
export const subscribeToPricingError = (callback) => { window.addEventListener(ERROR_EVENT, callback); return () => window.removeEventListener(ERROR_EVENT, callback); };
export async function setPriceOverride(scope, id, price) {
  const nextPrice = Number(price); if (!Number.isFinite(nextPrice) || nextPrice < 0) return false;
  const client = await requireAdminWriteSession();
  const { error } = await client.from('pricing_overrides').upsert({ scope, item_id: id, price: nextPrice }, { onConflict: 'scope,item_id' });
  if (error) throw supabaseError('Database update error (pricing_overrides)', error);
  cache = { ...cache, [scope]: { ...(cache[scope] || {}), [id]: nextPrice } }; emit(); return true;
}
const priceFrom = (overrides, scope, id, fallback) => { const value = overrides?.[scope]?.[id]; return Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback; };
export const getCalculatorWorkPrice = (item, overrides = cache) => priceFrom(overrides, 'calculatorWorks', item.id, item.mount);
export const getTurnkeyPrice = (option, overrides = cache) => priceFrom(overrides, 'turnkey', option.id, option.price);
export const getMaterialPrice = (material, overrides = cache) => priceFrom(overrides, 'materials', material.id, material.pricePerPackage);
export const getServiceItemPrice = (item, overrides = cache) => priceFrom(overrides, item.pricingScope || 'serviceItems', item.pricingId || item.id, item.price);
export const getServiceCategoryPrice = (category, overrides = cache) => priceFrom(overrides, category.pricingScope || 'serviceCategories', category.pricingId || category.id, category.priceFromValue);
export const isInlineEditModeActive = () => { try { return sessionStorage.getItem(INLINE_EDIT_KEY) === '1'; } catch { return false; } };
export const enableInlineEditMode = () => { sessionStorage.setItem(INLINE_EDIT_KEY, '1'); window.dispatchEvent(new CustomEvent(INLINE_EDIT_EVENT)); return true; };
export const disableInlineEditMode = () => { sessionStorage.removeItem(INLINE_EDIT_KEY); window.dispatchEvent(new CustomEvent(INLINE_EDIT_EVENT)); };
export const subscribeToInlineEditMode = (callback) => { window.addEventListener(INLINE_EDIT_EVENT, callback); return () => window.removeEventListener(INLINE_EDIT_EVENT, callback); };
export { EVENT as PRICING_CHANGED_EVENT };
