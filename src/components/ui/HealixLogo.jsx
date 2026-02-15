import React from 'react';
import { motion } from 'framer-motion';

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
        src="/healix-logo.png" 
        alt="HEALIX - AI Healthcare" 
        className={`${currentSize.container} object-contain drop-shadow-lg`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
      
      {/* Text below logo for larger sizes */}
      {showText && size === 'hero' && (
        <div className="mt-4 text-center">
          <h1 className={`${currentSize.text} font-bold tracking-wider`}>
            <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              HEALIX
            </span>
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            AI Healthcare
          </p>
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
        src="/healix-logo.png" 
        alt="HEALIX - AI Healthcare" 
        className="w-10 h-10 object-contain drop-shadow-md"
      />
      
      {/* Text */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            HEALIX
          </span>
        </h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">AI Healthcare</p>
      </div>
    </div>
  );
};

export default HealixLogo;