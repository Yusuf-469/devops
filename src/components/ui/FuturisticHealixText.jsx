import React from 'react';
import { motion } from 'framer-motion';

// Futuristic animated Healix text component - Consistent across all locations
export const FuturisticHealixText = ({ size = 'default', showTagline = true, className = '' }) => {
  const sizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
    hero: 'text-4xl md:text-5xl'
  };

  const taglineSizes = {
    small: 'text-[8px]',
    default: 'text-[10px]',
    large: 'text-xs',
    hero: 'text-sm'
  };

  const textSize = sizes[size] || sizes.default;
  const taglineSize = taglineSizes[size] || taglineSizes.default;

  // Letter animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200
      }
    }
  };

  const letters = 'Healix'.split('');

  return (
    <motion.div 
      className={`relative flex flex-col items-start ${className}`}
      initial="hidden"
      animate="visible"
    >
      {/* Main animated text */}
      <motion.span 
        className={`${textSize} font-black tracking-wider relative inline-flex`}
        variants={container}
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(20, 184, 166, 0.5)'
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      {/* Tagline */}
      {showTagline && (
        <motion.span
          className={`${taglineSize} text-cyan-400/80 tracking-[0.25em] uppercase mt-0.5`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          AI Driven Healthcare
        </motion.span>
      )}

      {/* Glowing underline */}
      <motion.div
        className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #14b8a6, #06b6d4, #22d3ee, #06b6d4, #14b8a6, transparent)',
          backgroundSize: '200% 100%'
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.8 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      />
    </motion.div>
  );
};

// Compact version for navigation bars - Same style, smaller size
export const FuturisticHealixCompact = ({ showTagline = true, className = '' }) => {
  // Letter animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200
      }
    }
  };

  const letters = 'Healix'.split('');

  return (
    <motion.div 
      className={`relative flex flex-col items-start ${className}`}
      initial="hidden"
      animate="visible"
    >
      {/* Main animated text */}
      <motion.span 
        className="text-xl font-black tracking-wider relative inline-flex"
        variants={container}
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      {/* Tagline */}
      {showTagline && (
        <motion.span
          className="text-[10px] text-cyan-400/80 tracking-[0.25em] uppercase mt-0.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          AI Driven Healthcare
        </motion.span>
      )}

      {/* Glowing underline */}
      <motion.div
        className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #14b8a6, #06b6d4, #22d3ee, #06b6d4, #14b8a6, transparent)'
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.8 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      />
    </motion.div>
  );
};

// Glowing text with scanline effect - Same style with scanline overlay
export const FuturisticHealixScanline = ({ showTagline = false, className = '' }) => {
  // Letter animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200
      }
    }
  };

  const letters = 'Healix'.split('');

  return (
    <motion.div 
      className={`relative flex flex-col items-start ${className}`}
      initial="hidden"
      animate="visible"
    >
      {/* Main animated text */}
      <motion.span 
        className="text-xl font-black tracking-wider relative inline-flex"
        variants={container}
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      {/* Tagline */}
      {showTagline && (
        <motion.span
          className="text-[10px] text-cyan-400/80 tracking-[0.25em] uppercase mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          AI Driven Healthcare
        </motion.span>
      )}

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ mixBlendMode: 'overlay' }}
      >
        <motion.div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          animate={{
            top: ['0%', '100%', '0%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FuturisticHealixText;
