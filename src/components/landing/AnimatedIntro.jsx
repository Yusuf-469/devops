import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const AnimatedIntro = ({ onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState(new Set());
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
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
        setShowSkip(true);
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
            // Auto-complete after animation finishes
            setTimeout(() => {
              onComplete?.();
            }, 500);
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
  }, [isPlaying, isFullyLoaded, onComplete]);

  // Handle skip
  const handleSkip = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    onComplete?.();
  }, [onComplete]);

  // Handle pause/play
  const handlePausePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
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
    <div className="animated-intro">
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

      {/* Controls overlay */}
      {isFullyLoaded && showSkip && (
        <motion.div
          className="controls-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Progress bar */}
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${((currentFrame + 1) / TOTAL_FRAMES) * 100}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="control-buttons">
            <button 
              className="control-btn pause-btn"
              onClick={handlePausePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <button 
              className="control-btn skip-btn"
              onClick={handleSkip}
            >
              Skip Intro
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,4 18,12 6,20" />
                <rect x="17" y="4" width="3" height="16" />
              </svg>
            </button>
          </div>

          {/* Frame counter */}
          <div className="frame-counter">
            {currentFrame + 1} / {TOTAL_FRAMES}
          </div>
        </motion.div>
      )}

      {/* Gradient overlay at bottom */}
      <div className="gradient-overlay" />
    </div>
  );
};

export default AnimatedIntro;
