import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Share,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import TarotCard from '@/components/TarotCard';
import AdBanner from '@/components/AdBanner';
import type { Reading } from '@/types';

const SPREAD_LABELS: Record<string, string> = {
  single: 'Reflexion Rapida',
  'three-card': 'Pasado, Presente, Futuro',
  horseshoe: 'Panorama Completo',
  'celtic-cross': 'Analisis Profundo',
  custom: 'Personalizada',
};

/** Pantalla de detalle de una reflexion pasada */
export default function ReadingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reading, setReading] = useState<Reading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReading();
  }, [id]);

  const loadReading = async () => {
    setIsLoading(true);
    try {
      // Fetch from API — uses the same readings list endpoint
      const { default: axios } = await import('axios');
      const { getToken } = await import('@/lib/storage');
      const { API_URL } = await import('@/constants/theme');

      const token = await getToken();
      const { data } = await axios.get(`${API_URL}/api/user/readings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReading(data.reading);
    } catch (err) {
      console.error('ReadingDetail: Error loading', err);
      setError('No se pudo cargar la reflexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!reading?.interpretation) return;
    try {
      const message = reading.question
        ? `Mi reflexion en Oraclia\n\nPregunta: ${reading.question}\n\n${reading.interpretation}`
        : `Mi reflexion en Oraclia\n\n${reading.interpretation}`;
      await Share.share({ message });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Cargando...' }} />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !reading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>{error || 'Reflexion no encontrada'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: SPREAD_LABELS[reading.spread_type] ?? reading.spread_type,
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
        }}
      />

      {/* Meta info */}
      <View style={styles.meta}>
        <Text style={styles.metaSpread}>
          {SPREAD_LABELS[reading.spread_type] ?? reading.spread_type}
        </Text>
        <Text style={styles.metaDate}>{formatDate(reading.created_at)}</Text>
      </View>

      {reading.question && (
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>"{reading.question}"</Text>
        </View>
      )}

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
      >
        {reading.cards.map((card, index) => (
          <TarotCard
            key={index}
            cardId={card.cardId}
            isReversed={card.isReversed}
            isRevealed={true}
            position={card.position}
          />
        ))}
      </ScrollView>

      {/* Interpretation */}
      {reading.interpretation && (
        <View style={styles.interpretationBox}>
          <Markdown style={markdownStyles}>{reading.interpretation}</Markdown>
        </View>
      )}

      {/* Share button */}
      <Pressable style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareText}>Compartir</Text>
      </Pressable>
    </ScrollView>

    {/* Banner ad fijo en la parte inferior */}
    <AdBanner />
    </View>
  );
}

const markdownStyles = {
  body: { color: COLORS.text, fontSize: FONT_SIZE.md, lineHeight: 24 },
  heading1: { color: COLORS.primary, fontSize: FONT_SIZE.xl, fontWeight: '700' as const, marginTop: SPACING.lg },
  heading2: { color: COLORS.primary, fontSize: FONT_SIZE.lg, fontWeight: '600' as const, marginTop: SPACING.md },
  heading3: { color: COLORS.primary, fontSize: FONT_SIZE.md, fontWeight: '600' as const, marginTop: SPACING.md },
  strong: { color: COLORS.primary, fontWeight: '600' as const },
  em: { color: COLORS.textMuted, fontStyle: 'italic' as const },
  paragraph: { marginBottom: SPACING.md },
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metaSpread: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  metaDate: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  questionBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  questionText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
  },
  cardsRow: {
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  interpretationBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  shareText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
  },
});
