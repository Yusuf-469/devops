import React, { Suspense, useState, useMemo } from 'react';
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
  const [healthScore] = useState(85);
  const [recentActions] = useState([
    { icon: '🩺', text: 'Symptom check completed', time: '2h ago' },
    { icon: '📄', text: 'Report analyzed', time: '5h ago' },
    { icon: '💊', text: 'Medication logged', time: '1d ago' },
  ]);
  const [quickTools] = useState([
    { name: 'Dr. AI', icon: '👨‍⚕️' },
    { name: 'Reports', icon: '📊' },
    { name: 'Vaccines', icon: '💉' },
    { name: 'Meds', icon: '💊' },
  ]);

  return (
    <section className="section dashboard-section fade-in-section">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full h-full flex flex-col items-center justify-center relative"
      >
        {/* Center 3D Dashboard Model */}
        <div className="center-model-container">
          <div className="holographic-glow" />
          {/* Title and Description */}
          <div className="text-center mb-6 absolute top-[-80px]">
            <h2 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Health Dashboard
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Your personalized command center for complete health management
            </p>
          </div>
          <Dashboard3DPreview />
          <p className="dashboard-description text-gray-400 text-lg absolute bottom-[-60px]">
            Click any tool to open its full 3D experience
          </p>
        </div>

        {/* Corner Features */}
        <div className="corner-features">
          {/* Top Left - Health Score */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="corner-feature top-left"
          >
            <div className="flex items-center gap-4">
              <div className="health-score-ring">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={healthScore >= 75 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${healthScore * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="health-score-text">
                  <span className="score-value">{healthScore}</span>
                </div>
              </div>
              <div>
                <h3 className="corner-title mb-1">Health Score</h3>
                <p className="feature-label">Excellent condition</p>
              </div>
            </div>
          </motion.div>

          {/* Top Right - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="corner-feature top-right"
          >
            <h3 className="corner-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActions.map((action, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">{action.icon}</span>
                  <div className="activity-info">
                    <p className="activity-text">{action.text}</p>
                  </div>
                  <span className="activity-time">{action.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Left - Quick Tools */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="corner-feature bottom-left"
          >
            <h3 className="corner-title">Quick Tools</h3>
            <div className="quick-tools-grid">
              {quickTools.map((tool, index) => (
                <div key={index} className="quick-tool-btn">
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Right - Emergency */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
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
