import React, { Suspense, useMemo, useState, useEffect } from 'react';
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

// Preload all models on module load
Object.values(MODEL_PATHS).forEach(path => {
  useGLTF.preload(path);
});

// Static 3D model component (no animation)
const StaticModel = ({ modelType }) => {
  const path = MODEL_PATHS[modelType];
  const scale = MODEL_SCALES[modelType] || 1;
  const [error, setError] = useState(false);

  // Fallback geometry if model fails to load
  if (error || !path) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
    );
  }

  try {
    const { scene } = useGLTF(path);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);
    return <primitive object={clonedScene} scale={scale} />;
  } catch (err) {
    console.error(`Failed to load model: ${modelType}`, err);
    setError(true);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
    );
  }
};

// Loading fallback for 3D canvas
const CanvasLoader = () => (
  <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color="#14b8a6" wireframe />
  </mesh>
);

// 3D Preview Canvas
const ModelPreview = ({ modelType }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="model-preview-container">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={() => setIsLoaded(true)}
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#14b8a6" />
          
          <Float
            speed={1.5}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <StaticModel modelType={modelType} />
          </Float>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Feature Section Component
const FeatureSection = ({
  sectionId,
  title,
  description,
  features,
  modelType,
  modelPath,
  reversed = false
}) => {
  return (
    <section id={sectionId} className="feature-section scroll-section">
      <div className={`feature-container ${reversed ? 'reversed' : ''}`}>
        {/* 3D Model Side */}
        <motion.div
          className="feature-model-side"
          initial={{ opacity: 0, x: reversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <ModelPreview modelType={modelType} />
        </motion.div>

        {/* Content Side */}
        <motion.div
          className="feature-content-side"
          initial={{ opacity: 0, x: reversed ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="feature-title">{title}</h2>
          <p className="feature-description">{description}</p>
          
          <ul className="feature-list">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="feature-item"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <svg className="feature-check" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
