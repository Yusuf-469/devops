import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/web';

// Reuse existing 3D components
const modelMap = {
  doctor: React.lazy(() => import('../3d/DoctorModel.jsx')),
  stethoscope: React.lazy(() => import('../3d/StethoscopeModel.jsx')),
  syringe: React.lazy(() => import('../3d/SyringeModel.jsx')),
  pills: React.lazy(() => import('../3d/PillBottleModel.jsx')),
  dashboard: React.lazy(() => import('../3d/DashboardModel.jsx')),
};

const FeatureSection = ({ 
  sectionId,
  title, 
  description, 
  features, 
  modelType, 
  modelPath,
  reversed = false,
  hoverEffect = 'scale'
}) => {
  const sectionRef = useRef(null);
  const modelRef = useRef(null);
  const [spring, api] = useSpring(() => ({
    scale: 1,
    rotation: [0, 0, 0],
    glow: 0,
    config: { tension: 200, friction: 20 }
  }));

  // Floating animation for model
  useFrame((state) => {
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      modelRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      
      // Rotation for some models
      if (modelType === 'dashboard') {
        modelRef.current.rotation.y = time * 0.1;
      }
    }
  });

  // Intersection observer for scroll animations
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

  const handleMouseEnter = () => {
    api.start({
      scale: hoverEffect === 'scale' ? 1.05 : 1,
      glow: 1,
      rotation: hoverEffect === 'vibrate' ? [0, 0, 0.05] : [0, 0, 0]
    });
  };

  const handleMouseLeave = () => {
    api.start({
      scale: 1,
      glow: 0,
      rotation: [0, 0, 0]
    });
  };

  const ModelComponent = modelMap[modelType];

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
          <div className="model-container" ref={modelRef}>
            <React.Suspense fallback={<ModelLoadingFallback />}>
              {ModelComponent && (
                <animated.div style={{ transform: spring.scale.to(s => `scale(${s})`) }}>
                  <ModelComponent 
                    interactive={false} 
                    autoRotate={modelType === 'dashboard'}
                    scale={0.6}
                  />
                </animated.div>
              )}
            </React.Suspense>
          </div>
        )}
      </div>

      {/* Right Side - Model or Content */}
      <div className={`split ${reversed ? 'split-left' : 'split-right'}`}>
        {reversed ? (
          <div 
            className="model-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <React.Suspense fallback={<ModelLoadingFallback />}>
              {ModelComponent && (
                <animated.div style={{ transform: spring.scale.to(s => `scale(${s})`) }}>
                  <ModelComponent 
                    interactive={false} 
                    autoRotate={modelType === 'dashboard'}
                    scale={0.6}
                  />
                </animated.div>
              )}
            </React.Suspense>
          </div>
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

// Loading fallback for 3D models
const ModelLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default FeatureSection;
