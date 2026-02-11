import React, { useState } from 'react';

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
        window.location.href = '/dashboard';
      } else if (loginData.email && loginData.password) {
        // For demo purposes, just redirect
        localStorage.setItem('healix_token', 'demo_token');
        localStorage.setItem('healix_user', JSON.stringify({ email: loginData.email, name: 'User' }));
        window.location.href = '/dashboard';
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

    // Validate password strength
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    // Simulate signup
    setTimeout(() => {
      localStorage.setItem('healix_token', 'demo_token');
      localStorage.setItem('healix_user', JSON.stringify({ 
        email: signupData.email, 
        name: signupData.name,
        phone: signupData.phone 
      }));
      window.location.href = '/dashboard';
      setLoading(false);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setLoginData({ email: 'demo@healix.ai', password: 'Demo@1234' });
    handleLogin({ preventDefault: () => {} });
  };

  return (
    <section id="auth" className="section auth-section">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0d1f3c]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 h-full flex items-center">
        <div className="auth-container">
          {/* Left Side: Marketing */}
          <div className="auth-marketing">
            <h2 className="auth-title">Start Your Health Journey</h2>
            <p className="auth-subtitle">Join 10,000+ users taking control of their health</p>

            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✅</span>
                <span>Free basic symptom checking</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔒</span>
                <span>Secure, encrypted data</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🕐</span>
                <span>24/7 AI assistance</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">👨‍👩‍👧‍👦</span>
                <span>Family profiles included</span>
              </div>
            </div>
          </div>

          {/* Right Side: Auth Forms */}
          <div className="auth-forms-container">
            {/* Tabs */}
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-footer">
                  <a href="#" className="forgot-link">Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>

                <button 
                  type="button" 
                  className="demo-btn"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  🚀 Try Demo Account
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form className="auth-form" onSubmit={handleSignup}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
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
                      placeholder="Min 8 characters"
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
                      placeholder="Confirm password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone (+91)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter phone number"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={signupData.agreeTerms}
                      onChange={(e) => setSignupData({ ...signupData, agreeTerms: e.target.checked })}
                      required
                    />
                    <span className="checkbox-text">
                      I agree to <a href="#" className="link">Terms & Conditions</a> and <a href="#" className="link">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading || !signupData.agreeTerms}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
