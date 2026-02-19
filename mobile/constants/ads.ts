import { TestIds } from 'react-native-google-mobile-ads';

/** Ad Unit IDs — usa IDs de prueba en desarrollo, reales en producción */
export const AD_IDS = {
  BANNER: __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-1071804711955925/6844546572',
  INTERSTITIAL: __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-1071804711955925/5387170269',
};
