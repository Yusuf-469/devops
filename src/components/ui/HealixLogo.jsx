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
      {/* Logo Container */}
      <div className={`${currentSize.container} relative`}>
        {/* Main circular background with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/40">
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-teal-300/50 to-transparent" />
        </div>
        
        {/* H Letter with Medical Cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 48 48" 
            className="w-full h-full p-2"
            fill="none"
          >
            {/* H shape */}
            <path 
              d="M12 8V40M36 8V40M12 24H36" 
              stroke="white" 
              strokeWidth="6" 
              strokeLinecap="round"
              className="drop-shadow-lg"
            />
            {/* Medical cross overlay */}
            <rect 
              x="20" 
              y="18" 
              width="8" 
              height="12" 
              fill="white"
              className="drop-shadow-lg"
            />
            <rect 
              x="18" 
              y="20" 
              width="12" 
              height="8" 
              fill="white"
              className="drop-shadow-lg"
            />
          </svg>
        </div>

        {/* Pulse ring animation */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Text and Heartbeat */}
      {showText && (
        <div className="flex flex-col items-center mt-3">
          {/* HEALIX Text */}
          <h1 className={`${currentSize.text} font-bold tracking-wider`}>
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
              HEALIX
            </span>
          </h1>
          
          {/* Heartbeat line */}
          <svg 
            viewBox="0 0 100 20" 
            className={`${currentSize.heartbeat} h-4 mt-1`}
            fill="none"
          >
            <motion.path 
              d="M0 10 L20 10 L25 10 L30 2 L35 18 L40 10 L45 10 L50 10 L55 10 L60 2 L65 18 L70 10 L75 10 L100 10" 
              stroke="url(#heartbeatGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="heartbeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Tagline */}
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
      {/* Logo Circle */}
      <div className="w-10 h-10 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/30">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-teal-300/50 to-transparent" />
        </div>
        
        {/* H with cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 48 48" className="w-full h-full p-2" fill="none">
            <path d="M12 8V40M36 8V40M12 24H36" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <rect x="20" y="18" width="8" height="12" fill="white"/>
            <rect x="18" y="20" width="12" height="8" fill="white"/>
          </svg>
        </div>
      </div>
      
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