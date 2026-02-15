import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AnimatedIntro.css';

const AnimatedIntro = () => {
  return (
    <section className="hero-section scroll-section" id="hero">
      {/* Background image */}
      <div className="hero-background">
        <img src="/hero-bg.png" alt="HEALIX AI Healthcare" className="hero-image" />
      </div>

      {/* Content overlay */}
      <div className="hero-overlay">
        {/* Logo/Brand */}
        <motion.div
          className="hero-brand"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="brand-name">HEALIX</span>
          <span className="brand-tagline">AI-Powered Healthcare</span>
        </motion.div>

        {/* Main content */}
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your Personal <span className="gradient-text">AI Health</span> Assistant
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experience the future of healthcare with 3D interactive tools, 
            AI-powered symptom diagnosis, and personalized health management. 
            Get 24/7 medical guidance at your fingertips.
          </motion.p>

          <motion.div
            className="hero-features"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="feature-tag">
              <span className="feature-icon">🩺</span>
              <span>Dr. AI Chat</span>
            </div>
            <div className="feature-tag">
              <span className="feature-icon">📊</span>
              <span>Report Analysis</span>
            </div>
            <div className="feature-tag">
              <span className="feature-icon">💊</span>
              <span>Medication Tracker</span>
            </div>
            <div className="feature-tag">
              <span className="feature-icon">📅</span>
              <span>Treatment Schedule</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-buttons"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/login" className="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </Link>
            <Link to="/login" className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Sign Up
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span>Scroll to explore</span>
          <div className="scroll-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedIntro;
