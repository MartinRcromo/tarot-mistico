import { useEffect, useCallback, useRef } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AD_IDS } from '@/constants/ads';

const interstitial = InterstitialAd.createForAdRequest(AD_IDS.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: false,
});

/**
 * Hook para manejar interstitial ads.
 * Precarga al montar, expone showAdIfFree() para mostrar solo a usuarios free.
 */
export function useInterstitialAd() {
  const isLoaded = useRef(false);

  useEffect(() => {
    const loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      isLoaded.current = true;
      console.log('Interstitial: Loaded');
    });

    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      isLoaded.current = false;
      console.log('Interstitial: Closed, preloading next');
      // Precargar el siguiente después de cerrar
      interstitial.load();
    });

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      isLoaded.current = false;
      console.log('Interstitial: Error loading', error.message);
    });

    // Precargar al montar
    interstitial.load();

    return () => {
      loadedListener();
      closedListener();
      errorListener();
    };
  }, []);

  /** Muestra el interstitial solo si el usuario es free y el ad está cargado */
  const showAdIfFree = useCallback((subscriptionStatus: string | undefined) => {
    if (subscriptionStatus === 'premium' || subscriptionStatus === 'pro') {
      console.log('Interstitial: Skipped (user is premium/pro)');
      return;
    }

    if (isLoaded.current) {
      interstitial.show();
      console.log('Interstitial: Showing ad');
    } else {
      console.log('Interstitial: Not loaded yet, skipping');
      // Intentar cargar para la próxima vez
      interstitial.load();
    }
  }, []);

  return { showAdIfFree };
}
