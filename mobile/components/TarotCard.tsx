import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Image, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

interface TarotCardProps {
  cardId: number;
  isReversed: boolean;
  isRevealed: boolean;
  position?: number;
  positionName?: string;
  onPress?: () => void;
}

const CARD_WIDTH = 120;
const CARD_HEIGHT = 200;

/** Carta de tarot con animación flip 3D */
export default function TarotCard({
  cardId,
  isReversed,
  isRevealed,
  position,
  positionName,
  onPress,
}: TarotCardProps) {
  const flip = useSharedValue(0);

  useEffect(() => {
    if (isRevealed) {
      flip.value = withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) });
    } else {
      flip.value = 0;
    }
  }, [isRevealed]);

  // Lado frontal (dorso de la carta): visible cuando flip = 0
  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
    };
  });

  // Lado trasero (cara de la carta): visible cuando flip = 1
  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        ...(isReversed ? [{ rotate: '180deg' }] : []),
      ],
      backfaceVisibility: 'hidden' as const,
    };
  });

  // Generar URL de imagen de la carta
  const cardImageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/RWS_Tarot_00_Fool.jpg/136px-RWS_Tarot_00_Fool.jpg`;

  return (
    <View style={styles.container}>
      {positionName && (
        <Text style={styles.positionLabel} numberOfLines={1}>
          {position}. {positionName}
        </Text>
      )}
      <Pressable onPress={onPress} style={styles.cardWrapper}>
        {/* Dorso de la carta */}
        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
          <View style={styles.backDesign}>
            <Text style={styles.backSymbol}>✦</Text>
            <View style={styles.backBorder}>
              <Text style={styles.backText}>O</Text>
            </View>
            <Text style={styles.backSymbol}>✦</Text>
          </View>
        </Animated.View>

        {/* Cara de la carta */}
        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <Image
            source={{ uri: cardImageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardIdBadge}>
            <Text style={styles.cardIdText}>#{cardId}</Text>
          </View>
          {isReversed && (
            <View style={styles.reversedBadge}>
              <Text style={styles.reversedText}>Invertida</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  positionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    maxWidth: CARD_WIDTH,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: RADIUS.md,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardFront: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  backDesign: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  backSymbol: {
    color: COLORS.primary,
    fontSize: 24,
  },
  backBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
  },
  cardIdBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  cardIdText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  reversedBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255,68,68,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  reversedText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '600',
  },
});
