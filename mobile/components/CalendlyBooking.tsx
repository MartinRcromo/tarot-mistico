import React, { useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

const CALENDLY_BASE_URL = 'https://calendly.com/martincromosol/regresion-a-vidas-pasadas-sesion-individual';

interface CalendlyBookingProps {
  visible: boolean;
  userName?: string;
  userEmail?: string;
  onBookingComplete: (scheduledAt: string) => void;
  onClose: () => void;
}

/** Modal con WebView para agendar en Calendly */
export default function CalendlyBooking({
  visible,
  userName,
  userEmail,
  onBookingComplete,
  onClose,
}: CalendlyBookingProps) {
  const hasBooked = useRef(false);

  // Construir URL con prefill
  const params = new URLSearchParams();
  if (userName) params.set('name', userName);
  if (userEmail) params.set('email', userEmail);
  const calendlyUrl = params.toString()
    ? `${CALENDLY_BASE_URL}?${params.toString()}`
    : CALENDLY_BASE_URL;

  /** Detectar cuando Calendly completa el booking */
  const handleNavigationChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    console.log('CalendlyBooking: Navigation to', url);

    // Calendly redirige a una URL de confirmación después del booking
    if (
      !hasBooked.current &&
      (url.includes('calendly.com/scheduled_events') ||
       url.includes('confirmed') ||
       url.includes('invitees'))
    ) {
      hasBooked.current = true;
      // Usar la fecha actual como fallback — el backend la usa como scheduled_at
      const scheduledAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      onBookingComplete(scheduledAt);
    }
  };

  const handleClose = () => {
    hasBooked.current = false;
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Agendar Consulta</Text>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <WebView
          source={{ uri: calendlyUrl }}
          style={styles.webview}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Cargando calendario...</Text>
            </View>
          )}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
  },
});
