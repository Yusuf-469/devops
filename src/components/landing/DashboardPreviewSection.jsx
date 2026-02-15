import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';

// Dashboard model path - using public folder
const DASHBOARD_PATH = '/models/dashboard.glb';

// Scale for dashboard model - adjusted for better fit
const DASHBOARD_SCALE = 2.5;

// Static Dashboard 3D model
const Dashboard3DModel = () => {
  try {
    const { scene } = useGLTF(DASHBOARD_PATH);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);
    return <primitive object={clonedScene} scale={DASHBOARD_SCALE} />;
  } catch (error) {
    console.error('Failed to load dashboard model', error);
    // Fallback geometry
    return (
      <group>
        <mesh>
          <boxGeometry args={[3, 2, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>
    );
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
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      );
    }
    return this.props.children;
  }
}

// 3D Dashboard Preview
const Dashboard3DPreview = () => {
  return (
    <div className="dashboard-preview-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="dashboard-canvas"
        frameloop="always"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <ModelErrorBoundary>
            <Dashboard3DModel />
          </ModelErrorBoundary>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
      <div className="dashboard-glow" />
    </div>
  );
};

const DashboardPreviewSection = () => {
  return (
    <section className="section dashboard-section">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full h-full flex flex-col items-center justify-center relative"
      >
        {/* Title and Description - At the top */}
        <div className="text-center mb-8 pt-16">
          <h2 className="text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Health Dashboard
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Your personalized command center for complete health management
          </p>
        </div>

        {/* Center 3D Dashboard Model */}
        <div className="center-model-container" style={{ height: 'auto', minHeight: '400px' }}>
          <div className="holographic-glow" />
          <Dashboard3DPreview />
        </div>

        {/* Subtitle below model */}
        <p className="text-gray-400 text-lg mt-6 text-center">
          Click any tool to open its full 3D experience
        </p>

        {/* Corner Features */}
        <div className="corner-features">
          {/* Bottom Right - Emergency */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="corner-feature bottom-right"
          >
            <h3 className="corner-title">Emergency?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Click the SOS button for immediate assistance
            </p>
            <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300">
              🚨 Call Emergency
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreviewSection;
