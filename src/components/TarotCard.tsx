'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TarotCard as TarotCardType } from '@/types';

interface TarotCardProps {
  card: TarotCardType;
  isReversed?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'w-24 h-36',
  md: 'w-32 h-48',
  lg: 'w-40 h-60',
};

const imageSizes = {
  sm: { width: 96, height: 144 },
  md: { width: 128, height: 192 },
  lg: { width: 160, height: 240 },
};

export default function TarotCardComponent({
  card,
  isReversed = false,
  isFlipped = false,
  onClick,
  showLabel = false,
  label,
  size = 'md',
  disabled = false,
}: TarotCardProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`card-flip-container ${sizeClasses[size]} cursor-pointer relative`}
        onClick={!disabled ? onClick : undefined}
        whileHover={!disabled && !isFlipped ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isFlipped ? { scale: 0.95 } : {}}
      >
        <motion.div
          className="card-flip w-full h-full relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Back */}
          <div
            className="card-front absolute inset-0 rounded-lg overflow-hidden card-pattern flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-gold-400 text-4xl font-serif">✦</div>
          </div>

          {/* Card Front */}
          <div
            className="card-back absolute inset-0 rounded-lg overflow-hidden glass"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className={`relative w-full h-full ${isReversed ? 'rotate-180' : ''}`}>
              <Image
                src={card.image}
                alt={card.nameEs}
                fill
                className="object-cover"
                sizes={`${imageSizes[size].width}px`}
                unoptimized
              />
              {isReversed && (
                <div className="reversed-indicator">Invertida</div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showLabel && label && (
        <div className="position-label mt-2 max-w-[120px] text-center">
          {label}
        </div>
      )}
    </div>
  );
}
