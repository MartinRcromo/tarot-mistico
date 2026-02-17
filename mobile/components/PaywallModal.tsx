import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

interface PaywallModalProps {
  visible: boolean;
  creditsResetAt?: string;
  onDismiss: () => void;
}

/** Modal que aparece cuando el usuario se queda sin créditos */
export default function PaywallModal({ visible, creditsResetAt, onDismiss }: PaywallModalProps) {
  const daysUntilReset = creditsResetAt
    ? Math.max(0, Math.ceil((new Date(creditsResetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  const handleUpgrade = () => {
    Alert.alert(
      'Próximamente',
      'La compra in-app estará disponible pronto. ¡Gracias por tu interés!',
      [{ text: 'OK' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.emoji}>🌙</Text>
          <Text style={styles.title}>¡Se acabaron tus créditos!</Text>
          <Text style={styles.subtitle}>
            Tus créditos se renuevan en {daysUntilReset} {daysUntilReset === 1 ? 'día' : 'días'}
          </Text>

          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>✨ Con Premium obtenés:</Text>
            <Text style={styles.benefit}>🔮 Lecturas ilimitadas</Text>
            <Text style={styles.benefit}>📖 Historial completo</Text>
            <Text style={styles.benefit}>🌟 Interpretaciones más profundas</Text>
            <Text style={styles.benefit}>💬 Preguntas de seguimiento</Text>
          </View>

          <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Desbloquear Premium 👑</Text>
          </Pressable>

          <Pressable style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>Quizás después</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  benefits: {
    width: '100%',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  benefitsTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  benefit: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  upgradeButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  dismissButton: {
    paddingVertical: SPACING.sm,
  },
  dismissButtonText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
});
