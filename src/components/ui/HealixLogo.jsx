import React from 'react';
import { motion } from 'framer-motion';
import { FuturisticHealixText } from './FuturisticHealixText';

const HealixLogo = ({ size = 'default', showText = true, className = '' }) => {
  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-lg', heartbeat: 'w-16' },
    default: { container: 'w-12 h-12', text: 'text-2xl', heartbeat: 'w-24' },
    large: { container: 'w-20 h-20', text: 'text-5xl', heartbeat: 'w-40' },
    hero: { container: 'w-32 h-32', text: 'text-7xl', heartbeat: 'w-52' }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <motion.div 
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo Image */}
      <motion.img 
        src="/logo.png" 
        alt="Healix" 
        className={`${currentSize.container} object-contain drop-shadow-lg`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
      
      {/* Text below logo for larger sizes */}
      {showText && size === 'hero' && (
        <div className="mt-4 text-center">
          <FuturisticHealixText size="hero" />
        </div>
      )}
    </motion.div>
  );
};

// Compact version for TopBar
export const HealixLogoCompact = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <img 
        src="/logo.png" 
        alt="Healix" 
        className="w-10 h-10 object-contain drop-shadow-md"
      />
      
      {/* Futuristic Text */}
      <FuturisticHealixText size="small" />
    </div>
  );
};

export default HealixLogo;