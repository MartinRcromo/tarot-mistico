import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '@/constants/theme';

/** Pantalla 404 */
export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'No encontrado' }} />
      <Text style={styles.emoji}>🌙</Text>
      <Text style={styles.title}>Las estrellas no encontraron esta página</Text>
      <Text style={styles.subtitle}>La ruta que buscás no existe</Text>
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
