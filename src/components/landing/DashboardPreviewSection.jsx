import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DashboardPreviewSection = () => {
  const sectionRef = useRef(null);

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

  const dashboardStyle = {
    position: 'relative',
    width: '14rem',
    height: '14rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1.5rem',
    background: 'linear-gradient(135deg, rgba(32, 178, 170, 0.3), rgba(32, 178, 170, 0.1))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 80px rgba(32, 178, 170, 0.3), inset 0 0 40px rgba(32, 178, 170, 0.1)',
    animation: 'dashboard-preview-float 4s ease-in-out infinite',
    fontSize: '5rem',
  };

  return (
    <section ref={sectionRef} id="dashboard-preview" className="section dashboard-section fade-in-section">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0d1f3c]" />

      {/* Center Dashboard Preview */}
      <motion.div
        className="dashboard-icon-container"
        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div style={dashboardStyle}>📊</div>
      </motion.div>

      {/* Corner Features */}
      <div className="corner-features">
        {/* Top-Left: Health Score */}
        <div className="corner-feature top-left">
          <div className="health-score-ring">
            <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1a2a4a" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke={healthScore >= 75 ? '#20B2AA' : healthScore >= 50 ? '#fbbf24' : '#ef4444'} 
                strokeWidth="8"
                strokeDasharray={`${healthScore * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="health-score-text">
              <span className="score-value">{healthScore}</span>
              <span className="score-label">/ 100</span>
            </div>
          </div>
          <p className="feature-label">Unified Health Score</p>
        </div>

        {/* Top-Right: Activity Timeline */}
        <div className="corner-feature top-right">
          <h4 className="corner-title">Activity Timeline</h4>
          <div className="activity-list">
            {recentActions.map((action, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">{action.icon}</span>
                <div className="activity-info">
                  <p className="activity-text">{action.text}</p>
                  <span className="activity-time">{action.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Left: Quick Tools */}
        <div className="corner-feature bottom-left">
          <h4 className="corner-title">Quick Tool Access</h4>
          <div className="quick-tools-grid">
            {quickTools.map((tool, index) => (
              <button key={index} className="quick-tool-btn" title="Login Required">
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-Right: Export */}
        <div className="corner-feature bottom-right">
          <h4 className="corner-title">Export Reports</h4>
          <button className="export-btn" disabled title="Login Required">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate PDF
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="dashboard-description">
        <h2 className="section-title text-white">Your Complete Health Command Center</h2>
        <p className="section-description text-gray-300">Everything in one place, beautifully visualized.</p>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
