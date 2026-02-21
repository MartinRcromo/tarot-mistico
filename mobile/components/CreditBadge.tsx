import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

interface CreditBadgeProps {
  credits: number;
  subscriptionStatus: string;
}

/** Badge que muestra consultas o plan del usuario */
export default function CreditBadge({ credits, subscriptionStatus }: CreditBadgeProps) {
  if (subscriptionStatus === 'pro') {
    return (
      <View style={[styles.badge, { backgroundColor: 'rgba(94, 59, 238, 0.15)' }]}>
        <Text style={[styles.text, { color: COLORS.pro }]}>Pro ✦</Text>
      </View>
    );
  }

  if (subscriptionStatus === 'premium') {
    return (
      <View style={[styles.badge, { backgroundColor: 'rgba(200, 169, 106, 0.15)' }]}>
        <Text style={[styles.text, { color: COLORS.premium }]}>Premium ✦</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: 'rgba(94, 59, 238, 0.1)' }]}>
      <Text style={[styles.text, { color: COLORS.primary }]}>{credits} consultas</Text>
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
