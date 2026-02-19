import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useConsultation } from '@/hooks/useConsultation';
import CalendlyBooking from '@/components/CalendlyBooking';
import ConsultationCard from '@/components/ConsultationCard';

/** Pantalla de consultas Pro con tarotista en vivo */
export default function ConsultationScreen() {
  const { profile } = useAuth();
  const {
    status,
    consultations,
    isLoading,
    error,
    fetchStatus,
    fetchConsultations,
    bookConsultation,
    cancelConsultation,
  } = useConsultation();
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchConsultations();
  }, []);

  /** Callback cuando se completa el booking en Calendly */
  const handleBookingComplete = async (scheduledAt: string) => {
    setShowCalendly(false);
    try {
      await bookConsultation({ scheduled_at: scheduledAt });
      Alert.alert(
        'Consulta agendada',
        'Tu consulta fue agendada con éxito. Vas a recibir un email de confirmación.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Booking error:', err);
    }
  };

  const handleCancel = async (consultationId: string) => {
    try {
      await cancelConsultation(consultationId);
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Próximamente',
      'La suscripción Pro ($9.99/mes) estará disponible pronto. Incluye 1 consulta semanal con tarotista en vivo.',
      [{ text: 'OK' }]
    );
  };

  // Calcular días hasta reset semanal
  const daysUntilReset = status?.weeklyConsultationResetAt
    ? Math.max(0, Math.ceil(
        (new Date(status.weeklyConsultationResetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ))
    : 7;

  const pastConsultations = consultations.filter((c) => c.status !== 'scheduled');

  if (isLoading && !status) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // ─── No es Pro: pantalla de upgrade ─────────────────
  if (!status?.isPro) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.upgradeContent}>
        <View style={styles.upgradeHeader}>
          <Text style={styles.upgradeIcon}>📞</Text>
          <Text style={styles.upgradeTitle}>Consultas en Vivo{'\n'}con Tarotista</Text>
          <Text style={styles.upgradeSubtitle}>
            Hablá cara a cara con nuestra tarotista experta. Incluye 1 sesión por semana de 30 minutos vía Google Meet.
          </Text>
        </View>

        <View style={styles.benefitsList}>
          <Text style={styles.benefit}>🔮 Lectura personalizada en vivo</Text>
          <Text style={styles.benefit}>💬 Hacé todas tus preguntas</Text>
          <Text style={styles.benefit}>🎯 Orientación profunda</Text>
          <Text style={styles.benefit}>📅 Elegí el horario que te convenga</Text>
        </View>

        <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
          <Text style={styles.upgradeButtonText}>Desbloquear Plan Pro - $9.99/mes</Text>
        </Pressable>

        <Text style={styles.upgradeNote}>
          Incluye todo lo de Premium + consultas en vivo
        </Text>
      </ScrollView>
    );
  }

  // ─── Es Pro ─────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Tu Consulta Semanal</Text>

      {/* Consulta disponible */}
      {!status.weeklyConsultationUsed ? (
        <View style={styles.availableCard}>
          <Text style={styles.availableIcon}>✨</Text>
          <Text style={styles.availableTitle}>Tenés 1 consulta disponible esta semana</Text>
          <Text style={styles.availableSubtitle}>
            Sesión de 30 minutos con tarotista experta vía Google Meet
          </Text>
          <Pressable style={styles.bookButton} onPress={() => setShowCalendly(true)}>
            <Text style={styles.bookButtonText}>📅 Agendar Consulta</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.usedCard}>
          <Text style={styles.usedTitle}>Ya usaste tu consulta de esta semana</Text>

          {/* Próxima consulta agendada */}
          {status.nextConsultation && (
            <View style={styles.nextConsultation}>
              <Text style={styles.nextLabel}>Próxima consulta:</Text>
              <ConsultationCard
                consultation={status.nextConsultation}
                onCancel={handleCancel}
              />
            </View>
          )}

          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              Tu próxima consulta se habilita en {daysUntilReset} {daysUntilReset === 1 ? 'día' : 'días'}
            </Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Historial de consultas */}
      {pastConsultations.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historySectionTitle}>Historial de consultas</Text>
          {pastConsultations.map((c) => (
            <ConsultationCard key={c.id} consultation={c} />
          ))}
        </View>
      )}

      {/* Calendly WebView */}
      <CalendlyBooking
        visible={showCalendly}
        userName={profile?.full_name || undefined}
        userEmail={profile?.email}
        onBookingComplete={handleBookingComplete}
        onClose={() => setShowCalendly(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Upgrade (non-Pro) ───
  upgradeContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  upgradeHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  upgradeIcon: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  upgradeTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  upgradeSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  benefitsList: {
    width: '100%',
    backgroundColor: 'rgba(157, 78, 221, 0.08)',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  benefit: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  upgradeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  upgradeButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  upgradeNote: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
  },

  // ─── Pro ───
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  availableCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  availableIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  availableTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  availableSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    width: '100%',
    alignItems: 'center',
  },
  bookButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  usedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  usedTitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  nextConsultation: {
    marginBottom: SPACING.md,
  },
  nextLabel: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  countdownContainer: {
    backgroundColor: 'rgba(157, 78, 221, 0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  countdownText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  historySection: {
    marginTop: SPACING.md,
  },
  historySectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
});
