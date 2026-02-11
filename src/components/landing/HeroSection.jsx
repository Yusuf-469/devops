import React from 'react';

const HeroSection = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section hero-section" id="hero">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#20B2AA] animate-gradient" />
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Logo with gradient animation */}
        <h1 className="logo-text mb-6">
          <span className="gradient-text animate-gradient-text">HEALIX</span>
        </h1>

        {/* Tagline */}
        <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
          Your Health, Visualized
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          AI-powered diagnosis, instant report analysis, complete health management — 
          all in one intelligent platform.
        </p>

        {/* Scroll CTA */}
        <button
          onClick={scrollToFeatures}
          className="scroll-cta group"
        >
          <span className="mr-2">Explore Features</span>
          <svg 
            className="w-5 h-5 animate-bounce inline-block" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent" />
    </section>
  );
};

export default HeroSection;
