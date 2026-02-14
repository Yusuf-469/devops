import React, { useState, useEffect, Suspense, useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { useAppStore } from '../store/index.js'
import { TopBar } from '../components/ui/index.js'
import { ChatModal, AnalyzerModal, TrackerModal, MedicationModal, EmergencyModal } from '../components/modals/index.js'
import DashboardOverviewModal from '../components/modals/DashboardOverviewModal.jsx'

// Model paths
const MODEL_PATHS = {
  doctor: '/models/medical doctor 3d model.glb',
  stethoscope: '/models/stethoscope 3d model.glb',
  syringe: '/models/cartoon syringe 3d model.glb',
  pills: '/models/pill bottle 3d model.glb',
  dashboard: '/models/dashboard.glb'
}

// Preload all models
Object.values(MODEL_PATHS).forEach(path => {
  try {
    useGLTF.preload(path)
  } catch (e) {
    console.log('Preload hint for:', path)
  }
})

// Loading Spinner
const LoadingSpinner = () => (
  <mesh rotation={[0, 0, 0]}>
    <icosahedronGeometry args={[1.5, 1]} />
    <meshStandardMaterial color="#6366f1" wireframe />
  </mesh>
)

// Error Fallback with Emoji - INTERACTIVE
const ErrorFallback = ({ icon, label, onClick }) => {
  const [hovered, setHovered] = useState(false)
  
  return (
    <group 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh scale={hovered ? 1.1 : 1}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#374151" : "#1e293b"} 
          metalness={0.3} 
          roughness={0.7}
          emissive={hovered ? "#06b6d4" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      <Html center distanceFactor={12}>
        <div 
          className="flex flex-col items-center gap-3 cursor-pointer hover:scale-110 transition-transform"
          style={{ pointerEvents: 'auto' }}
          onClick={onClick}
        >
          <span className="text-8xl select-none drop-shadow-lg">{icon}</span>
          <span className="text-white font-bold text-lg bg-gray-900/90 px-6 py-2 rounded-full border border-cyan-500/50 shadow-lg">{label}</span>
          <span className="text-cyan-400 text-sm font-medium animate-pulse">Click to Open</span>
        </div>
      </Html>
    </group>
  )
}

// Generic GLB Model Loader
const GLBModel = ({ path, scale = 1 }) => {
  const { scene } = useGLTF(path)
  const clonedScene = useMemo(() => scene.clone(true), [scene])
  return <primitive object={clonedScene} scale={scale} />
}

// Error Boundary Component
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Model loading error:', error)
    if (this.props.onError) {
      this.props.onError()
    }
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Doctor Model Component - LARGE & INTERACTIVE
const DoctorModel = ({ onClick, visible }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Only animate when visible
      if (visible) {
        // Doctor is stationary - just faces the camera (270 degrees rotation)
        groupRef.current.rotation.y = 4.71
        const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.03 + 1
        const targetScale = hovered ? 1.15 : breathe
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
      }
    }
  })
  
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    console.log('Doctor model clicked!')
    onClick()
  }, [onClick])
  
  if (error) {
    return <ErrorFallback icon=" doctor " label="Dr. AI" onClick={handleClick} />
  }
  
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group 
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        visible={visible}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary onError={() => setError(true)} fallback={<ErrorFallback icon=" doctor " label="Dr. AI" onClick={handleClick} />}>
            <GLBModel path={MODEL_PATHS.doctor} scale={5.5} />
          </ModelErrorBoundary>
        </Suspense>
        
        {/* Glow effect on hover */}
        {hovered && visible && (
          <mesh scale={1.2}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
          </mesh>
        )}
        
        {/* Hover Label */}
        {visible && (
          <Html position={[0, 4, 0]} center distanceFactor={12}>
            <div 
              className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-xl border border-cyan-500/50 shadow-lg">
                <span className="text-cyan-400 font-bold text-xl">Dr. AI</span>
                <p className="text-gray-400 text-sm">Click to consult</p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Stethoscope Model Component - LARGE & INTERACTIVE
const StethoscopeModel = ({ onClick, visible }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y += 0.003
      const targetScale = hovered ? 1.2 : 1
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
    }
  })
  
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    console.log('Stethoscope model clicked!')
    onClick()
  }, [onClick])
  
  if (error) {
    return <ErrorFallback icon=" stethoscope " label="Report Analyzer" onClick={handleClick} />
  }
  
  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
      <group 
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        visible={visible}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary onError={() => setError(true)} fallback={<ErrorFallback icon=" stethoscope " label="Report Analyzer" onClick={handleClick} />}>
            <GLBModel path={MODEL_PATHS.stethoscope} scale={6.5} />
          </ModelErrorBoundary>
        </Suspense>
        
        {hovered && visible && (
          <mesh scale={1.2}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.1} />
          </mesh>
        )}
        
        {visible && (
          <Html position={[0, 3.5, 0]} center distanceFactor={12}>
            <div 
              className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-xl border border-green-500/50 shadow-lg">
                <span className="text-green-400 font-bold text-xl">Report Analyzer</span>
                <p className="text-gray-400 text-sm">Click to upload</p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Syringe Model Component - LARGE & INTERACTIVE
const SyringeModel = ({ onClick, visible }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y += 0.003
      const targetScale = hovered ? 1.25 : 1
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
    }
  })
  
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    console.log('Syringe model clicked!')
    onClick()
  }, [onClick])
  
  if (error) {
    return <ErrorFallback icon=" syringe " label="Treatment Tracker" onClick={handleClick} />
  }
  
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.15}>
      <group 
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        visible={visible}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary onError={() => setError(true)} fallback={<ErrorFallback icon=" syringe " label="Treatment Tracker" onClick={handleClick} />}>
            <GLBModel path={MODEL_PATHS.syringe} scale={6} />
          </ModelErrorBoundary>
        </Suspense>
        
        {hovered && visible && (
          <mesh scale={1.2}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.1} />
          </mesh>
        )}
        
        {visible && (
          <Html position={[0, 3.5, 0]} center distanceFactor={12}>
            <div 
              className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-xl border border-orange-500/50 shadow-lg">
                <span className="text-orange-400 font-bold text-xl">Treatment Tracker</span>
                <p className="text-gray-400 text-sm">Click to view</p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Pill Bottle Model Component - LARGE & INTERACTIVE
const PillBottleModel = ({ onClick, visible }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y += 0.003
      const targetScale = hovered ? 1.2 : 1
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
    }
  })
  
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    console.log('Pill Bottle model clicked!')
    onClick()
  }, [onClick])
  
  if (error) {
    return <ErrorFallback icon=" pills " label="Medication Manager" onClick={handleClick} />
  }
  
  return (
    <Float speed={1.3} rotationIntensity={0.05} floatIntensity={0.25}>
      <group 
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        visible={visible}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary onError={() => setError(true)} fallback={<ErrorFallback icon=" pills " label="Medication Manager" onClick={handleClick} />}>
            <GLBModel path={MODEL_PATHS.pills} scale={5} />
          </ModelErrorBoundary>
        </Suspense>
        
        {hovered && visible && (
          <mesh scale={1.2}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.1} />
          </mesh>
        )}
        
        {visible && (
          <Html position={[0, 4, 0]} center distanceFactor={12}>
            <div 
              className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-xl border border-purple-500/50 shadow-lg">
                <span className="text-purple-400 font-bold text-xl">Medication Manager</span>
                <p className="text-gray-400 text-sm">Click to manage</p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Dashboard Model Component - LARGE & INTERACTIVE
const DashboardModelComp = ({ onClick, visible }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y += 0.003
      const targetScale = hovered ? 1.15 : 1
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
    }
  })
  
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    console.log('Dashboard model clicked!')
    onClick()
  }, [onClick])
  
  if (error) {
    return <ErrorFallback icon=" dashboard " label="Health Overview" onClick={handleClick} />
  }
  
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group 
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        visible={visible}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary onError={() => setError(true)} fallback={<ErrorFallback icon=" dashboard " label="Health Overview" onClick={handleClick} />}>
            <GLBModel path={MODEL_PATHS.dashboard} scale={5.5} />
          </ModelErrorBoundary>
        </Suspense>
        
        {hovered && visible && (
          <mesh scale={1.2}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.1} />
          </mesh>
        )}
        
        {visible && (
          <Html position={[0, 4.5, 0]} center distanceFactor={12}>
            <div 
              className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-xl border border-amber-500/50 shadow-lg">
                <span className="text-amber-400 font-bold text-xl">Health Overview</span>
                <p className="text-gray-400 text-sm">Click to view</p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Camera that smoothly follows scroll with easing
const CameraController = ({ currentSection }) => {
  const { camera } = useThree()
  const targetY = useRef(0)
  const currentY = useRef(0)
  
  useEffect(() => {
    // Each section moves camera down by 12 units
    targetY.current = -currentSection * 12
  }, [currentSection])
  
  useFrame((state, delta) => {
    // Smooth camera movement with custom easing
    const distance = targetY.current - camera.position.y
    const speed = Math.min(Math.abs(distance) * 0.1, 0.15) // Adaptive speed
    const direction = distance > 0 ? 1 : -1
    
    if (Math.abs(distance) > 0.01) {
      camera.position.y += direction * speed
    } else {
      camera.position.y = targetY.current
    }
    
    // Subtle camera breathing effect
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    camera.position.z = 16 + breathe
  })
  
  return null
}

// DNA Helix Background - Very far back, doesn't interfere with UI
const DNABackground = () => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015
    }
  })
  
  const strands = useMemo(() => {
    const items = []
    for (let i = 0; i < 80; i++) {
      const y = (i - 40) * 0.6
      const angle = i * 0.25
      const x1 = Math.cos(angle) * 1.2
      const z1 = Math.sin(angle) * 1.2
      
      items.push(
        <group key={i}>
          <mesh position={[x1, y, z1]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} transparent opacity={0.4} />
          </mesh>
          <mesh position={[-x1, y, -z1]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.4} transparent opacity={0.4} />
          </mesh>
        </group>
      )
    }
    return items
  }, [])
  
  return (
    <group ref={groupRef} position={[-50, -24, -60]} scale={4}>
      {strands}
    </group>
  )
}

// Floating Pills Background
const FloatingPills = () => {
  const pills = useMemo(() => [
    { pos: [-15, 5, -12], color: '#ef4444', scale: 1 },
    { pos: [15, -8, -15], color: '#22c55e', scale: 0.8 },
    { pos: [-12, -20, -10], color: '#f97316', scale: 0.9 },
    { pos: [12, -32, -18], color: '#06b6d4', scale: 0.7 },
    { pos: [-18, -44, -12], color: '#ec4899', scale: 0.85 },
  ], [])
  
  return (
    <>
      {pills.map((pill, i) => (
        <Float key={i} speed={0.8 + i * 0.15} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={pill.pos} scale={pill.scale}>
            <capsuleGeometry args={[0.25, 0.8, 4, 12]} />
            <meshStandardMaterial color={pill.color} emissive={pill.color} emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// Pulsing Heart Background
const PulsingHeart = () => {
  const heartRef = useRef()
  const materialRef = useRef()
  
  useFrame((state) => {
    if (heartRef.current) {
      const beat = Math.sin(state.clock.elapsedTime * 2.5) * 0.12 + 1
      heartRef.current.scale.setScalar(beat)
    }
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.4 + 0.6
      materialRef.current.emissiveIntensity = pulse
    }
  })
  
  return (
    <Float speed={0.4} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={heartRef} position={[18, -24, -22]}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial 
            ref={materialRef}
            color="#ef4444" 
            emissive="#dc2626" 
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[3, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

// 3D Background Scene - ALL MODELS IN ONE CANVAS
const Scene3D = ({ currentSection, onModelClick }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, 0, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[5, -15, 8]} intensity={0.6} color="#a855f7" />
      
      <Stars radius={200} depth={100} count={5000} factor={4} saturation={0} fade speed={0.3} />
      
      {/* Camera follows scroll */}
      <CameraController currentSection={currentSection} />
      
      {/* Background Elements */}
      <DNABackground />
      <FloatingPills />
      <PulsingHeart />
      
      {/* All 5 Models - positioned vertically, only one visible at a time */}
      {/* Section 1: Doctor - Dr. AI */}
      <group position={[3.5, 0, 2]}>
        <DoctorModel onClick={() => onModelClick('chat')} visible={currentSection === 0} />
      </group>
      
      {/* Section 2: Stethoscope - Report Analyzer */}
      <group position={[-3.5, -12, 2]}>
        <StethoscopeModel onClick={() => onModelClick('analyzer')} visible={currentSection === 1} />
      </group>
      
      {/* Section 3: Syringe - Treatment Tracker */}
      <group position={[3.5, -24, 2]}>
        <SyringeModel onClick={() => onModelClick('tracker')} visible={currentSection === 2} />
      </group>
      
      {/* Section 4: Pill Bottle - Medication Manager */}
      <group position={[-3.5, -36, 2]}>
        <PillBottleModel onClick={() => onModelClick('medication')} visible={currentSection === 3} />
      </group>
      
      {/* Section 5: Dashboard - Health Overview */}
      <group position={[3.5, -48, 2]}>
        <DashboardModelComp onClick={() => onModelClick('dashboard')} visible={currentSection === 4} />
      </group>
    </>
  )
}

// Scroll Section Indicator
const ScrollIndicator = ({ activeSection, totalSections, onNavigate }) => {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
      {[...Array(totalSections)].map((_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === index 
              ? 'bg-cyan-400 scale-125 shadow-[0_0_15px_rgba(34,211,238,0.6)]' 
              : 'bg-gray-500/50 hover:bg-gray-400 hover:scale-110'
          }`}
        />
      ))}
    </div>
  )
}

// Main Dashboard Component
const MainDashboard = () => {
  const [activeSection, setActiveSection] = useState(0)
  
  const { 
    isChatOpen, setIsChatOpen,
    isAnalyzerOpen, setIsAnalyzerOpen,
    isTrackerOpen, setIsTrackerOpen,
    isMedicationOpen, setIsMedicationOpen,
    isDashboardOpen, setIsDashboardOpen,
    isEmergencyOpen, setIsEmergencyOpen
  } = useAppStore()
  
  const totalSections = 5
  const containerRef = useRef(null)
  
  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop
      const windowHeight = window.innerHeight
      const section = Math.round(scrollTop / windowHeight)
      setActiveSection(Math.min(Math.max(section, 0), totalSections - 1))
    }
    
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Navigate to specific section
  const navigateToSection = (index) => {
    const container = containerRef.current
    if (container) {
      const windowHeight = window.innerHeight
      container.scrollTo({
        top: index * windowHeight,
        behavior: 'smooth'
      })
    }
  }
  
  // Handle model click - OPEN MODALS
  const handleModelClick = useCallback((modal) => {
    console.log('Opening modal:', modal)
    
    if (modal === 'chat') setIsChatOpen(true)
    if (modal === 'analyzer') setIsAnalyzerOpen(true)
    if (modal === 'tracker') setIsTrackerOpen(true)
    if (modal === 'medication') setIsMedicationOpen(true)
    if (modal === 'dashboard') setIsDashboardOpen(true)
  }, [setIsChatOpen, setIsAnalyzerOpen, setIsTrackerOpen, setIsMedicationOpen, setIsDashboardOpen])
  
  // SVG Icons for each tool
  const icons = {
    doctor: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="32" cy="16" r="10" className="stroke-cyan-400" />
        <path d="M16 60V44c0-8 7-16 16-16s16 8 16 16v16" className="stroke-cyan-400" />
        <rect x="28" y="30" width="8" height="16" rx="2" className="fill-white stroke-cyan-400" />
        <rect x="24" y="36" width="16" height="4" className="fill-red-500 stroke-red-500" />
      </svg>
    ),
    stethoscope: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8v20c0 8 6 14 16 14s16-6 16-14V8" className="stroke-green-400" />
        <circle cx="16" cy="8" r="4" className="fill-green-400 stroke-green-400" />
        <circle cx="48" cy="8" r="4" className="fill-green-400 stroke-green-400" />
        <circle cx="32" cy="48" r="10" className="stroke-green-400" />
        <circle cx="32" cy="48" r="4" className="fill-green-400" />
      </svg>
    ),
    syringe: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="20" y="16" width="24" height="36" rx="2" className="stroke-orange-400" />
        <path d="M24 16V8h16v8" className="stroke-orange-400" />
        <line x1="24" y1="24" x2="44" y2="24" className="stroke-orange-400" />
        <line x1="24" y1="32" x2="44" y2="32" className="stroke-orange-400" />
        <line x1="24" y1="40" x2="44" y2="40" className="stroke-orange-400" />
        <path d="M32 52v8M28 60h8" className="stroke-orange-400" />
        <circle cx="32" cy="4" r="3" className="fill-orange-400" />
      </svg>
    ),
    pills: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="24" cy="24" rx="12" ry="16" className="stroke-purple-400" />
        <path d="M24 8v32" className="stroke-purple-400" />
        <ellipse cx="44" cy="44" rx="12" ry="8" className="fill-purple-400/30 stroke-purple-400" />
        <path d="M44 36v16" className="stroke-purple-400" />
      </svg>
    ),
    dashboard: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="12" width="48" height="40" rx="4" className="stroke-amber-400" />
        <circle cx="32" cy="32" r="12" className="stroke-amber-400" />
        <path d="M32 20v12l8 8" className="stroke-amber-400" />
        <rect x="12" y="56" width="8" height="4" className="fill-amber-400" />
        <rect x="28" y="56" width="8" height="4" className="fill-amber-400" />
        <rect x="44" y="56" width="8" height="4" className="fill-amber-400" />
      </svg>
    ),
    ambulance: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="24" width="56" height="28" rx="4" className="stroke-red-400" />
        <rect x="40" y="16" width="20" height="12" className="stroke-red-400" />
        <circle cx="16" cy="56" r="6" className="stroke-red-400" />
        <circle cx="48" cy="56" r="6" className="stroke-red-400" />
        <rect x="20" y="32" width="4" height="12" className="fill-white stroke-white" />
        <rect x="16" y="36" width="12" height="4" className="fill-white stroke-white" />
      </svg>
    )
  }
  
  // Section content data
  const sections = [
    {
      title: 'Dr. AI',
      subtitle: 'Your AI-Powered Medical Assistant',
      description: 'Describe your symptoms and get instant AI-powered guidance. Available 24/7 with smart analysis powered by DeepSeek AI.',
      tags: ['24/7 Available', 'Smart Analysis', 'Symptom Checker'],
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      align: 'left',
      icon: 'doctor',
      modal: 'chat'
    },
    {
      title: 'Report Analyzer',
      subtitle: 'Instant Medical Report Analysis',
      description: 'Upload your medical reports (PDF, JPG, PNG) and get AI-powered insights in seconds. Understand complex medical terms in simple language.',
      tags: ['PDF Support', 'Instant Results', 'AI Analysis'],
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      align: 'right',
      icon: 'stethoscope',
      modal: 'analyzer'
    },
    {
      title: 'Treatment Tracker',
      subtitle: 'Never Miss a Dose',
      description: 'Track vaccinations, medications, and appointments with smart reminders and scheduling. Stay on top of your health journey.',
      tags: ['Smart Reminders', 'Schedule Management', 'Family Sharing'],
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      align: 'left',
      icon: 'syringe',
      modal: 'tracker'
    },
    {
      title: 'Medication Manager',
      subtitle: 'Smart Prescription Tracking',
      description: 'Manage your medications, track refills, and get alerts for dangerous drug interactions. AI-powered safety checks.',
      tags: ['Drug Interactions', 'Refill Alerts', 'Adherence Tracking'],
      gradient: 'from-purple-400 via-violet-500 to-indigo-600',
      align: 'right',
      icon: 'pills',
      modal: 'medication'
    },
    {
      title: 'Health Overview',
      subtitle: 'Your Health Command Center',
      description: 'Complete health dashboard with AI-powered insights, predictions, and personalized recommendations for better health.',
      tags: ['AI Insights', 'Health Score', 'Predictive Analysis'],
      gradient: 'from-amber-400 via-yellow-500 to-orange-600',
      align: 'left',
      icon: 'dashboard',
      modal: 'dashboard'
    }
  ]
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000, style: { background: '#1f2937', color: '#f3f4f6' } }} />
      
      {/* Fixed 3D Canvas - ON TOP for 3D model clicks, forwards wheel events */}
      <div 
        className="fixed inset-0 z-10"
        onWheel={(e) => {
          if (containerRef.current) {
            containerRef.current.scrollBy({ top: e.deltaY, behavior: 'auto' })
          }
        }}
      >
        <Canvas 
          camera={{ position: [0, 0, 16], fov: 45 }} 
          dpr={[1, 2]} 
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene3D currentSection={activeSection} onModelClick={handleModelClick} />
          </Suspense>
        </Canvas>
      </div>
      
      <TopBar />
      
      {/* Scroll Container - BEHIND Canvas, pointer-events none, just for scroll tracking */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-y-scroll snap-y snap-mandatory z-0"
        style={{ 
          scrollBehavior: 'smooth', 
          WebkitOverflowScrolling: 'touch',
          pointerEvents: 'none',
          scrollSnapType: 'y mandatory',
          overscrollBehavior: 'contain'
        }}
      >
        {sections.map((section, index) => (
          <section 
            key={index}
            className="relative w-full h-screen snap-start snap-always flex items-center pointer-events-none"
            style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          >
            {/* Empty section for scroll snap */}
          </section>
        ))}
      </div>
      
      {/* Fixed Info Cards - ABOVE Canvas, positioned based on active section */}
      {sections.map((section, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: section.align === 'left' ? -100 : 100, scale: 0.9 }}
          animate={{ 
            opacity: activeSection === index ? 1 : 0, 
            x: 0,
            scale: activeSection === index ? 1 : 0.9,
            pointerEvents: activeSection === index ? 'auto' : 'none'
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.4 }
          }}
          className={`fixed ${section.align === 'left' ? 'left-28 md:left-40 lg:left-48' : 'right-28 md:right-40 lg:right-48'} top-1/2 transform -translate-y-1/2 z-30 w-72 md:w-80`}
          style={{ pointerEvents: activeSection === index ? 'auto' : 'none' }}
        >
          <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl relative overflow-hidden">
            {/* Gradient glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-5`} />
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12">
                  {icons[section.icon]}
                </div>
                <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`}>
                  {section.title}
                </div>
              </div>
              <div className="text-gray-400 text-base md:text-lg mb-3">{section.subtitle}</div>
              <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed">{section.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {section.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className={`px-3 py-1.5 bg-gradient-to-r ${section.gradient} bg-opacity-20 rounded-full text-xs md:text-sm text-white border border-white/10`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleModelClick(section.modal)}
                className={`w-full py-3 md:py-4 bg-gradient-to-r ${section.gradient} rounded-xl text-white font-bold text-base md:text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
              >
                Open {section.title}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
      
      <ScrollIndicator 
        activeSection={activeSection} 
        totalSections={totalSections}
        onNavigate={navigateToSection}
      />
      
      {/* Left Sidebar Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-r-3xl p-3 border-r border-gray-700/50 shadow-2xl">
          <div className="flex flex-col gap-3">
            {[
              { iconKey: 'doctor', section: 0, label: 'Dr. AI', modal: 'chat' },
              { iconKey: 'stethoscope', section: 1, label: 'Analyzer', modal: 'analyzer' },
              { iconKey: 'syringe', section: 2, label: 'Tracker', modal: 'tracker' },
              { iconKey: 'pills', section: 3, label: 'Meds', modal: 'medication' },
              { iconKey: 'dashboard', section: 4, label: 'Overview', modal: 'dashboard' },
            ].map((item) => (
              <motion.button
                key={item.section}
                onClick={() => handleModelClick(item.modal)}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeSection === item.section 
                    ? 'bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="w-7 h-7">
                  {icons[item.iconKey]}
                </div>
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gray-800/95 backdrop-blur-xl rounded-lg text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-gray-700/50">
                  {item.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Emergency SOS Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={() => setIsEmergencyOpen(true)}
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-red-500 rounded-full blur-lg opacity-60 animate-pulse" />
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-500 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
          >
            <div className="w-7 h-7">
              {icons.ambulance}
            </div>
            <span className="text-white font-bold text-lg">SOS</span>
          </motion.div>
        </div>
      </motion.button>
      
      {/* Modals */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
        {isAnalyzerOpen && (
          <AnalyzerModal isOpen={isAnalyzerOpen} onClose={() => setIsAnalyzerOpen(false)} />
        )}
        {isTrackerOpen && (
          <TrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
        )}
        {isMedicationOpen && (
          <MedicationModal isOpen={isMedicationOpen} onClose={() => setIsMedicationOpen(false)} />
        )}
        {isDashboardOpen && (
          <DashboardOverviewModal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
        )}
        {isEmergencyOpen && (
          <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainDashboard
