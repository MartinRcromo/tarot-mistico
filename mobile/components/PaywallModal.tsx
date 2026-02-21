import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

interface PaywallModalProps {
  visible: boolean;
  creditsResetAt?: string;
  onDismiss: () => void;
}

/** Modal que aparece cuando el usuario llega al limite mensual */
export default function PaywallModal({ visible, creditsResetAt, onDismiss }: PaywallModalProps) {
  const daysUntilReset = creditsResetAt
    ? Math.max(0, Math.ceil((new Date(creditsResetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  const handleUpgrade = () => {
    Alert.alert(
      'Proximamente',
      'La compra in-app estara disponible pronto.',
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
          <Text style={styles.title}>Llegaste al limite mensual</Text>
          <Text style={styles.subtitle}>
            Se renuevan en {daysUntilReset} {daysUntilReset === 1 ? 'dia' : 'dias'}
          </Text>

          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>Con Premium obtenes:</Text>
            <Text style={styles.benefit}>Consultas ilimitadas</Text>
            <Text style={styles.benefit}>Sin interrupciones</Text>
            <Text style={styles.benefit}>Historial completo de reflexiones</Text>
            <Text style={styles.benefit}>Guardado en la nube</Text>
          </View>

          <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Probar 7 dias gratis</Text>
          </Pressable>

          <Pressable style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>Ahora no, gracias</Text>
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
    backgroundColor: 'rgba(94, 59, 238, 0.06)',
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
    backgroundColor: COLORS.accent,
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
