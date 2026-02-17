import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

/** Pantalla de inicio de sesión */
export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Completá todos los campos');
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🔮</Text>
          <Text style={styles.title}>Tarot Místico</Text>
          <Text style={styles.subtitle}>Descubrí lo que las cartas tienen para vos</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </Pressable>

          <Link href="/(auth)/register" asChild>
            <Pressable style={styles.linkContainer}>
              <Text style={styles.linkText}>
                ¿No tenés cuenta?{' '}
                <Text style={styles.linkHighlight}>Registrate</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.title,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    paddingVertical: SPACING.md,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  eyeIcon: {
    fontSize: 18,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  linkContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  linkHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
