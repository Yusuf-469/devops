import React, { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';

// Model path
const MODEL_PATH = 'C:/Users/yusuf/Downloads/ai medical devops/medical doctor 3d model.glb';

// Convert Windows path to file:// URL
const pathToUrl = (windowsPath) => {
  return windowsPath.replace(/\\/g, '/').replace('C:/', 'file:///');
};

// 3D Doctor Model Component
const Doctor3DModel = () => {
  const url = pathToUrl(MODEL_PATH);
  
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene.clone()} scale={2.5} position={[0, -2, 0]} />;
  } catch (error) {
    console.error('Failed to load doctor model', error);
    // Fallback geometry
    return (
      <group>
        <mesh>
          <capsuleGeometry args={[0.5, 1, 4, 8]} />
          <meshStandardMaterial color="#20B2AA" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#20B2AA" />
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
        <group>
          <mesh>
            <capsuleGeometry args={[0.5, 1, 4, 8]} />
            <meshStandardMaterial color="#20B2AA" />
          </mesh>
        </group>
      );
    }
    return this.props.children;
  }
}

// 3D Scene Component
const Login3DScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="login-canvas"
      frameloop="always"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <ModelErrorBoundary>
            <Doctor3DModel />
          </ModelErrorBoundary>
        </Float>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo: Just navigate to dashboard
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    localStorage.setItem('healix_token', 'demo_token');
    localStorage.setItem('healix_user', JSON.stringify({
      email: 'demo@healix.ai',
      name: 'Demo User'
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f23] p-4">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Login3DScene />
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-500" />
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="logo-text gradient-text">HEALIX</h1>
          <p className="text-gray-400 mt-2">AI-Powered Healthcare Dashboard</p>
        </motion.div>

        {/* Auth Form */}
        <div className="glass-morphism rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 text-center rounded-lg transition-all duration-300 ${
                isLogin
                  ? 'bg-cyan-500 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 text-center rounded-lg transition-all duration-300 ${
                !isLogin
                  ? 'bg-cyan-500 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="yusuf@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="demo-btn"
            >
              🚀 Try Demo Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Benefits */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              {isLogin ? 'New to HEALIX?' : 'Already have an account?'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
