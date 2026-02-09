import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { useAppStore } from './store/index.js'
import { TopBar } from './components/ui/index.js'
import { ChatModal, AnalyzerModal, TrackerModal, MedicationModal, EmergencyModal } from './components/modals/index.js'
import DashboardOverviewModal from './components/modals/DashboardOverviewModal.jsx'
import { DoctorModel, StethoscopeModel, SyringeModel, PillBottleModel, DashboardModel } from './components/3d/index.js'

// Email constant
const CONTACT_EMAIL = 'yusufhealth@io'

// Loading Fallback
const LoadingFallback = () => (
  <mesh>
    <icosahedronGeometry args={[0.5, 0]} />
    <meshStandardMaterial color="#6366f1" wireframe />
  </mesh>
)

// 3D Ambulance (inside Canvas)
const Ambulance3D = () => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    }
  })
  
  return (
    <group ref={groupRef} scale={0.8} position={[0, 0, 0]}>
      {/* Ambulance body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Red stripe */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.1, 0.2, 4]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.5, 1.5]}>
        <boxGeometry args={[1.8, 0.8, 1.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.7, 2.2]}>
        <boxGeometry args={[1.6, 0.5, 0.1]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[0.8, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.8, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.8, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.8, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Cross on ambulance */}
      <mesh position={[0, 1.1, -0.5]}>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1.1, -0.5]}>
        <boxGeometry args={[0.3, 0.8, 0.1]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Siren lights */}
      <mesh position={[0, 1.3, 2]}>
        <boxGeometry args={[0.3, 0.15, 0.3]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 1.3, -2]}>
        <boxGeometry args={[0.3, 0.15, 0.3]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
      </mesh>
      
      {/* Siren glow */}
      <pointLight position={[0, 1.5, 2]} color="#ef4444" intensity={2} distance={3} />
      <pointLight position={[0, 1.5, -2]} color="#3b82f6" intensity={2} distance={3} />
    </group>
  )
}

// Big Continuous DNA Helix
const BigDNAHelix = () => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const strands = []
  const numPairs = 40
  
  for (let i = 0; i < numPairs; i++) {
    const y = (i - numPairs / 2) * 1.0
    const angle = i * 0.35
    
    const x1 = Math.cos(angle) * 1.2
    const z1 = Math.sin(angle) * 1.2
    const x2 = -Math.cos(angle) * 1.2
    const z2 = -Math.sin(angle) * 1.2
    
    strands.push(
      <group key={i}>
        <mesh position={[x1, y, z1]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[x2, y, z2]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
        </mesh>
        {i < numPairs - 1 && (
          <mesh position={[0, y + 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 2.4, 6]} />
            <meshStandardMaterial color="#00ffff" transparent opacity={0.2} />
          </mesh>
        )}
      </group>
    )
  }
  
  return (
    <Float speed={0.2} rotationIntensity={0} floatIntensity={0.1}>
      <group ref={groupRef} position={[-25, 0, -20]}>
        {strands}
      </group>
    </Float>
  )
}

// Big Floating Pills
const BigFloatingPills = () => {
  const pills = [
    { position: [-8, 15, -15], color: '#ef4444', scale: 1.5, rotation: [0.5, 0.3, 0] },
    { position: [8, 8, -12], color: '#22c55e', scale: 1.2, rotation: [0.2, 0.5, 0.3] },
    { position: [-6, -5, -18], color: '#f97316', scale: 1.3, rotation: [0.4, 0.2, 0.5] },
    { position: [7, -12, -15], color: '#06b6d4', scale: 1.0, rotation: [0.3, 0.4, 0.2] },
  ]
  
  return (
    <>
      {pills.map((pill, index) => (
        <Float key={index} speed={0.5 + index * 0.1} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh 
            position={pill.position} 
            scale={pill.scale}
            rotation={pill.rotation}
          >
            <capsuleGeometry args={[0.2, 0.8, 4, 12]} />
            <meshStandardMaterial color={pill.color} emissive={pill.color} emissiveIntensity={0.4} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// Pulse Signals - ECG/EKG Style
const PulseSignals = () => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      // Continuous pulse animation
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 1
      groupRef.current.scale.set(pulse, pulse, pulse)
    }
  })
  
  const pulses = [
    { position: [12, 5, -15], color: '#ef4444', size: 0.12 },
    { position: [12, -15, -12], color: '#22c55e', size: 0.1 },
    { position: [12, -30, -15], color: '#f97316', size: 0.14 },
  ]
  
  return (
    <>
      {pulses.map((pulse, index) => (
        <Float key={index} speed={0.4} rotationIntensity={0.1} floatIntensity={0.3}>
          <group ref={groupRef} position={pulse.position}>
            {/* Center glowing sphere */}
            <mesh>
              <sphereGeometry args={[pulse.size * 2, 12, 12]} />
              <meshStandardMaterial 
                color={pulse.color} 
                emissive={pulse.color} 
                emissiveIntensity={1}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Outer glow ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[pulse.size * 3, pulse.size * 0.3, 8, 24]} />
              <meshStandardMaterial 
                color={pulse.color} 
                emissive={pulse.color} 
                emissiveIntensity={0.5}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  )
}

// Animated expanding ring for pulse signals
const AnimatedRing = ({ color, delay = 0, scale = 1 }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.elapsedTime
      const cycle = (time * 1.5 + delay) % 2
      const progress = cycle / 2
      
      meshRef.current.scale.setScalar(scale * (0.5 + progress * 2))
      materialRef.current.opacity = 0.6 * (1 - progress)
    }
  })
  
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.35, 32]} />
      <meshBasicMaterial 
        ref={materialRef}
        color={color} 
        transparent 
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Biological Heart - Pulsing 3D Heart
const BiologicalHeart = () => {
  const groupRef = useRef()
  const materialRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      // Heart beat animation - faster when visible
      const beat = Math.sin(state.clock.elapsedTime * 3) * 0.08 + 1
      groupRef.current.scale.set(beat, beat, beat)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    if (materialRef.current) {
      // Pulsing emissive intensity
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7
      materialRef.current.emissiveIntensity = pulse
    }
  })
  
  return (
    <Float speed={0.4} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={groupRef} position={[15, -15, -20]}>
        {/* Main heart shape using scaled spheres */}
        <group scale={2.5}>
          {/* Left lobe */}
          <mesh position={[-0.4, 0.3, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              ref={materialRef}
              color="#ef4444" 
              emissive="#dc2626" 
              emissiveIntensity={0.7}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          {/* Right lobe */}
          <mesh position={[0.4, 0.3, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              color="#ef4444" 
              emissive="#dc2626" 
              emissiveIntensity={0.7}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          {/* Bottom point */}
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial 
              color="#ef4444" 
              emissive="#dc2626" 
              emissiveIntensity={0.7}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </group>
        {/* Glow effect */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial 
            color="#ef4444"
            transparent
            opacity={0.15}
          />
        </mesh>
        {/* Outer pulsing ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.6, 64]} />
          <meshBasicMaterial 
            color="#ef4444"
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Background Scene
const BackgroundScene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} />
      <directionalLight position={[-20, -30, -10]} intensity={0.3} color="#8b5cf6" />
      <Stars radius={200} depth={100} count={2000} factor={4} saturation={0} fade speed={0.15} />
      
      <BigDNAHelix />
      <BigFloatingPills />
      <PulseSignals />
      <BiologicalHeart />
    </>
  )
}

// Model wrapper with futuristic assemble/disintegrate animation
const ModelWrapper = ({ model: Model, onClick, index, rotationY = 0, scale = 1, positionY = 0, autoRotate = false, label = '', isVisible = false }) => {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const [hasConstructed, setHasConstructed] = useState(false)
  
  useEffect(() => {
    if (isVisible) {
      setHasConstructed(true)
    } else {
      setHasConstructed(false)
    }
  }, [isVisible])
  
  useFrame((state) => {
    if (groupRef.current) {
      // Target scale based on visibility
      const targetScale = hasConstructed ? scale : 0
      const currentScale = groupRef.current.scale.x
      
      // Smooth scale interpolation
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08)
      groupRef.current.scale.setScalar(newScale)
      
      // Continuous rotation (always gentle)
      if (autoRotate) {
        groupRef.current.rotation.y += 0.001
      }
      
      // Subtle floating animation
      groupRef.current.position.y = positionY + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.03
    }
  })
  
  // Futuristic text styles per label
  const getTextStyle = () => {
    switch(label) {
      case 'Dr. AI':
        return { 
          gradient: 'from-cyan-400 via-blue-500 to-purple-600',
          icon: '🧠',
          text: 'Dr. AI'
        }
      case 'Analyzer':
        return { 
          gradient: 'from-green-400 via-emerald-500 to-teal-600',
          icon: '📊',
          text: 'Report Analyzer'
        }
      case 'Tracker':
        return { 
          gradient: 'from-orange-400 via-red-500 to-pink-600',
          icon: '💉',
          text: 'Treatment Tracker'
        }
      case 'Medications':
        return { 
          gradient: 'from-purple-400 via-violet-500 to-indigo-600',
          icon: '💊',
          text: 'Medication Manager'
        }
      case 'Dashboard':
        return { 
          gradient: 'from-amber-400 via-yellow-500 to-orange-600',
          icon: '📈',
          text: 'Health Overview'
        }
      default:
        return { 
          gradient: 'from-cyan-400 to-purple-600',
          icon: '⚡',
          text: label
        }
    }
  }
  
  const textStyle = getTextStyle()
  
  return (
    <>
      <group
        ref={groupRef}
        scale={0}
        rotation={[0, rotationY, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        style={{ transition: 'none' }}
      >
        <Model />
      </group>
      
      {/* Futuristic Hover Label - Glowing holographic bubble */}
      <Html position={[0, positionY + 0.5, 0]} center distanceFactor={10}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: hovered ? 1 : 0, 
            scale: hovered ? 1 : 0.5,
            y: hovered ? 0 : 20
          }}
          transition={{ 
            duration: 0.4,
            scale: { type: 'spring', stiffness: 300, damping: 20 },
            opacity: { duration: 0.2 }
          }}
          className="relative"
        >
          {/* Glow effect */}
          <div 
            className={`absolute -inset-2 bg-gradient-to-r ${textStyle.gradient} rounded-xl blur-lg opacity-60`}
            style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
          />
          
          {/* Main bubble */}
          <div 
            className="relative bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            style={{ 
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(0,0,0,0.3)'
            }}
          >
            {/* Animated line at top */}
            <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
            
            <div className="flex items-center gap-3">
              {/* Icon with glow */}
              <motion.span 
                className="text-xl"
                animate={{ 
                  scale: hovered ? [1, 1.2, 1] : 1,
                  rotate: hovered ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                {textStyle.icon}
              </motion.span>
              
              {/* Text with gradient */}
              <p className="text-sm font-bold whitespace-nowrap bg-gradient-to-r bg-clip-text text-transparent"
                 style={{ 
                   backgroundImage: `linear-gradient(to right, ${textStyle.gradient.replace('from-', '').replace(' via-', ',').replace(' to-', ',')})`
                 }}
              >
                {textStyle.text}
              </p>
              
              {/* Animated dots */}
              <motion.div 
                className="flex gap-1 ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            </div>
          </div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />
        </motion.div>
        </Html>
    </>
  )
}

// Section Canvas - Models with futuristic assemble/disintegrate animations
const SectionCanvas = ({ model, onClick, index, rotationY = 0, modelScale = 1, positionY = 0, autoRotate = false, label = '', isVisible = false }) => {
  return (
    <div className="w-full h-screen relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, clearColor: '#0a0a1a' }}
        frameloop="always"
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 2, 3]} intensity={0.8} color="#ffffff" />
        
        <Suspense fallback={<LoadingFallback />}>
          <ModelWrapper 
            model={model} 
            onClick={onClick} 
            index={index} 
            rotationY={rotationY}
            scale={modelScale}
            positionY={positionY}
            autoRotate={autoRotate}
            label={label}
            isVisible={isVisible}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Navigation Dots
const NavigationDots = ({ totalSections, activeSection, onNavigate }) => {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-6">
      {Array.from({ length: totalSections }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onNavigate(index)}
          className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
            activeSection === index 
              ? 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]' 
              : 'bg-white/20 hover:bg-white/40'
          }`}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          {index < totalSections - 1 && (
            <div 
              className={`absolute left-1/2 w-0.5 h-10 -translate-x-1/2 ${
                index < activeSection ? 'bg-cyan-400/50' : 'bg-white/10'
              }`}
              style={{ top: '100%' }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

// Glitch Text Component with entrance animation
const GlitchText = ({ text }) => {
  return (
    <div 
      className="relative inline-block glitch-appear" 
      style={{ 
        fontSize: '3rem', 
        fontWeight: 'bold', 
        letterSpacing: '0.1em',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <span
        className="absolute inset-0 text-cyan-400"
        style={{ 
          textShadow: '0 0 40px rgba(34,211,238,1)',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          animation: 'glitch-shift 0.3s infinite'
        }}
      >
        {text}
      </span>
      <span
        className="relative text-white"
        style={{ 
          textShadow: '0 0 30px rgba(168,85,247,1)'
        }}
      >
        {text}
      </span>
      <span
        className="absolute inset-0 text-purple-500"
        style={{ 
          textShadow: '0 0 40px rgba(168,85,247,1)',
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          animation: 'glitch-shift-reverse 0.4s infinite'
        }}
      >
        {text}
      </span>
    </div>
  )
}

// Landing Page Component - First section with huge HEALIX title and attention-grabbing effects
const LandingPage = ({ onScrollDown }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none"
      />
      
      {/* Pulsing glow behind HEALIX */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"
      />
      
      {/* Huge HEALIX Title with Glitch Effect */}
      <div className="relative z-10">
        {/* Main text */}
        <motion.h1
          initial={{ 
            opacity: 0,
            y: 100,
            filter: 'blur(20px)'
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }}
          transition={{ 
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            scale: [1, 1.05, 1]
          }}
          className="text-8xl font-bold text-white tracking-wider relative"
          style={{ textShadow: '0 0 80px rgba(168,85,247,1)' }}
        >
          HEALIX
          {/* Glitch layers */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 text-cyan-400"
            style={{ 
              textShadow: '0 0 80px rgba(34,211,238,1)',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: 'translate(-2px, 0)'
            }}
          >
            HEALIX
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.1 }}
            className="absolute inset-0 text-purple-400"
            style={{ 
              textShadow: '0 0 80px rgba(168,85,247,1)',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: 'translate(2px, 0)'
            }}
          >
            HEALIX
          </motion.span>
        </motion.h1>
        
        {/* Underline animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
          className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 mx-auto mt-2 rounded-full"
        />
      </div>
      
      {/* Tagline with entrance animation */}
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-2xl text-cyan-400 mt-6 font-light tracking-[0.3em] z-10"
      >
        Your Personal AI Arsenal
      </motion.p>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={onScrollDown}
      >
        <span className="text-sm text-gray-400">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// Sidebar with 3D Canvas for Ambulance
const Sidebar3D = ({ activeSection, onNavigate }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null)
  
  const icons = [
    { index: 0, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: '#00ffff', label: 'Landing' },
    { index: 1, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: '#ef4444', label: 'Dr. AI' },
    { index: 2, icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', color: '#22c55e', label: 'Analyzer' },
    { index: 3, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#f97316', label: 'Tracker' },
    { index: 4, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: '#a855f7', label: 'Medications' },
    { index: 5, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: '#f59e0b', label: 'Dashboard' }
  ]
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 z-50 flex flex-col items-center py-6 glass-morphism-dark border-r border-white/10">
      {/* HEALIX Logo at top */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-xs font-semibold text-red-400 tracking-wider"
        >
          HEALIX
        </motion.div>
      </div>
      
      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col gap-3">
        {icons.map((item) => (
          <div key={item.index} className="relative">
            <motion.button
              onClick={() => onNavigate(item.index)}
              onMouseEnter={() => setHoveredIcon(item.index)}
              onMouseLeave={() => setHoveredIcon(null)}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeSection === item.index 
                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/50' 
                  : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.index && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <svg 
                className={`w-6 h-6 ${activeSection === item.index ? 'text-cyan-400' : 'text-gray-400'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </motion.button>
            
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIcon === item.index && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-14 top-1/2 -translate-y-1/2 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-white/10"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Emergency Button */}
      <motion.button
        onMouseEnter={() => setHoveredIcon('emergency')}
        onMouseLeave={() => setHoveredIcon(null)}
        className="mt-auto w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: ['0_0_10px_rgba(239,68,68,0.5)', '0_0_20px_rgba(239,68,68,0.8)', '0_0_10px_rgba(239,68,68,0.5)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </motion.button>
      
      {/* Emergency Tooltip */}
      <AnimatePresence>
        {hoveredIcon === 'emergency' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-14 top-auto bottom-20 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-white/10"
          >
            Emergency: 108
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contact Email */}
      <motion.a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-3 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        title={CONTACT_EMAIL}
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </motion.a>
    </div>
  )
}

// Scroll Section - Medical-themed animations per section
const ScrollSection = ({ index, model, onClick, rotationY = 0, modelScale = 1, positionY = 0, autoRotate = false, label = '' }) => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.4, rootMargin: '-20% 0px -20% 0px' }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  // Medical animation effects based on section
  const renderMedicalEffect = () => {
    switch(label) {
      case 'Dr. AI':
        // Brain neural network effect
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isVisible ? 0.4 : 0,
              scale: isVisible ? 1 : 0
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, transparent 30%, rgba(139, 92, 246, 0.2) 70%)`,
              animation: isVisible ? 'brainPulse 2s ease-in-out infinite' : 'none'
            }}
          />
        )
      case 'Analyzer':
        // ECG/Pulse line animation
        return (
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: isVisible ? 1 : 0,
                opacity: isVisible ? 0.8 : 0
              }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              d="M0,150 Q100,150 150,100 T300,150 T450,50 T600,150 T800,150"
              fill="none"
              stroke="url(#pulseGradient)"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 10px #22d3ee)' }}
            />
            <defs>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        )
      case 'Tracker':
        // Medical cross + injection particles
        return (
          <>
            {/* Rotating medical crosses */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ 
                  opacity: isVisible ? 0.3 : 0,
                  rotate: isVisible ? 360 : 0
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: i * 0.2
                }}
                className="absolute pointer-events-none"
                style={{ 
                  left: `${20 + i * 20}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  width: '30px',
                  height: '30px',
                  background: 'linear-gradient(90deg, #ef4444 48%, transparent 48%, transparent 52%, #ef4444 52%)',
                  borderRadius: '4px'
                }}
              />
            ))}
            {/* Rising particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ 
                  opacity: isVisible ? 0.6 : 0,
                  y: isVisible ? '0%' : '100%'
                }}
                transition={{ 
                  duration: 2 + Math.random(), 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: 'easeOut'
                }}
                className="absolute pointer-events-none w-2 h-2 rounded-full bg-green-400"
                style={{ 
                  left: `${10 + Math.random() * 80}%`,
                  filter: 'drop-shadow(0 0 6px #4ade80)'
                }}
              />
            ))}
          </>
        )
      case 'Medications':
        // Floating pills/capsules
        return (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: '100%', rotate: 0 }}
                animate={{ 
                  opacity: isVisible ? 0.5 : 0,
                  y: isVisible ? `${20 + Math.random() * 30}%` : '100%',
                  rotate: isVisible ? 360 : 0
                }}
                transition={{ 
                  duration: 4 + Math.random() * 2, 
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'linear'
                }}
                className="absolute pointer-events-none"
                style={{ 
                  left: `${15 + i * 12}%`,
                  width: i % 2 === 0 ? '16px' : '8px',
                  height: '24px',
                  borderRadius: i % 2 === 0 ? '8px' : '4px',
                  background: i % 3 === 0 
                    ? 'linear-gradient(180deg, #f97316 50%, transparent 50%)' 
                    : i % 3 === 1
                    ? 'linear-gradient(180deg, #22c55e 50%, transparent 50%)'
                    : 'linear-gradient(180deg, #3b82f6 50%, transparent 50%)',
                  filter: 'drop-shadow(0 0 8px currentColor)'
                }}
              />
            ))}
          </>
        )
      case 'Dashboard':
        // Health chart bars
        return (
          <div className="absolute inset-0 pointer-events-none flex items-end justify-center gap-4 pb-20">
            {[40, 70, 55, 90, 75, 85, 65].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: isVisible ? height : 0,
                  opacity: isVisible ? (height > 80 ? 0.9 : height > 60 ? 0.7 : 0.5) : 0
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + i * 0.1,
                  ease: 'easeOut'
                }}
                className="w-8 rounded-t-lg"
                style={{ 
                  background: height > 80 
                    ? 'linear-gradient(180deg, #22d3ee, #3b82f6)' 
                    : height > 60
                    ? 'linear-gradient(180deg, #22c55e, #84cc16)'
                    : 'linear-gradient(180deg, #f97316, #eab308)',
                  filter: 'drop-shadow(0 0 10px currentColor)'
                }}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3
      }}
      transition={{ duration: 0.6 }}
      className="w-full h-screen relative overflow-hidden"
    >
      {/* Medical-themed background effect */}
      {renderMedicalEffect()}
      
      <SectionCanvas 
        model={model} 
        onClick={onClick} 
        index={index} 
        rotationY={rotationY}
        modelScale={modelScale}
        positionY={positionY}
        autoRotate={autoRotate}
        label={label}
        isVisible={isVisible}
      />
      
      {/* Add CSS animation for brain pulse */}
      <style>{`
        @keyframes brainPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
      `}</style>
    </motion.section>
  )
}

function App() {
  const { 
    activeModal, setActiveModal, clearActiveModal,
    emergencyDetected, setEmergencyDetected,
    notifications, addNotification
  } = useAppStore()
  
  const [activeSection, setActiveSection] = useState(0)
  const [showDashboard, setShowDashboard] = useState(false)
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1]
      toast.custom(
        <div className={`p-4 rounded-xl glass-morphism-dark ${
          latest.type === 'error' ? 'border-red-500/50' :
          latest.type === 'success' ? 'border-green-500/50' :
          'border-cyan-500/50'
        }`}>
          <div className="text-white font-medium">{latest.message}</div>
        </div>,
        { duration: 3000, position: 'top-right' }
      )
    }
  }, [notifications])
  
  const navigateToSection = useCallback((index) => {
    setActiveSection(index)
    if (index === 0) {
      // Scroll to top (landing page)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } else {
      const sections = document.querySelectorAll('.scroll-section')
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])
  
  // Scroll down to first tool section
  const scrollDown = () => {
    const scrollSections = document.querySelectorAll('.scroll-section')
    if (scrollSections.length > 1) {
      scrollSections[1].scrollIntoView({ behavior: 'smooth' })
      setActiveSection(1)
    }
  }
  
  const openChat = useCallback(() => {
    setActiveModal('chat')
    addNotification({ type: 'info', message: 'Opening Dr. AI Consultation' })
  }, [setActiveModal, addNotification])
  
  const openAnalyzer = useCallback(() => {
    setActiveModal('analyzer')
    addNotification({ type: 'info', message: 'Opening Report Analyzer' })
  }, [setActiveModal, addNotification])
  
  const openTracker = useCallback(() => {
    setActiveModal('tracker')
    addNotification({ type: 'info', message: 'Opening Treatment Tracker' })
  }, [setActiveModal, addNotification])
  
  const openMedication = useCallback(() => {
    setActiveModal('medication')
    addNotification({ type: 'info', message: 'Opening Medication Manager' })
  }, [setActiveModal, addNotification])
  
  const closeEmergency = useCallback(() => {
    setEmergencyDetected(null)
  }, [setEmergencyDetected])
  
  // Section configs - Landing Page + smaller models for performance
  const sections = [
    { type: 'landing' },
    { model: DoctorModel, onClick: openChat, rotationY: -Math.PI / 2, modelScale: 0.5, positionY: 0.2, autoRotate: false, label: 'Dr. AI' },
    { model: StethoscopeModel, onClick: openAnalyzer, rotationY: 0, modelScale: 0.55, positionY: 0.2, autoRotate: true, label: 'Analyzer' },
    { model: SyringeModel, onClick: openTracker, rotationY: Math.PI / 6, modelScale: 0.5, positionY: 0.2, autoRotate: true, label: 'Tracker' },
    { model: PillBottleModel, onClick: openMedication, rotationY: 0, modelScale: 0.45, positionY: 0.2, autoRotate: true, label: 'Medications' },
    { model: DashboardModel, onClick: () => setShowDashboard(true), rotationY: 0, modelScale: 0.45, positionY: 0.2, autoRotate: true, label: 'Dashboard' }
  ]
  
  // Scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setActiveSection(index)
          }
        })
      },
      { threshold: 0.5 }
    )
    
    document.querySelectorAll('.scroll-section').forEach((section) => {
      observer.observe(section)
    })
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 overflow-x-hidden">
      <style>{`
        @keyframes glitch-shift {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes glitch-shift-reverse {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>
      
      <Toaster
        toastOptions={{
          className: '',
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      />
      
      {/* Global 3D Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 40], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, clearColor: 'transparent' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <BackgroundScene />
        </Canvas>
      </div>
      
      {/* 3D Sidebar */}
      <Sidebar3D activeSection={activeSection} onNavigate={navigateToSection} />
      
      {/* Navigation Dots */}
      <NavigationDots 
        totalSections={sections.length} 
        activeSection={activeSection} 
        onNavigate={navigateToSection}
      />
      
      {/* Main Content */}
      <main className="relative ml-20">
        {/* Landing Page */}
        <div id="landing" className="scroll-section" data-index={0}>
          <LandingPage onScrollDown={scrollDown} />
        </div>
        
        {sections.map((section, index) => (
          index === 0 ? null : (
            <div 
              key={index} 
              className="scroll-section"
              data-index={index}
            >
                <ScrollSection 
                  index={index}
                  model={section.model}
                  onClick={section.onClick}
                  rotationY={section.rotationY}
                  modelScale={section.modelScale}
                  positionY={section.positionY}
                  autoRotate={section.autoRotate}
                  label={section.label}
                />
            </div>
          )
        ))}
      </main>
      
      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'chat' && <ChatModal onClose={clearActiveModal} />}
        {activeModal === 'analyzer' && <AnalyzerModal onClose={clearActiveModal} />}
        {activeModal === 'tracker' && <TrackerModal onClose={clearActiveModal} />}
        {activeModal === 'medication' && <MedicationModal onClose={clearActiveModal} />}
        {showDashboard && <DashboardOverviewModal onClose={() => setShowDashboard(false)} onNavigate={navigateToSection} />}
        {emergencyDetected && <EmergencyModal emergency={emergencyDetected} onClose={closeEmergency} onCancel={closeEmergency} />}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-20 right-0 p-4 text-center text-gray-500 text-sm glass-morphism-dark border-t border-white/5 z-40 pointer-events-auto">
        <p>© 2026 HEALIX Healthcare Platform • Emergency: Call 108</p>
      </footer>
    </div>
  )
}

export default App
