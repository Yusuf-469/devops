import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AnimatedIntro.css';

const TOTAL_FRAMES = 240;
const FRAME_RATE = 24; // 24 frames per second
const FRAME_DURATION = 1000 / FRAME_RATE; // ~41.67ms per frame

// Preload frames
const preloadFrames = () => {
  const frames = [];
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const frameNumber = String(i).padStart(3, '0');
    frames.push(`/intro-frames/ezgif-frame-${frameNumber}.jpg`);
  }
  return frames;
};

const FRAME_PATHS = preloadFrames();

const AnimatedIntro = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState(new Set());
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Preload images
  useEffect(() => {
    let mounted = true;
    
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      const loadPromises = FRAME_PATHS.map(async (path, index) => {
        try {
          await loadImage(path);
          if (mounted) {
            setLoadedFrames(prev => new Set([...prev, index]));
          }
        } catch (err) {
          console.warn(`Failed to load frame ${index + 1}`);
        }
      });

      await Promise.all(loadPromises);
      if (mounted) {
        setIsFullyLoaded(true);
      }
    };

    preloadAllImages();

    return () => {
      mounted = false;
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !isFullyLoaded) return;

    const animate = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= FRAME_DURATION) {
        lastTimeRef.current = timestamp;
        setCurrentFrame(prev => {
          if (prev >= TOTAL_FRAMES - 1) {
            setIsPlaying(false);
            setAnimationComplete(true);
            return prev;
          }
          return prev + 1;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isFullyLoaded]);

  // Handle replay
  const handleReplay = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(true);
    setAnimationComplete(false);
    lastTimeRef.current = 0;
  }, []);

  // Get current frame path
  const getCurrentFramePath = () => {
    const frameNumber = String(currentFrame + 1).padStart(3, '0');
    return `/intro-frames/ezgif-frame-${frameNumber}.jpg`;
  };

  // Loading progress
  const loadingProgress = Math.round((loadedFrames.size / TOTAL_FRAMES) * 100);

  return (
    <section className="animated-intro-hero scroll-section" id="hero">
      {/* Loading overlay */}
      <AnimatePresence>
        {!isFullyLoaded && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-content">
              <div className="loading-logo">
                <span className="logo-text">HEALIX</span>
                <span className="logo-tagline">AI Healthcare</span>
              </div>
              <div className="loading-bar-container">
                <motion.div 
                  className="loading-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="loading-text">
                Loading experience... {loadingProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main animation container */}
      <div className="animation-container">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentFrame}
            src={getCurrentFramePath()}
            alt={`Frame ${currentFrame + 1}`}
            className="frame-image"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.02 }}
          />
        </AnimatePresence>
      </div>

      {/* Hero content overlay - shows when animation completes */}
      <AnimatePresence>
        {animationComplete && (
          <motion.div
            className="hero-content-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero-content">
              <motion.div
                className="hero-badge"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="badge-icon">🏥</span>
                <span>AI-Powered Healthcare Platform</span>
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Your Personal
                <span className="gradient-text"> AI Health</span>
                <br />
                Dashboard
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Experience the future of healthcare with 3D interactive tools,
                AI-powered diagnosis, and personalized health management.
              </motion.p>

              <motion.div
                className="hero-buttons"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <Link to="/login" className="btn-primary">
                  Get Started
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    document.getElementById('dr-ai')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Features
                </button>
              </motion.div>

              <motion.div
                className="hero-stats"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <div className="stat-item">
                  <span className="stat-value">24/7</span>
                  <span className="stat-label">AI Support</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value">5</span>
                  <span className="stat-label">3D Tools</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Secure</span>
                </div>
              </motion.div>
            </div>

            {/* Replay button */}
            <button className="replay-btn" onClick={handleReplay} title="Replay Animation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator during animation */}
      {isFullyLoaded && !animationComplete && (
        <div className="progress-indicator">
          <div 
            className="progress-fill"
            style={{ width: `${((currentFrame + 1) / TOTAL_FRAMES) * 100}%` }}
          />
        </div>
      )}

      {/* Scroll indicator */}
      <AnimatePresence>
        {animationComplete && (
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <span>Scroll to explore</span>
            <div className="scroll-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AnimatedIntro;
