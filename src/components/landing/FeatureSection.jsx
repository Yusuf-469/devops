import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

// Model path mapping - using public folder paths
const MODEL_PATHS = {
  doctor: '/models/medical doctor 3d model.glb',
  stethoscope: '/models/stethoscope 3d model.glb',
  syringe: '/models/cartoon syringe 3d model.glb',
  pills: '/models/pill bottle 3d model.glb',
  dashboard: '/models/dashboard.glb'
};

// Scale mapping for each model type - adjusted for better fit
const MODEL_SCALES = {
  doctor: 2.5,
  stethoscope: 3,
  syringe: 2.8,
  pills: 2.5,
  dashboard: 2.5
};

// Static 3D model component (no animation)
const StaticModel = ({ modelType }) => {
  const path = MODEL_PATHS[modelType];
  const scale = MODEL_SCALES[modelType] || 1;

  // Fallback geometry if model fails to load
  const FallbackGeometry = () => (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#20B2AA" />
    </mesh>
  );

  if (!path) {
    return <FallbackGeometry />;
  }

  try {
    const { scene } = useGLTF(path);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);
    return <primitive object={clonedScene} scale={scale} />;
  } catch (error) {
    console.error(`Failed to load model: ${modelType}`, error);
    return <FallbackGeometry />;
  }
};

// Error boundary for 3D models
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#20B2AA" />
        </mesh>
      );
    }
    return this.props.children;
  }
}

// 3D Preview Canvas
const ModelPreview = ({ modelType }) => {
  return (
    <div className="model-preview-container">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        className="model-canvas"
        frameloop="always"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <ModelErrorBoundary>
            <Float speed={0} rotationIntensity={0.2} floatIntensity={0}>
              <StaticModel modelType={modelType} />
            </Float>
          </ModelErrorBoundary>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="model-glow" />
    </div>
  );
};

const FeatureSection = ({ 
  sectionId,
  title, 
  description, 
  features, 
  modelType, 
  reversed = false
}) => {
  return (
    <section 
      id={sectionId}
      className={`section feature-section ${reversed ? 'flex-row-reverse' : ''}`}
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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ModelPreview modelType={modelType} />
          </motion.div>
        )}
      </div>

      {/* Right Side - Model or Content */}
      <div className={`split ${reversed ? 'split-left' : 'split-right'}`}>
        {reversed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ModelPreview modelType={modelType} />
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
