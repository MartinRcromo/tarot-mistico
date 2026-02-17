import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Share } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

interface ReadingResultProps {
  interpretation: string;
  spreadType: string;
  question?: string;
  onClose?: () => void;
}

/** Muestra el resultado de la interpretación de IA */
export default function ReadingResult({
  interpretation,
  spreadType,
  question,
  onClose,
}: ReadingResultProps) {
  const handleShare = async () => {
    try {
      const message = question
        ? `🔮 Mi lectura de tarot (${spreadType})\n\nPregunta: ${question}\n\n${interpretation}`
        : `🔮 Mi lectura de tarot (${spreadType})\n\n${interpretation}`;
      await Share.share({ message });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔮 Tu Lectura</Text>
        {question && (
          <Text style={styles.question}>"{question}"</Text>
        )}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Markdown style={markdownStyles}>{interpretation}</Markdown>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Compartir ✨</Text>
        </Pressable>
        {onClose && (
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Nueva tirada</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const markdownStyles = {
  body: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
  },
  heading1: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700' as const,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  heading2: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600' as const,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  heading3: {
    color: COLORS.secondary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  strong: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  em: {
    color: COLORS.secondary,
    fontStyle: 'italic' as const,
  },
  paragraph: {
    marginBottom: SPACING.md,
  },
  list_item: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  bullet_list: {
    marginBottom: SPACING.md,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  header: {
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  question: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  shareButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  shareButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
