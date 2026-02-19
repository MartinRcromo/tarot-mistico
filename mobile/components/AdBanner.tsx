import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_IDS } from '@/constants/ads';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING } from '@/constants/theme';

/** Banner de AdMob — solo visible para usuarios del plan free */
export default function AdBanner() {
  const subscriptionStatus = useAuthStore((s) => s.profile?.subscription_status);
  const [adLoaded, setAdLoaded] = useState(false);

  // No mostrar ads a usuarios premium o pro
  if (subscriptionStatus === 'premium' || subscriptionStatus === 'pro') {
    return null;
  }

  return (
    <View style={[styles.container, !adLoaded && styles.hidden]}>
      <BannerAd
        unitId={AD_IDS.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={() => {
          setAdLoaded(true);
          console.log('AdBanner: Ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          setAdLoaded(false);
          console.log('AdBanner: Failed to load', error.message);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});
