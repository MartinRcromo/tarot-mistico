'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { TarotCard } from '@/types';
import { tarotCards, getCardsByArcana, getCardsBySuit } from '@/data/tarotCards';

export default function CardLibrary() {
  const [filter, setFilter] = useState<'all' | 'major' | 'cups' | 'pentacles' | 'swords' | 'wands'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const getFilteredCards = () => {
    switch (filter) {
      case 'major':
        return getCardsByArcana('major');
      case 'cups':
        return getCardsBySuit('cups');
      case 'pentacles':
        return getCardsBySuit('pentacles');
      case 'swords':
        return getCardsBySuit('swords');
      case 'wands':
        return getCardsBySuit('wands');
      default:
        return tarotCards;
    }
  };

  const cards = getFilteredCards();

  const filterButtons = [
    { key: 'all', label: 'Todas', count: 78 },
    { key: 'major', label: 'Arcanos Mayores', count: 22 },
    { key: 'cups', label: 'Copas', count: 14 },
    { key: 'pentacles', label: 'Oros', count: 14 },
    { key: 'swords', label: 'Espadas', count: 14 },
    { key: 'wands', label: 'Bastos', count: 14 },
  ];

  return (
    <div className="w-full">
      <h2 className="heading-2 text-center mb-6 gold-accent">
        Biblioteca de Cartas
      </h2>

      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === btn.key
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {btn.label}
            <span className="ml-2 text-xs opacity-70">({btn.count})</span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedCard(card)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass card-hover">
                <Image
                  src={card.image}
                  alt={card.nameEs}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium truncate">
                      {card.nameEs}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {card.arcana === 'major' ? 'Arcano Mayor' : card.suit}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Card detail modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="glass rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-48 h-72 mx-auto md:mx-0 flex-shrink-0">
                  <Image
                    src={selectedCard.image}
                    alt={selectedCard.nameEs}
                    fill
                    className="object-cover rounded-lg"
                    sizes="192px"
                    unoptimized
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="heading-3 gold-accent mb-2">
                    {selectedCard.nameEs}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {selectedCard.name} • {selectedCard.arcana === 'major' ? 'Arcano Mayor' : `${selectedCard.suit} ${selectedCard.number}`}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-purple-300 mb-2">Palabras clave:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-200"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gold-400 font-medium mb-1">Significado Derecho</h4>
                      <p className="text-gray-300 text-sm">{selectedCard.meaningUpright}</p>
                    </div>
                    <div>
                      <h4 className="text-purple-400 font-medium mb-1">Significado Invertido</h4>
                      <p className="text-gray-300 text-sm">{selectedCard.meaningReversed}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedCard(null)}
                className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
