'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from './TarotCard';
import { TarotCard as TarotCardType, SpreadType } from '@/types';
import { spreads } from '@/data/spreads';

interface DrawnCard {
  cardId: number;
  position: number;
  isReversed: boolean;
}

interface ReadingAreaProps {
  spreadType: string;
  drawnCards: DrawnCard[];
  cardsData: TarotCardType[];
  isShuffling: boolean;
  onCardClick?: (index: number) => void;
  revealedCards?: boolean[];
}

export default function ReadingArea({
  spreadType,
  drawnCards,
  cardsData,
  isShuffling,
  onCardClick,
  revealedCards = [],
}: ReadingAreaProps) {
  const spread = spreads.find(s => s.id === spreadType);
  
  if (!spread) return null;

  const getGridLayout = () => {
    switch (spreadType) {
      case 'single':
        return 'flex justify-center';
      case 'three-card':
        return 'grid grid-cols-3 gap-4 max-w-2xl mx-auto';
      case 'celtic-cross':
        return 'grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto';
      case 'horseshoe':
        return 'grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto';
      default:
        return 'flex flex-wrap justify-center gap-4';
    }
  };

  const getCardPosition = (index: number) => {
    const position = spread.positions[index];
    return position ? position.name : `Carta ${index + 1}`;
  };

  return (
    <div className="w-full">
      <motion.h3
        className="heading-3 text-center mb-8 gold-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {spread.nameEs}
      </motion.h3>

      <div className={`reading-area ${getGridLayout()}`}>
        <AnimatePresence mode="wait">
          {isShuffling ? (
            <motion.div
              key="shuffling"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-32 h-48 rounded-lg card-pattern flex items-center justify-center"
                animate={{
                  rotateY: [0, 180, 360],
                  x: [-20, 20, -20],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-4xl">✦</span>
              </motion.div>
              <p className="mt-4 text-purple-300 animate-pulse">
                Barajando las cartas...
              </p>
            </motion.div>
          ) : (
            drawnCards.map((drawnCard, index) => {
              const card = cardsData.find(c => c.id === drawnCard.cardId);
              if (!card) return null;

              const isRevealed = revealedCards[index] || false;

              return (
                <motion.div
                  key={`${drawnCard.cardId}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <TarotCard
                    card={card}
                    isReversed={drawnCard.isReversed}
                    isFlipped={isRevealed}
                    onClick={() => onCardClick?.(index)}
                    showLabel={true}
                    label={getCardPosition(index)}
                    size={spread.cardCount > 7 ? 'sm' : 'md'}
                    disabled={!onCardClick}
                  />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
