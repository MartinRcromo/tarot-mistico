import { useEffect } from 'react';
import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/LoadingScreen';

/** Root layout — verifica sesión al iniciar */
export default function RootLayout() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, []);

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
