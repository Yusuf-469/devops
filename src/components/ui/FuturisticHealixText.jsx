import React from 'react';
import { motion } from 'framer-motion';

// Futuristic animated Healix text component
export const FuturisticHealixText = ({ size = 'default', showTagline = true, className = '' }) => {
  const sizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
    hero: 'text-4xl md:text-5xl'
  };

  const textSize = sizes[size] || sizes.default;

  // Letter animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
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
      className={`relative flex flex-col items-center ${className}`}
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
            whileHover={{
              scale: 1.1,
              textShadow: '0 0 40px rgba(6, 182, 212, 0.8)'
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      {/* Tagline */}
      {showTagline && (
        <motion.span
          className="text-xs md:text-sm text-cyan-400/80 tracking-[0.3em] uppercase mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          AI Driven Healthcare
        </motion.span>
      )}

      {/* Glowing underline */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #14b8a6, #06b6d4, #22d3ee, #06b6d4, #14b8a6, transparent)',
          backgroundSize: '200% 100%'
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      />

      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          filter: 'blur(8px)'
        }}
      />
    </motion.div>
  );
};

// Compact version for navigation bars
export const FuturisticHealixCompact = ({ showTagline = true, className = '' }) => {
  return (
    <motion.div 
      className={`relative flex flex-col items-start ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span 
        className="text-xl font-black tracking-wider relative"
        style={{
          background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        animate={{
          textShadow: [
            '0 0 10px rgba(20, 184, 166, 0.3)',
            '0 0 20px rgba(6, 182, 212, 0.5)',
            '0 0 10px rgba(20, 184, 166, 0.3)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        Healix
      </motion.span>

      {/* Tagline */}
      {showTagline && (
        <motion.span
          className="text-[10px] text-cyan-400/70 tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          AI Driven Healthcare
        </motion.span>
      )}

      {/* Subtle glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
          filter: 'blur(4px)'
        }}
      />
    </motion.div>
  );
};

// Glowing text with scanline effect
export const FuturisticHealixScanline = ({ showTagline = false, className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <motion.span 
        className="text-xl font-black tracking-wider relative inline-block"
        style={{
          background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Healix
      </motion.span>

      {/* Tagline */}
      {showTagline && (
        <span className="text-[10px] text-cyan-400/70 tracking-[0.2em] uppercase mt-0.5">
          AI Driven Healthcare
        </span>
      )}

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ mixBlendMode: 'overlay' }}
      >
        <motion.div
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          animate={{
            top: ['0%', '100%', '0%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
    </div>
  );
};

export default FuturisticHealixText;
