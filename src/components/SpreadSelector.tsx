'use client';

import { motion } from 'framer-motion';
import { SpreadType } from '@/types';
import { spreads } from '@/data/spreads';

interface SpreadSelectorProps {
  selectedSpread: string;
  onSelect: (spreadId: string) => void;
}

export default function SpreadSelector({ selectedSpread, onSelect }: SpreadSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="heading-3 text-center mb-6 gold-accent">
        Selecciona tu Tirada
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {spreads.map((spread, index) => (
          <motion.button
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
              selectedSpread === spread.id
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-lg font-medium text-white">
                {spread.nameEs}
              </span>
              <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                {spread.cardCount} cartas
              </span>
            </div>
            
            <p className="text-sm text-gray-400 line-clamp-3">
              {spread.description}
            </p>
            
            {selectedSpread === spread.id && (
              <motion.div
                className="mt-3 flex items-center text-purple-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="mr-2">✦</span>
                Seleccionado
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
