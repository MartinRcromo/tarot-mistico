import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

interface CreditBadgeProps {
  credits: number;
  subscriptionStatus: string;
}

/** Badge que muestra créditos o plan del usuario */
export default function CreditBadge({ credits, subscriptionStatus }: CreditBadgeProps) {
  if (subscriptionStatus === 'pro') {
    return (
      <View style={[styles.badge, { backgroundColor: 'rgba(68, 136, 255, 0.2)' }]}>
        <Text style={[styles.text, { color: COLORS.pro }]}>💎 Pro</Text>
      </View>
    );
  }

  if (subscriptionStatus === 'premium') {
    return (
      <View style={[styles.badge, { backgroundColor: 'rgba(157, 78, 221, 0.2)' }]}>
        <Text style={[styles.text, { color: COLORS.secondary }]}>👑 Premium</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: 'rgba(212, 175, 55, 0.2)' }]}>
      <Text style={[styles.text, { color: COLORS.primary }]}>⭐ {credits}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
