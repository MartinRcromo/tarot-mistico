import { useState, useCallback } from 'react';
import * as api from '@/lib/api';
import type { CreditsInfo } from '@/types';

/** Hook para manejar créditos del usuario */
export function useCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const refreshCredits = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: CreditsInfo = await api.getCredits();
      setCredits(data.credits_remaining);
      setSubscriptionStatus(data.subscription_status);
      setIsPremium(data.is_premium);

      // Mostrar paywall si no tiene créditos y no es premium
      if (data.credits_remaining === 0 && !data.is_premium) {
        setShowPaywall(true);
      }

      console.log('useCredits: Refreshed', data);
    } catch (err) {
      console.error('useCredits: Error refreshing', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dismissPaywall = useCallback(() => {
    setShowPaywall(false);
  }, []);

  return {
    credits,
    subscriptionStatus,
    isPremium,
    isLoading,
    showPaywall,
    refreshCredits,
    dismissPaywall,
  };
}
