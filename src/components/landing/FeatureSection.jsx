import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Static 3D preview icons for each model type
const modelPreviews = {
  doctor: { emoji: '👨‍⚕️', color: 'from-cyan-400 to-blue-500' },
  stethoscope: { emoji: '🩺', color: 'from-green-400 to-teal-500' },
  syringe: { emoji: '💉', color: 'from-orange-400 to-red-500' },
  pills: { emoji: '💊', color: 'from-purple-400 to-indigo-500' },
  dashboard: { emoji: '📊', color: 'from-amber-400 to-orange-500' }
};

const FeatureSection = ({ 
  sectionId,
  title, 
  description, 
  features, 
  modelType, 
  reversed = false
}) => {
  const sectionRef = useRef(null);
  const preview = modelPreviews[modelType] || modelPreviews.doctor;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id={sectionId}
      className={`section feature-section ${reversed ? 'flex-row-reverse' : ''} fade-in-section`}
    >
      {/* Left Side - Content or Model */}
      <div className={`split ${reversed ? 'split-right' : 'split-left'}`}>
        {reversed ? (
          <div className="feature-content">
            <h2 className="section-title">{title}</h2>
            <p className="section-description">{description}</p>
            <ul className="feature-list">
              {features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <svg className="w-5 h-5 text-[#20B2AA] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <motion.div 
            className="model-preview-container"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={`model-preview-gradient model-float-${modelType}`}>
              <span className="model-emoji">{preview.emoji}</span>
            </div>
            <div className="model-glow" />
          </motion.div>
        )}
      </div>

      {/* Right Side - Model or Content */}
      <div className={`split ${reversed ? 'split-left' : 'split-right'}`}>
        {reversed ? (
          <motion.div 
            className="model-preview-container"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={`model-preview-gradient model-float-${modelType}`}>
              <span className="model-emoji">{preview.emoji}</span>
            </div>
            <div className="model-glow" />
          </motion.div>
        ) : (
          <div className="feature-content">
            <h2 className="section-title">{title}</h2>
            <p className="section-description">{description}</p>
            <ul className="feature-list">
              {features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <svg className="w-5 h-5 text-[#20B2AA] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
