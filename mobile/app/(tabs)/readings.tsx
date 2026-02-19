import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import { useReadings } from '@/hooks/useReadings';
import AdBanner from '@/components/AdBanner';
import type { Reading } from '@/types';

const SPREAD_LABELS: Record<string, string> = {
  single: 'Una carta',
  'three-card': 'Tres cartas',
  horseshoe: 'Herradura',
  'celtic-cross': 'Cruz Celta',
  custom: 'Personalizada',
};

/** Pantalla de historial de lecturas */
export default function ReadingsScreen() {
  const { readings, isLoading, error, fetchReadings } = useReadings();

  useEffect(() => {
    fetchReadings();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = useCallback(({ item }: { item: Reading }) => {
    const preview = item.interpretation
      ? item.interpretation.substring(0, 100).replace(/[#*_]/g, '') + '...'
      : 'Sin interpretación';

    return (
      <Pressable
        style={styles.readingCard}
        onPress={() => router.push(`/reading/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.spreadType}>
            🔮 {SPREAD_LABELS[item.spread_type] ?? item.spread_type}
          </Text>
          <Text style={styles.cardCount}>{item.cards.length} cartas</Text>
        </View>
        {item.question && (
          <Text style={styles.question} numberOfLines={1}>
            "{item.question}"
          </Text>
        )}
        <Text style={styles.preview} numberOfLines={2}>
          {preview}
        </Text>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
      </Pressable>
    );
  }, []);

  if (isLoading && readings.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchReadings}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          readings.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchReadings}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>Todavía no hiciste ninguna tirada</Text>
            <Text style={styles.emptySubtitle}>
              Hacé tu primera lectura y aparecerá acá
            </Text>
          </View>
        }
      />

      {/* Banner ad fijo en la parte inferior */}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  readingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  spreadType: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  cardCount: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  question: {
    color: COLORS.secondary,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  preview: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: SPACING.md,
    margin: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
  },
  retryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  retryText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
  },
});
