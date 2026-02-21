import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import SpreadSelector from '@/components/SpreadSelector';
import TarotCard from '@/components/TarotCard';
import ReadingResult from '@/components/ReadingResult';
import PaywallModal from '@/components/PaywallModal';
import AdBanner from '@/components/AdBanner';
import RemoveAdsCard from '@/components/RemoveAdsCard';
import UpcomingConsultationBanner from '@/components/UpcomingConsultationBanner';
import * as api from '@/lib/api';
import type { SpreadOption, DrawnCard, DailyQuote, Consultation } from '@/types';

type ReadingPhase = 'select' | 'drawing' | 'interpreting' | 'result';

// Frases reflexivas Oraclia (reemplazan frase del dia generica)
const ORACLIA_QUOTES = [
  'No todo necesita resolverse hoy, pero si ser entendido.',
  'La claridad no llega de golpe. Se construye con cada pregunta.',
  'Decidir tambien es soltar lo que ya no necesitas.',
  'Hoy es un buen dia para mirar de frente lo que venis evitando.',
  'A veces la respuesta esta en la pregunta que no te animas a hacer.',
  'Entender es el primer paso para avanzar.',
  'No busques certezas. Busca claridad.',
];

/** Pantalla principal — Oraclia */
export default function HomeScreen() {
  const { profile, refreshProfile } = useAuth();
  const { credits, isPremium, showPaywall, refreshCredits, dismissPaywall } = useCredits();
  const { showAdIfFree } = useInterstitialAd();

  // Contador de consultas completadas para interstitial (cada 3)
  const readingCount = useRef(0);
  // Contador de ad views para RemoveAdsCard (cada 5to)
  const [adViewCount, setAdViewCount] = useState(0);

  const [phase, setPhase] = useState<ReadingPhase>('select');
  const [selectedSpread, setSelectedSpread] = useState<SpreadOption | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [interpretation, setInterpretation] = useState('');
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [upcomingConsultation, setUpcomingConsultation] = useState<Consultation | null>(null);
  const [error, setError] = useState('');

  // Frase reflexiva local (fallback si la API no devuelve)
  const [localQuote] = useState(() =>
    ORACLIA_QUOTES[Math.floor(Math.random() * ORACLIA_QUOTES.length)]
  );

  useEffect(() => {
    refreshCredits();
    loadDailyQuote();
    loadUpcomingConsultation();
  }, []);

  useEffect(() => {
    if (phase === 'select' && !isPremium) {
      setAdViewCount((prev) => prev + 1);
    }
  }, [phase]);

  const loadUpcomingConsultation = async () => {
    try {
      const status = await api.getConsultationStatus();
      if (status.nextConsultation) {
        setUpcomingConsultation(status.nextConsultation);
      }
    } catch (err) {
      console.log('Home: Could not load consultation status');
    }
  };

  const loadDailyQuote = async () => {
    try {
      const quote = await api.getDailyQuote();
      setDailyQuote(quote);
    } catch (err) {
      console.log('Home: Could not load daily quote');
    }
  };

  /** Inicia la consulta de cartas */
  const handleDraw = async () => {
    if (!selectedSpread) return;
    setError('');

    if (!isPremium && credits <= 0) {
      refreshCredits();
      return;
    }

    setPhase('drawing');
    try {
      const result = await api.drawCards(selectedSpread.id, question || undefined);
      setDrawnCards(result.cards);

      for (let i = 0; i < result.cards.length; i++) {
        await new Promise((r) => setTimeout(r, 600));
        setRevealedCards((prev) => new Set(prev).add(i));
      }

      setPhase('interpreting');
      const interp = await api.getInterpretation(
        result.cards,
        selectedSpread.id,
        question || undefined
      );
      setInterpretation(interp);
      setPhase('result');

      readingCount.current += 1;
      if (readingCount.current % 3 === 0) {
        showAdIfFree(profile?.subscription_status);
      }

      refreshCredits();
      refreshProfile();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al hacer la consulta';
      setError(message);
      setPhase('select');
      console.error('Home: Draw error', err);
    }
  };

  /** Resetea para nueva consulta */
  const handleNewReading = () => {
    setPhase('select');
    setDrawnCards([]);
    setRevealedCards(new Set());
    setInterpretation('');
    setQuestion('');
    setSelectedSpread(null);
    setError('');
    refreshCredits();
  };

  // Texto de la frase a mostrar
  const quoteText = dailyQuote?.quote || localQuote;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de consulta proxima (si es hoy) */}
        {upcomingConsultation && phase === 'select' && (
          <UpcomingConsultationBanner consultation={upcomingConsultation} />
        )}

        {/* Frase reflexiva */}
        {phase === 'select' && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{quoteText}"</Text>
          </View>
        )}

        {/* Fase: Seleccion */}
        {phase === 'select' && (
          <>
            <Text style={styles.sectionTitle}>Elegi tu consulta</Text>
            <SpreadSelector
              selected={selectedSpread?.id ?? null}
              onSelect={setSelectedSpread}
            />

            <View style={styles.questionSection}>
              <Text style={styles.questionLabel}>¿Que queres entender hoy? (opcional)</Text>
              <TextInput
                style={styles.questionInput}
                placeholder="Escribi tu pregunta aca..."
                placeholderTextColor={COLORS.textMuted}
                value={question}
                onChangeText={setQuestion}
                multiline
                maxLength={200}
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              style={[styles.drawButton, !selectedSpread && styles.drawButtonDisabled]}
              onPress={handleDraw}
              disabled={!selectedSpread}
            >
              <Text style={styles.drawButtonText}>Consultar</Text>
            </Pressable>
          </>
        )}

        {/* Fase: Sacando cartas */}
        {(phase === 'drawing' || phase === 'interpreting') && (
          <>
            <Text style={styles.phaseTitle}>
              {phase === 'drawing' ? 'Revelando las cartas...' : 'Preparando tu reflexion...'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsRow}
            >
              {drawnCards.map((card, index) => (
                <TarotCard
                  key={index}
                  cardId={card.cardId}
                  isReversed={card.isReversed}
                  isRevealed={revealedCards.has(index)}
                  position={card.position}
                />
              ))}
            </ScrollView>
            {phase === 'interpreting' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Preparando tu reflexion...</Text>
              </View>
            )}
          </>
        )}

        {/* Fase: Resultado */}
        {phase === 'result' && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsRow}
            >
              {drawnCards.map((card, index) => (
                <TarotCard
                  key={index}
                  cardId={card.cardId}
                  isReversed={card.isReversed}
                  isRevealed={true}
                  position={card.position}
                />
              ))}
            </ScrollView>
            <ReadingResult
              interpretation={interpretation}
              spreadType={selectedSpread?.name ?? ''}
              question={question || undefined}
              onClose={handleNewReading}
            />
          </>
        )}

        {/* Paywall */}
        <PaywallModal
          visible={showPaywall}
          creditsResetAt={profile?.credits_reset_at}
          onDismiss={dismissPaywall}
        />
      </ScrollView>

      {/* Ads fijos en la parte inferior */}
      <RemoveAdsCard adViewCount={adViewCount} />
      <AdBanner />
    </View>
  );
}

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
  quoteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  quoteText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  questionSection: {
    marginTop: SPACING.lg,
  },
  questionLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  questionInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    padding: SPACING.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  drawButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  drawButtonDisabled: {
    opacity: 0.4,
  },
  drawButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  phaseTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  cardsRow: {
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
  },
});
