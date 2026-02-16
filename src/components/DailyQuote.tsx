'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DailyQuoteProps {
  quote: string;
  author: string;
}

export default function DailyQuote({ quote, author }: DailyQuoteProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      className="glass rounded-lg p-4 max-w-2xl mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-gold-400 mr-2">✦</span>
            <span className="text-sm text-purple-300 font-medium">
              Frase del Día
            </span>
          </div>
          <blockquote className="text-gray-200 italic text-lg leading-relaxed">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <cite className="text-sm text-gray-400 mt-2 block not-italic">
            — {author}
          </cite>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-300 transition-colors ml-4"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
