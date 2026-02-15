import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AnimatedIntro.css';

const AnimatedIntro = () => {
  return (
    <section className="hero-section scroll-section" id="hero">
      {/* Background image */}
      <div className="hero-background">
        <img src="/healix2.png" alt="HEALIX AI Healthcare" className="hero-image" />
      </div>

      {/* UI Elements - positioned below the image content */}
      <div className="hero-ui-container">
        <motion.div
          className="hero-buttons"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
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
