import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthSection = () => {
  return (
    <section className="section auth-section fade-in-section" id="auth">
      <div className="auth-container">
        <div className="auth-marketing">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="auth-title"
          >
            Get Started with HEALIX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="auth-subtitle"
          >
            Create your account and start your wellness journey with AI-powered healthcare
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="benefits-list"
          >
            <li className="benefit-item">
              <span className="benefit-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <span>Bank-grade encryption for your health data</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>Multi-language support (12+ languages)</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              <span>Access from any device, anywhere</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>24/7 AI assistant for instant support</span>
            </li>
          </motion.ul>
        </div>

        <div className="auth-forms-container">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link
              to="/login"
              className="submit-btn inline-block w-full"
            >
              Sign In / Sign Up
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
