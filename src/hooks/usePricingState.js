import { useEffect, useState } from 'react';
import { getPricingOverrides, isInlineEditModeActive, subscribeToInlineEditMode, subscribeToPricing } from '../lib/pricingStorage';

export function usePricingOverrides() {
  const [overrides, setOverrides] = useState(getPricingOverrides);
  useEffect(() => subscribeToPricing(() => setOverrides(getPricingOverrides())), []);
  return overrides;
}

export function useInlineEditMode() {
  const [active, setActive] = useState(isInlineEditModeActive);
  useEffect(() => subscribeToInlineEditMode(() => setActive(isInlineEditModeActive())), []);
  return active;
}
