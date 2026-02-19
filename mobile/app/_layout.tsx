import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/LoadingScreen';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import mobileAds from 'react-native-google-mobile-ads';

/** Root layout — verifica sesión e inicializa ads al iniciar */
export default function RootLayout() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
    initializeAds();
  }, []);

  /** Pide permiso de tracking (iOS ATT) e inicializa AdMob */
  async function initializeAds() {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await requestTrackingPermissionsAsync();
        console.log('ATT permission status:', status);
      }
      await mobileAds().initialize();
      console.log('AdMob initialized');
    } catch (err) {
      console.log('Ads init error (non-blocking):', err);
    }
  }

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}
