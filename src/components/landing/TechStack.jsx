import React, { useEffect, useRef } from 'react';

// SVG Icons for each technology
const ReactIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <circle cx="12" cy="12" r="2.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1" />
    <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(120 12 12)" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M3 3h18v18H3V3zm14 12h-2v-6h-2v-2h6v2h-2v6zm-8-2h2v2H7v-6h2v4zm2-4h2v6h-2V9z" />
  </svg>
);

const ThreeJsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L18.5 7 12 9.5 5.5 7 12 4.5zM4 8.5l7 3.5v7l-7-3.5v-7zm16 0v7l-7 3.5v-7l7-3.5z" />
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.11 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.48 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.11 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.48 12 7 12z" />
  </svg>
);

const ZustandIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const ViteIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M21.3 4.4L12.6 1.1c-.4-.1-.8-.1-1.2 0L2.7 4.4c-.5.2-.8.7-.7 1.2l1.8 14.5c.1.5.4.9.8 1.1l6.8 3.5c.2.1.4.1.6.1s.4 0 .6-.1l6.8-3.5c.4-.2.7-.6.8-1.1l1.8-14.5c.1-.5-.2-1-.7-1.2zM12 18l-4-4h2.5V8h3v6H16l-4 4z" />
  </svg>
);

const DeepSeekIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4-8a4 4 0 1 1-4-4 4 4 0 0 1 4 4z" />
  </svg>
);

const OpenRouterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
  </svg>
);

const techStack = [
  { name: 'React', icon: ReactIcon, color: 'from-blue-400 to-blue-600' },
  { name: 'TypeScript', icon: TypeScriptIcon, color: 'from-blue-600 to-blue-800' },
  { name: 'Three.js', icon: ThreeJsIcon, color: 'from-gray-600 to-gray-800' },
  { name: 'Tailwind CSS', icon: TailwindIcon, color: 'from-cyan-400 to-cyan-600' },
  { name: 'Zustand', icon: ZustandIcon, color: 'from-yellow-500 to-orange-500' },
  { name: 'Vite', icon: ViteIcon, color: 'from-purple-500 to-purple-700' },
  { name: 'OpenRouter AI', icon: DeepSeekIcon, color: 'from-indigo-500 to-indigo-700' },
  { name: 'OpenRouter', icon: OpenRouterIcon, color: 'from-green-500 to-emerald-600' },
];

const TechStack = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="tech-stack" className="section tech-section fade-in-section">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#20B2AA]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8">
        <h2 className="section-title text-white text-center mb-12">
          Built With Modern Technology
        </h2>

        {/* Tech Grid */}
        <div className="tech-grid">
          {techStack.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <div 
                key={tech.name} 
                className="tech-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`tech-icon bg-gradient-to-br ${tech.color}`}>
                  <IconComponent />
                </div>
                <span className="tech-name">{tech.name}</span>
                <div className="tech-shine" />
              </div>
            );
          })}
        </div>

        {/* Floating decorations */}
        <div className="tech-decoration top-left" />
        <div className="tech-decoration bottom-right" />
      </div>
    </section>
  );
};

export default TechStack;
