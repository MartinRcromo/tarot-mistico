import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

interface RemoveAdsCardProps {
  adViewCount: number;
}

/**
 * Card promocional que aparece arriba del AdBanner.
 * Solo visible para usuarios free, cada 5to ad view.
 */
export default function RemoveAdsCard({ adViewCount }: RemoveAdsCardProps) {
  const subscriptionStatus = useAuthStore((s) => s.profile?.subscription_status);

  if (subscriptionStatus === 'premium' || subscriptionStatus === 'pro') {
    return null;
  }
  if (adViewCount === 0 || adViewCount % 5 !== 0) {
    return null;
  }

  const handlePress = () => {
    Alert.alert(
      'Proximamente',
      'La suscripcion Premium estara disponible pronto. Sin interrupciones y consultas ilimitadas.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mejora tu experiencia</Text>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Sin anuncios</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(94, 59, 238, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    marginLeft: SPACING.sm,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
