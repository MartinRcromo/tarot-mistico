'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InterpretationProps {
  interpretation: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function Interpretation({
  interpretation,
  isLoading = false,
  error = null,
}: InterpretationProps) {
  if (isLoading) {
    return (
      <motion.div
        className="glass rounded-lg p-6 mt-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-purple-300">
            La IA está interpretando tu tirada...
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="h-4 bg-purple-500/20 rounded animate-pulse"
              style={{ width: `${80 + Math.random() * 20}%` }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass rounded-lg p-6 mt-8 max-w-3xl mx-auto border-red-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center text-red-400 mb-2">
          <span className="text-xl mr-2">⚠</span>
          <span className="font-medium">Error</span>
        </div>
        <p className="text-gray-300">{error}</p>
      </motion.div>
    );
  }

  if (!interpretation) {
    return null;
  }

  return (
    <motion.div
      className="glass rounded-lg p-6 mt-8 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">✨</span>
        <h3 className="heading-3 gold-accent m-0">Interpretación</h3>
      </div>
      
      <div className="markdown-content text-gray-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {interpretation}
        </ReactMarkdown>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-sm text-gray-500 italic">
          Recuerda que el tarot es una guía, no un destino fijo. 
          Tú tienes el poder de crear tu propio camino.
        </p>
      </div>
    </motion.div>
  );
}
