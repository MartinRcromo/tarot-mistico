import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useConsultation } from '@/hooks/useConsultation';

/** Pantalla de perfil del usuario */
export default function ProfileScreen() {
  const { profile, logout, refreshProfile } = useAuth();
  const { credits, subscriptionStatus, isPremium, refreshCredits } = useCredits();
  const { status: consultationStatus, fetchStatus: fetchConsultationStatus } = useConsultation();

  useEffect(() => {
    refreshProfile();
    refreshCredits();
    fetchConsultationStatus();
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Proximamente',
      'La suscripcion Premium estara disponible pronto.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesion', '¿Estas seguro que queres cerrar sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesion',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const statusLabel = subscriptionStatus === 'pro'
    ? 'Pro \u2726'
    : subscriptionStatus === 'premium'
      ? 'Premium \u2726'
      : 'Plan Inicial';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(profile?.full_name)}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Usuario'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {/* Info cards */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suscripcion</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Estado</Text>
          <Text style={styles.cardValue}>{statusLabel}</Text>
        </View>
        {!isPremium && (
          <>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Consultas restantes</Text>
              <Text style={[styles.cardValue, { color: COLORS.primary }]}>
                {credits}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Se renuevan</Text>
              <Text style={styles.cardValue}>
                {formatDate(profile?.credits_reset_at)}
              </Text>
            </View>
          </>
        )}
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Miembro desde</Text>
          <Text style={styles.cardValue}>
            {formatDate(profile?.created_at)}
          </Text>
        </View>
      </View>

      {/* Pro consultation section */}
      {subscriptionStatus === 'pro' && consultationStatus && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sesiones</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Sesion semanal</Text>
            <Text style={[styles.cardValue, {
              color: consultationStatus.weeklyConsultationUsed ? COLORS.textMuted : COLORS.success,
            }]}>
              {consultationStatus.weeklyConsultationUsed ? 'Usada' : 'Disponible'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Proxima sesion</Text>
            <Text style={styles.cardValue}>
              {consultationStatus.nextConsultation?.scheduled_at
                ? new Date(consultationStatus.nextConsultation.scheduled_at).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'Sin agendar'}
            </Text>
          </View>
          <Pressable
            style={styles.consultationLink}
            onPress={() => router.push('/(tabs)/consultation')}
          >
            <Text style={styles.consultationLinkText}>Ir a Sesiones →</Text>
          </Pressable>
        </View>
      )}

      {/* Upgrade button */}
      {!isPremium && (
        <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
          <Text style={styles.upgradeButtonText}>Desbloquear Plan Premium</Text>
        </Pressable>
      )}

      {/* Logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  email: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  cardValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  upgradeButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  consultationLink: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  consultationLinkText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
