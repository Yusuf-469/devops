import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AnimatedIntro.css';

const AnimatedIntro = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section scroll-section" id="hero">
      {/* Main animated image container */}
      <motion.div 
        className="hero-image-container"
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      >
        <motion.img
          src="/hero-bg.png"
          alt="HEALIX AI Healthcare"
          className="hero-main-image"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Floating particles around the image */}
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* UI Elements - Positioned to not block the logo */}
      {/* Left side description */}
      <motion.div
        className="hero-left-content"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <p className="hero-tagline">
          AI-Powered Healthcare Platform
        </p>
        <p className="hero-mini-desc">
          24/7 medical guidance, symptom analysis, and personalized health management
        </p>
      </motion.div>

      {/* Right side buttons */}
      <motion.div
        className="hero-right-content"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Link to="/login" className="btn-signin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Sign In
        </Link>
        <Link to="/login" className="btn-signup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Sign Up
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="scroll-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default AnimatedIntro;
