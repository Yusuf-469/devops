import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f23] p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-500" />
      </div>

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
            <Link
              to={isLogin ? '#' : '#'}
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </Link>
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
