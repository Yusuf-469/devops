import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { useAppStore } from '../store/index.js'
import { TopBar } from '../components/ui/index.js'
import { ChatModal, AnalyzerModal, TrackerModal, MedicationModal, EmergencyModal } from '../components/modals/index.js'
import DashboardOverviewModal from '../components/modals/DashboardOverviewModal.jsx'
import { DoctorModel, StethoscopeModel, SyringeModel, PillBottleModel, DashboardModel } from '../components/3d/index.js'

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
        <boxGeometry args={[0.3, ]} />
        0.15, 0.3<meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 12]}>
       .3, - <boxGeometry args={[0.3, 0.15, 0.3]} />
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
  const pulses = [
    { position: [12, 5, -15], color: '#ef4444', size: 0.12 },
    { position: [12, -15, -12], color: '#22c55e', size: 0.1 },
    { position: [12, -30, -15], color: '#f97316', size: 0.14 },
  ]
  
  return (
    <>
      {pulses.map((pulse, index) => (
        <Float key={index} speed={0.4} rotationIntensity={0.1} floatIntensity={0.3}>
          <group>
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

// Biological Heart - Pulsing 3D Heart
const BiologicalHeart = () => {
  const groupRef = useRef()
  const materialRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      const beat = Math.sin(state.clock.elapsedTime * 3) * 0.08 + 1
      groupRef.current.scale.set(beat, beat, beat)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7
      materialRef.current.emissiveIntensity = pulse
    }
  })
  
  return (
    <Float speed={0.4} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={groupRef} position={[15, -15, -20]}>
        <group scale={2.5}>
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
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial 
            color="#ef4444"
            transparent
            opacity={0.15}
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
      const targetScale = hasConstructed ? scale : 0
      const currentScale = groupRef.current.scale.x
      
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08)
      groupRef.current.scale.setScalar(newScale)
      
      if (autoRotate) {
        groupRef.current.rotation.y += 0.001
      }
      
      groupRef.current.position.y = positionY + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.03
    }
  })
  
  const getTextStyle = () => {
    switch(label) {
      case 'Dr. AI':
        return { gradient: 'from-cyan-400 via-blue-500 to-purple-600', icon: '🧠', text: 'Dr. AI' }
      case 'Analyzer':
        return { gradient: 'from-green-400 via-emerald-500 to-teal-600', icon: '📊', text: 'Report Analyzer' }
      case 'Tracker':
        return { gradient: 'from-orange-400 via-red-500 to-pink-600', icon: '💉', text: 'Treatment Tracker' }
      case 'Medications':
        return { gradient: 'from-purple-400 via-violet-500 to-indigo-600', icon: '💊', text: 'Medication Manager' }
      case 'Dashboard':
        return { gradient: 'from-amber-400 via-yellow-500 to-orange-600', icon: '📈', text: 'Health Overview' }
      default:
        return { gradient: 'from-cyan-400 to-purple-600', icon: '⚡', text: label }
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
      
      <Html position={[0, positionY + 0.5, 0]} center distanceFactor={10}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: hovered ? 1 : 0, 
            scale: hovered ? 1 : 0.5,
            y: hovered ? 0 : 20
          }}
          transition={{ duration: 0.4, scale: { type: 'spring', stiffness: 300, damping: 20 }, opacity: { duration: 0.2 } }}
          className="relative"
        >
          <div className={`absolute -inset-2 bg-gradient-to-r ${textStyle.gradient} rounded-xl blur-lg opacity-60`} />
          <div className="relative bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-xl"
                animate={{ scale: hovered ? [1, 1.2, 1] : 1, rotate: hovered ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                {textStyle.icon}
              </motion.span>
              <span className="text-white font-medium">{textStyle.text}</span>
            </div>
          </div>
        </motion.div>
      </Html>
    </>
  )
}

// Scroll section indicator dots
const ScrollSectionIndicator = ({ activeSection, totalSections }) => {
  const handleClick = (index) => {
    const sections = document.querySelectorAll('.section')
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
      {[...Array(totalSections)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === index 
              ? 'bg-[#20B2AA] scale-125 shadow-[0_0_15px_rgba(32,178,170,0.6)]' 
              : 'bg-gray-500/50 hover:bg-gray-400 hover:scale-110'
          }`}
          title={`Section ${index + 1}`}
        />
      ))}
    </div>
  )
}

// Main Dashboard Component (formerly App.jsx content)
const MainDashboard = () => {
  const [activeSection, setActiveSection] = useState(0)
  const sectionsRef = useRef([])
  
  const { 
    isChatOpen, setIsChatOpen,
    isAnalyzerOpen, setIsAnalyzerOpen,
    isTrackerOpen, setIsTrackerOpen,
    isMedicationOpen, setIsMedicationOpen,
    isDashboardOpen, setIsDashboardOpen,
    isEmergencyOpen, setIsEmergencyOpen,
    currentSection, setCurrentSection
  } = useAppStore()
  
  const totalSections = 5
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const currentSectionIndex = Math.round(scrollPosition / windowHeight)
      setActiveSection(Math.min(currentSectionIndex, totalSections - 1))
      setCurrentSection(currentSectionIndex)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setActiveSection, setCurrentSection])
  
  // Preload all GLB models
  useEffect(() => {
    const preloadModels = async () => {
      const modelPaths = [
        '/models/medical doctor 3d model.glb',
        '/models/stethoscope 3d model.glb',
        '/models/cartoon syringe 3d model.glb',
        '/models/pill bottle 3d model.glb',
        '/models/dashboard.glb'
      ]
      
      for (const path of modelPaths) {
        try {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = path
          document.head.appendChild(link)
        } catch (e) {
          console.log('Preload hint added for:', path)
        }
      }
    }
    
    preloadModels()
  }, [])
  
  return (
    <div className="relative w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000, style: { background: '#1f2937', color: '#f3f4f6' } }} />
      
      <TopBar />
      
      <ScrollSectionIndicator activeSection={activeSection} totalSections={totalSections} />
      
      {/* DR. AI SECTION */}
      <section className="section relative snap-start">
        <BackgroundScene />
        <Suspense fallback={<LoadingFallback />}>
          <ModelWrapper
            model={DoctorModel}
            index={0}
            rotationY={0.3}
            scale={0.85}
            positionY={0}
            autoRotate={true}
            label="Dr. AI"
            isVisible={currentSection === 0}
            onClick={() => {
              if (!useAppStore.getState().user) {
                toast.error('Please login to access Dr. AI', { icon: '🔒' })
                return
              }
              setIsChatOpen(true)
              useAppStore.setState({ avatarReaction: 'welcoming' })
            }}
          />
        </Suspense>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: activeSection === 0 ? 1 : 0, x: activeSection === 0 ? 0 : -50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-8 md:left-16 bottom-32 z-20 max-w-lg"
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Dr. AI
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Your AI-powered medical assistant. Describe your symptoms and get instant guidance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">24/7 Available</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">Smart Analysis</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* REPORT ANALYZER SECTION */}
      <section className="section relative snap-start flex-row-reverse">
        <Suspense fallback={<LoadingFallback />}>
          <ModelWrapper
            model={StethoscopeModel}
            index={1}
            rotationY={-0.3}
            scale={0.85}
            positionY={0}
            autoRotate={true}
            label="Analyzer"
            isVisible={currentSection === 1}
            onClick={() => {
              if (!useAppStore.getState().user) {
                toast.error('Please login to upload reports', { icon: '🔒' })
                return
              }
              setIsAnalyzerOpen(true)
              useAppStore.setState({ avatarReaction: 'scanning' })
            }}
          />
        </Suspense>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: activeSection === 1 ? 1 : 0, x: activeSection === 1 ? 0 : 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute right-8 md:right-16 bottom-32 z-20 max-w-lg"
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">
              Report Analyzer
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Upload medical reports for instant AI-powered analysis and insights.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">PDF, JPG, PNG</span>
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm border border-teal-500/30">Instant Results</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* TREATMENT TRACKER SECTION */}
      <section className="section relative snap-start">
        <Suspense fallback={<LoadingFallback />}>
          <ModelWrapper
            model={SyringeModel}
            index={2}
            rotationY={0.4}
            scale={0.85}
            positionY={0}
            autoRotate={true}
            label="Tracker"
            isVisible={currentSection === 2}
            onClick={() => {
              if (!useAppStore.getState().user) {
                toast.error('Please login to track treatments', { icon: '🔒' })
                return
              }
              setIsTrackerOpen(true)
              useAppStore.setState({ avatarReaction: 'nodding' })
            }}
          />
        </Suspense>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: activeSection === 2 ? 1 : 0, x: activeSection === 2 ? 0 : -50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-8 md:left-16 bottom-32 z-20 max-w-lg"
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
              Treatment Tracker
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Track vaccinations, medications, and treatment schedules effortlessly.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">Smart Reminders</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">Schedule Management</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* MEDICATION MANAGER SECTION */}
      <section className="section relative snap-start flex-row-reverse">
        <Suspense fallback={<LoadingFallback />}>
          <ModelWrapper
            model={PillBottleModel}
            index={3}
            rotationY={-0.4}
            scale={0.85}
            positionY={0}
            autoRotate={true}
            label="Medications"
            isVisible={currentSection === 3}
            onClick={() => {
              if (!useAppStore.getState().user) {
                toast.error('Please login to manage medications', { icon: '🔒' })
                return
              }
              setIsMedicationOpen(true)
              useAppStore.setState({ avatarReaction: 'reassuring' })
            }}
          />
        </Suspense>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: activeSection === 3 ? 1 : 0, x: activeSection === 3 ? 0 : 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute right-8 md:right-16 bottom-32 z-20 max-w-lg"
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-600 bg-clip-text text-transparent mb-4">
              Medication Manager
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Manage prescriptions, track refills, and avoid dangerous drug interactions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">Drug Interactions</span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">Refill Tracking</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* HEALTH OVERVIEW SECTION */}
      <section className="section relative snap-start">
        <Suspense fallback={<LoadingFallback />}>
          <ModelWrapper
            model={DashboardModel}
            index={4}
            rotationY={0.5}
            scale={0.85}
            positionY={0}
            autoRotate={true}
            label="Dashboard"
            isVisible={currentSection === 4}
            onClick={() => {
              if (!useAppStore.getState().user) {
                toast.error('Please login to view dashboard', { icon: '🔒' })
                return
              }
              setIsDashboardOpen(true)
            }}
          />
        </Suspense>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: activeSection === 4 ? 1 : 0, x: activeSection === 4 ? 0 : -50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-8 md:left-16 bottom-32 z-20 max-w-lg"
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent mb-4">
              Health Overview
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Your complete health command center with AI-powered insights and predictions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">AI Insights</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">Health Score</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* 3D Sidebar with Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-r-3xl p-4 border-r border-gray-700/50 shadow-2xl">
          <div className="flex flex-col gap-4">
            {[
              { icon: '🧠', label: 'Dr. AI', section: 0, color: 'from-cyan-400 to-blue-500' },
              { icon: '📊', label: 'Analyzer', section: 1, color: 'from-green-400 to-teal-500' },
              { icon: '💉', label: 'Tracker', section: 2, color: 'from-orange-400 to-red-500' },
              { icon: '💊', label: 'Meds', section: 3, color: 'from-purple-400 to-indigo-500' },
              { icon: '📈', label: 'Overview', section: 4, color: 'from-amber-400 to-orange-500' },
            ].map((item) => (
              <motion.button
                key={item.section}
                onClick={() => {
                  const sections = document.querySelectorAll('.section')
                  if (sections[item.section]) {
                    sections[item.section].scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeSection === item.section 
                    ? 'bg-gray-800/80 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <span className="text-2xl block">{item.icon}</span>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gray-800/95 backdrop-blur-xl rounded-lg text-white text-sm font-medium whitespace-nowrap shadow-xl border border-gray-700/50 z-50"
                >
                  {item.label}
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Emergency SOS Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
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
            <span className="text-2xl">🚑</span>
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
