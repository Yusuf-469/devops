import React, { useEffect, useRef } from 'react';

const techStack = [
  { name: 'React', icon: '⚛️', color: 'from-blue-400 to-blue-600' },
  { name: 'TypeScript', icon: '📘', color: 'from-blue-600 to-blue-800' },
  { name: 'Three.js', icon: '🎮', color: 'from-gray-800 to-black' },
  { name: 'Tailwind CSS', icon: '🎨', color: 'from-cyan-400 to-cyan-600' },
  { name: 'Zustand', icon: '🗄️', color: 'from-yellow-500 to-yellow-700' },
  { name: 'Vite', icon: '⚡', color: 'from-purple-500 to-purple-700' },
  { name: 'DeepSeek AI', icon: '🤖', color: 'from-indigo-500 to-indigo-700' },
  { name: 'OpenRouter', icon: '🌐', color: 'from-green-500 to-green-700' },
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
          {techStack.map((tech, index) => (
            <div 
              key={tech.name} 
              className="tech-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`tech-icon bg-gradient-to-br ${tech.color}`}>
                <span className="text-4xl">{tech.icon}</span>
              </div>
              <span className="tech-name">{tech.name}</span>
              <div className="tech-shine" />
            </div>
          ))}
        </div>

        {/* Floating decorations */}
        <div className="tech-decoration top-left" />
        <div className="tech-decoration bottom-right" />
      </div>
    </section>
  );
};

export default TechStack;
