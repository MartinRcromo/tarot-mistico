import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import type { Consultation } from '@/types';

interface UpcomingConsultationBannerProps {
  consultation: Consultation;
}

/** Banner que aparece en Home si hay una consulta agendada para hoy */
export default function UpcomingConsultationBanner({ consultation }: UpcomingConsultationBannerProps) {
  if (!consultation.scheduled_at) return null;

  const scheduledDate = new Date(consultation.scheduled_at);
  const isToday = scheduledDate.toDateString() === new Date().toDateString();

  if (!isToday) return null;

  const time = scheduledDate.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleJoinMeet = async () => {
    if (consultation.google_meet_url) {
      await WebBrowser.openBrowserAsync(consultation.google_meet_url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>📞 Tu consulta es hoy a las {time}</Text>
        <Text style={styles.subtitle}>Sesión con tarotista en vivo</Text>
      </View>
      {consultation.google_meet_url && (
        <Pressable style={styles.button} onPress={handleJoinMeet}>
          <Text style={styles.buttonText}>Unirme</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(157, 78, 221, 0.15)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#34a853',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xl,
    marginLeft: SPACING.sm,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
