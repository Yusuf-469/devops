import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthSection = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '+91',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login - in production, call your auth API
    setTimeout(() => {
      // Demo account check
      if (loginData.email === 'demo@healix.ai' && loginData.password === 'Demo@1234') {
        localStorage.setItem('healix_token', 'demo_token');
        localStorage.setItem('healix_user', JSON.stringify({ email: 'demo@healix.ai', name: 'Demo User' }));
        navigate('/dashboard');
      } else if (loginData.email && loginData.password) {
        // For demo purposes, just redirect
        localStorage.setItem('healix_token', 'demo_token');
        localStorage.setItem('healix_user', JSON.stringify({ email: loginData.email, name: 'User' }));
        navigate('/dashboard');
      } else {
        setError('Please enter email and password');
      }
      setLoading(false);
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!signupData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    // Simulate signup
    setTimeout(() => {
      localStorage.setItem('healix_token', 'demo_token');
      localStorage.setItem('healix_user', JSON.stringify({
        email: signupData.email,
        name: signupData.name
      }));
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
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
    <section className="section auth-section fade-in-section" id="auth">
      <div className="auth-container">
        {/* Left Side - Marketing */}
        <div className="auth-marketing">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="auth-title"
          >
            {activeTab === 'login' ? 'Welcome Back' : 'Join HEALIX'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="auth-subtitle"
          >
            {activeTab === 'login'
              ? 'Sign in to access your personalized healthcare dashboard'
              : 'Create your account and start your wellness journey'}
          </motion.p>

          {/* Benefits */}
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="benefits-list"
          >
            <li className="benefit-item">
              <span className="benefit-icon">🔒</span>
              <span>Bank-grade encryption for your health data</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">🌍</span>
              <span>Multi-language support (12+ languages)</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">📱</span>
              <span>Access from any device, anywhere</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">🤖</span>
              <span>24/7 AI assistant for instant support</span>
            </li>
          </motion.ul>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="auth-forms-container">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="auth-error"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          {activeTab === 'login' ? (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="auth-form"
              onSubmit={handleLogin}
            >
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="yusuf@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-footer">
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="demo-btn"
                disabled={loading}
              >
                🚀 Try Demo Account
              </button>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="auth-form"
              onSubmit={handleSignup}
            >
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Yusuf"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="yusuf@example.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={signupData.agreeTerms}
                    onChange={(e) => setSignupData({ ...signupData, agreeTerms: e.target.checked })}
                    required
                  />
                  <span className="checkbox-text">
                    I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.form>
          )}

          {/* Tab Switch */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-gray-400">
              {activeTab === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                {activeTab === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </motion.div>

          {/* Dedicated Login Page Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4"
          >
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-400 text-sm"
            >
              Open full login page →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
