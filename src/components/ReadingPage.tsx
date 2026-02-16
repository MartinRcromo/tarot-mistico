'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpreadSelector from './SpreadSelector';
import ReadingArea from './ReadingArea';
import Interpretation from './Interpretation';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

interface DrawnCard {
  cardId: number;
  position: number;
  isReversed: boolean;
}

export default function ReadingPage() {
  const [selectedSpread, setSelectedSpread] = useState('single');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [readingComplete, setReadingComplete] = useState(false);

  const handleDrawCards = async () => {
    setIsShuffling(true);
    setInterpretation('');
    setInterpretationError(null);
    setReadingComplete(false);
    setRevealedCards([]);

    try {
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadType: selectedSpread }),
      });

      if (!response.ok) {
        throw new Error('Failed to draw cards');
      }

      const data = await response.json();
      setDrawnCards(data.cards);
      setRevealedCards(new Array(data.cards.length).fill(false));
    } catch (error) {
      console.error('Error drawing cards:', error);
      setInterpretationError('Error al barajar las cartas. Intenta de nuevo.');
    } finally {
      setIsShuffling(false);
    }
  };

  const handleCardClick = (index: number) => {
    if (revealedCards[index]) return;

    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);

    // Check if all cards are revealed
    if (newRevealed.every(r => r)) {
      setReadingComplete(true);
    }
  };

  const handleGetInterpretation = async () => {
    if (drawnCards.length === 0) return;

    setIsLoadingInterpretation(true);
    setInterpretationError(null);

    try {
      const spread = spreads.find(s => s.id === selectedSpread);
      
      const cardsWithPositions = drawnCards.map((dc, index) => ({
        cardId: dc.cardId,
        position: dc.position,
        isReversed: dc.isReversed,
        positionName: spread?.positions[index]?.name || `Posición ${index + 1}`,
      }));

      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cardsWithPositions,
          spreadType: selectedSpread,
          question: question.trim() || undefined,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setInterpretationError(data.message || 'Has alcanzado el límite de lecturas. Por favor espera unos minutos.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to get interpretation');
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error('Error getting interpretation:', error);
      setInterpretationError('Error al generar la interpretación. Intenta de nuevo más tarde.');
    } finally {
      setIsLoadingInterpretation(false);
    }
  };

  const spread = spreads.find(s => s.id === selectedSpread);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      {/* Question input */}
      <motion.div
        className="max-w-xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="block text-gray-300 text-sm mb-2">
          ¿Tienes una pregunta en mente? (opcional)
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
          maxLength={200}
        />
      </motion.div>

      {/* Spread Selector */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SpreadSelector
          selectedSpread={selectedSpread}
          onSelect={setSelectedSpread}
        />
      </motion.div>

      {/* Draw Button */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleDrawCards}
          disabled={isShuffling}
          className="mystic-button px-8 py-4 rounded-lg text-white font-medium text-lg disabled:opacity-50"
        >
          {isShuffling ? (
            <span className="flex items-center">
              <motion.span
                className="inline-block mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ✦
              </motion.span>
              Barajando...
            </span>
          ) : drawnCards.length > 0 ? (
            'Nueva Tirada'
          ) : (
            'Realizar Tirada'
          )}
        </button>
      </motion.div>

      {/* Reading Area */}
      {drawnCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <ReadingArea
            spreadType={selectedSpread}
            drawnCards={drawnCards}
            cardsData={tarotCards}
            isShuffling={isShuffling}
            onCardClick={handleCardClick}
            revealedCards={revealedCards}
          />

          {/* Instructions */}
          {!revealedCards.every(r => r) && (
            <motion.p
              className="text-center text-purple-300 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✨ Haz clic en cada carta para revelar su mensaje ✨
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Get Interpretation Button */}
      {readingComplete && !interpretation && !isLoadingInterpretation && (
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={handleGetInterpretation}
            className="mystic-button px-8 py-4 rounded-lg text-white font-medium text-lg"
          >
            <span className="flex items-center">
              <span className="mr-2">🔮</span>
              Obtener Interpretación con IA
            </span>
          </button>
        </motion.div>
      )}

      {/* Interpretation */}
      <Interpretation
        interpretation={interpretation}
        isLoading={isLoadingInterpretation}
        error={interpretationError}
      />

      {/* Rate Limit Info */}
      <motion.p
        className="text-center text-gray-500 text-sm mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Límite: 3 lecturas cada 5 minutos para garantizar la calidad del servicio.
      </motion.p>
    </div>
  );
}
