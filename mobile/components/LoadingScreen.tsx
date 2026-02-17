import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONT_SIZE } from '@/constants/theme';

interface LoadingScreenProps {
  message?: string;
}

/** Pantalla de carga con animación pulse */
export default function LoadingScreen({ message }: LoadingScreenProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Text style={styles.logo}>🔮</Text>
      </Animated.View>
      <Text style={styles.text}>
        {message || 'Consultando las estrellas...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 72,
  },
  text: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    fontStyle: 'italic',
  },
});
