import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import type { Consultation } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  scheduled: COLORS.primary,
  completed: COLORS.success,
  canceled: COLORS.error,
  no_show: COLORS.textMuted,
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendada',
  completed: 'Completada',
  canceled: 'Cancelada',
  no_show: 'No asistió',
};

interface ConsultationCardProps {
  consultation: Consultation;
  onCancel?: (id: string) => void;
}

/** Card con info de una consulta (pasada o futura) */
export default function ConsultationCard({ consultation, onCancel }: ConsultationCardProps) {
  const isFuture = consultation.status === 'scheduled' &&
    consultation.scheduled_at &&
    new Date(consultation.scheduled_at) > new Date();

  const isToday = consultation.scheduled_at &&
    new Date(consultation.scheduled_at).toDateString() === new Date().toDateString();

  const borderColor = STATUS_COLORS[consultation.status] || COLORS.border;

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleJoinMeet = async () => {
    if (consultation.google_meet_url) {
      await WebBrowser.openBrowserAsync(consultation.google_meet_url);
    } else {
      Alert.alert('Sin enlace', 'El enlace de Google Meet aún no está disponible.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar consulta',
      '¿Estás seguro que querés cancelar esta consulta? Se te devolverá la consulta semanal.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => onCancel?.(consultation.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: borderColor + '20' }]}>
          <Text style={[styles.statusText, { color: borderColor }]}>
            {STATUS_LABELS[consultation.status]}
          </Text>
        </View>
        {isToday && consultation.status === 'scheduled' && (
          <Text style={styles.todayBadge}>HOY</Text>
        )}
      </View>

      <Text style={styles.date}>{formatDateTime(consultation.scheduled_at)}</Text>

      {consultation.notes && (
        <Text style={styles.notes}>{consultation.notes}</Text>
      )}

      {isFuture && (
        <View style={styles.actions}>
          {(isToday || consultation.google_meet_url) && (
            <Pressable style={styles.meetButton} onPress={handleJoinMeet}>
              <Text style={styles.meetButtonText}>Unirme a Meet</Text>
            </Pressable>
          )}
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  todayBadge: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  date: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  notes: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  meetButton: {
    flex: 1,
    backgroundColor: '#34a853',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  meetButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
});
