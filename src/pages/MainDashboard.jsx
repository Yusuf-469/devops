import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useAppStore } from '../store/index.js';
import { TopBar } from '../components/ui/index.js';
import { ChatModal, AnalyzerModal, TrackerModal, MedicationModal, EmergencyModal } from '../components/modals/index.js';

// Simple icon components (SVG)
const DoctorIcon = () => (
  <svg viewBox="0 0 24 24" className="w-24 h-24 text-cyan-400" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const StethoscopeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-24 h-24 text-green-400" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.25-7.52-3.25 1.5-1.5 4.01 1.75L12 8.5l-2.01 1.75L7 14.25zm5.5-2.5l-4.01 1.75L12 8.5l2.01 1.75 4.01-1.75-1.5-1.5z"/>
  </svg>
);

const SyringeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-24 h-24 text-orange-400" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
  </svg>
);

const PillIcon = () => (
  <svg viewBox="0 0 24 24" className="w-24 h-24 text-purple-400" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <circle cx="12" cy="12" r="5"/>
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-24 h-24 text-amber-400" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-64 h-64">
    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Section data
const sections = [
  {
    id: 'dr-ai',
    title: 'Dr. AI',
    subtitle: 'Your AI-powered medical assistant',
    icon: DoctorIcon,
    color: 'cyan',
    features: ['24/7 Available', 'Smart Analysis', 'Multi-language'],
    gradient: 'from-cyan-400 via-blue-500 to-purple-600'
  },
  {
    id: 'analyzer',
    title: 'Report Analyzer',
    subtitle: 'Upload and analyze medical reports',
    icon: StethoscopeIcon,
    color: 'green',
    features: ['PDF Support', 'Image Analysis', 'Plain English'],
    gradient: 'from-green-400 via-emerald-500 to-teal-600'
  },
  {
    id: 'tracker',
    title: 'Treatment Tracker',
    subtitle: 'Track vaccines and medications',
    icon: SyringeIcon,
    color: 'orange',
    features: ['Smart Reminders', 'Progress Tracking', 'Family Profiles'],
    gradient: 'from-orange-400 via-red-500 to-pink-600'
  },
  {
    id: 'medications',
    title: 'Medication Manager',
    subtitle: 'Manage your prescriptions',
    icon: PillIcon,
    color: 'purple',
    features: ['Drug Interactions', 'Refill Reminders', 'Dosage Tracking'],
    gradient: 'from-purple-400 via-violet-500 to-indigo-600'
  },
  {
    id: 'dashboard',
    title: 'Health Overview',
    subtitle: 'Your complete health dashboard',
    icon: DashboardIcon,
    color: 'amber',
    features: ['Health Score', 'Predictive Insights', 'Quick Actions'],
    gradient: 'from-amber-400 via-yellow-500 to-orange-600'
  }
];

const MainDashboard = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isMedicationOpen, setIsMedicationOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const { user, setUser } = useAppStore();

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('healix_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log('No valid user found');
      }
    }
  }, [setUser]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / windowHeight);
      setCurrentSection(Math.min(sectionIndex, sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (index) => {
    const section = sections[index];
    
    switch (index) {
      case 0: // Dr. AI
        if (!user) {
          toast.error('Please login to access Dr. AI', { icon: '🔒' });
          return;
        }
        setIsChatOpen(true);
        break;
      case 1: // Analyzer
        if (!user) {
          toast.error('Please login to access Analyzer', { icon: '🔒' });
          return;
        }
        setIsAnalyzerOpen(true);
        break;
      case 2: // Tracker
        if (!user) {
          toast.error('Please login to access Tracker', { icon: '🔒' });
          return;
        }
        setIsTrackerOpen(true);
        break;
      case 3: // Medications
        if (!user) {
          toast.error('Please login to access Medications', { icon: '🔒' });
          return;
        }
        setIsMedicationOpen(true);
        break;
      case 4: // Dashboard
        // Already on dashboard
        break;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000, style: { background: '#1f2937', color: '#f3f4f6' } }} />
      
      <TopBar />
      
      {/* Section Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' });
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-cyan-400 scale-125' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
            title={section.title}
          />
        ))}
      </div>

      {/* Sections */}
      {sections.map((section, index) => {
        const Icon = section.icon;
        
        return (
          <section 
            key={section.id}
            className="section relative snap-start flex"
          >
            {/* Background Effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-5`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.1)_0%,transparent_70%)]" />
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    y: [null, Math.random() * -100],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className={`relative z-10 flex w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Left Side - 3D Model Placeholder */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -10 : 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-20 blur-3xl rounded-full`} />
                  
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 5 : -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSectionClick(index)}
                    className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/10 cursor-pointer shadow-2xl`}
                  >
                    <Suspense fallback={<LoadingFallback />}>
                      <Icon />
                    </Suspense>
                    
                    {/* Pulse Ring */}
                    <motion.div
                      className={`absolute inset-0 border-2 border-${section.color}-400 rounded-3xl opacity-30`}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Nameplate */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className={`px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-white font-semibold border border-${section.color}-500/30`}>
                      {section.title}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Side - Content */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="max-w-lg"
                >
                  <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                    <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent mb-4`}>
                      {section.title}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6">
                      {section.subtitle}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {section.features.map((feature, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 bg-${section.color}-500/20 text-${section.color}-300 rounded-full text-sm border border-${section.color}-500/30`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSectionClick(index)}
                      className={`w-full py-4 bg-gradient-to-r ${section.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg`}
                    >
                      {index === 4 ? 'View Full Dashboard' : `Open ${section.title}`}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Section Counter */}
            <div className="absolute bottom-8 left-8 text-gray-500 font-mono text-sm">
              {String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
            </div>
          </section>
        );
      })}

      {/* Emergency Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsEmergencyOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full shadow-lg shadow-red-500/30 animate-pulse"
      >
        <span className="text-2xl">🚨</span>
        <span>SOS</span>
      </motion.button>

      {/* Modals */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatModal onClose={() => setIsChatOpen(false)} />
        )}
        {isAnalyzerOpen && (
          <AnalyzerModal onClose={() => setIsAnalyzerOpen(false)} />
        )}
        {isTrackerOpen && (
          <TrackerModal onClose={() => setIsTrackerOpen(false)} />
        )}
        {isMedicationOpen && (
          <MedicationModal onClose={() => setIsMedicationOpen(false)} />
        )}
        {isEmergencyOpen && (
          <EmergencyModal onClose={() => setIsEmergencyOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainDashboard;
