import { useEffect, useState } from 'react';
import { getPricingOverrides, isInlineEditModeActive, loadPricingOverrides, subscribeToInlineEditMode, subscribeToPricing } from '../lib/pricingStorage';

export function usePricingOverrides() {
  const [overrides, setOverrides] = useState(getPricingOverrides);
  useEffect(() => { loadPricingOverrides().catch(() => {}); return subscribeToPricing(() => setOverrides(getPricingOverrides())); }, []);
  return overrides;
}

export function useInlineEditMode() {
  const [active, setActive] = useState(isInlineEditModeActive);
  useEffect(() => subscribeToInlineEditMode(() => setActive(isInlineEditModeActive())), []);
  return active;
}
