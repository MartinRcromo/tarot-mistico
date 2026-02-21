import React from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import type { SpreadOption } from '@/types';

// Nombres de tiradas Oraclia
const SPREADS: SpreadOption[] = [
  {
    id: 'single',
    name: 'Reflexion Rapida',
    description: 'Una carta, una respuesta',
    cardCount: 1,
    icon: '◆',
  },
  {
    id: 'three-card',
    name: 'Pasado, Presente, Futuro',
    description: 'Entende de donde venis y hacia donde vas',
    cardCount: 3,
    icon: '◇',
  },
  {
    id: 'horseshoe',
    name: 'Panorama Completo',
    description: 'Vision amplia de tu situacion',
    cardCount: 7,
    icon: '⬡',
  },
  {
    id: 'celtic-cross',
    name: 'Analisis Profundo',
    description: 'Reflexion completa y detallada',
    cardCount: 10,
    icon: '✦',
  },
];

interface SpreadSelectorProps {
  selected: string | null;
  onSelect: (spread: SpreadOption) => void;
}

/** Selector horizontal de tipo de consulta */
export default function SpreadSelector({ selected, onSelect }: SpreadSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SPREADS.map((spread) => {
        const isActive = selected === spread.id;
        return (
          <Pressable
            key={spread.id}
            style={[styles.card, isActive && styles.cardActive]}
            onPress={() => onSelect(spread)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>{spread.icon}</Text>
            <Text style={[styles.name, isActive && styles.nameActive]}>
              {spread.name}
            </Text>
            <Text style={styles.description}>{spread.description}</Text>
            <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
              <Text style={[styles.countText, isActive && styles.countTextActive]}>
                {spread.cardCount} {spread.cardCount === 1 ? 'carta' : 'cartas'}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(94, 59, 238, 0.08)',
  },
  icon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
    color: COLORS.textMuted,
  },
  iconActive: {
    color: COLORS.primary,
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  nameActive: {
    color: COLORS.primary,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  countBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  countBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  countTextActive: {
    color: COLORS.text,
  },
});
