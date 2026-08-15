import { useEffect, useState } from 'react';
import { toast } from '../components/ui/use-toast';
import { isAdminSessionActive, subscribeToAdminSession } from '../lib/adminSession';
import { getPricingError, getPricingOverrides, isInlineEditModeActive, loadPricingOverrides, subscribeToInlineEditMode, subscribeToPricing, subscribeToPricingError } from '../lib/pricingStorage';

let pricingLoadErrorNotified = false;

export function usePricingOverrides() {
  const [overrides, setOverrides] = useState(getPricingOverrides);
  useEffect(() => {
    loadPricingOverrides()
      .then(() => { pricingLoadErrorNotified = false; })
      .catch(() => {
        if (!pricingLoadErrorNotified) {
          pricingLoadErrorNotified = true;
          toast({ title: 'Не удалось загрузить актуальные цены', description: 'Показаны встроенные цены. Попробуйте обновить страницу.', variant: 'destructive' });
        }
      });
    return subscribeToPricing(() => setOverrides(getPricingOverrides()));
  }, []);
  return overrides;
}

export function usePricingError() {
  const [error, setError] = useState(getPricingError);
  useEffect(() => subscribeToPricingError(() => setError(getPricingError())), []);
  return error;
}

export function useInlineEditMode() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      if (!isInlineEditModeActive()) {
        if (mounted) setActive(false);
        return;
      }
      try {
        const isAdmin = await isAdminSessionActive();
        if (mounted) setActive(isAdmin);
      } catch {
        if (mounted) setActive(false);
      }
    };
    verify();
    const unsubscribeInline = subscribeToInlineEditMode(verify);
    const unsubscribeAdmin = subscribeToAdminSession(
      (isAdmin) => { if (mounted) setActive(isInlineEditModeActive() && isAdmin); },
      () => { if (mounted) setActive(false); },
    );
    return () => { mounted = false; unsubscribeInline(); unsubscribeAdmin(); };
  }, []);
  return active;
}
