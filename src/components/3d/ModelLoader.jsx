import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Html, Float } from '@react-three/drei'
import { useAppStore, MODEL_PATHS } from '../../store/index.js'

// Convert Windows path to file:// URL
const pathToUrl = (windowsPath) => {
  return windowsPath.replace(/\\/g, '/').replace('C:/', 'file:///')
}

// Error boundary for 3D models
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

// Fallback 3D placeholder (simple geometry)
const Fallback3D = ({ icon, label, color = '#00d4ff' }) => (
  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.8}
        wireframe
      />
    </mesh>
    <Html position={[0, -2, 0]} center>
      <div className="text-center">
        <div className="text-6xl mb-2">{icon}</div>
        <div className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-lg">
          {label}
        </div>
        <div className="text-gray-400 text-xs mt-1">Click to Open</div>
      </div>
    </Html>
  </Float>
)

// Model loading wrapper with suspense
const ModelWrapper = ({ modelPath, fallback, onError, children }) => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const fileUrl = pathToUrl(modelPath)
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true)
        // Test if file exists by trying to load it
        const response = await fetch(fileUrl, { method: 'HEAD' })
        if (!response.ok) {
          throw new Error('Model file not found')
        }
        setError(null)
      } catch (err) {
        console.warn(`Model load error for ${modelPath}:`, err)
        setError(err)
        if (onError) onError(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadModel()
  }, [modelPath, fileUrl, onError])
  
  if (error || !fileUrl) {
    return fallback || <Fallback3D icon="📦" label="Model" />
  }
  
  return (
    <Suspense fallback={
      <Html center>
        <div className="loading-spinner" />
      </Html>
    }>
      <ErrorBoundary fallback={
        fallback || <Fallback3D icon="⚠️" label="Load Error" />
      }>
        {children}
      </ErrorBoundary>
    </Suspense>
  )
}

// Main GLTF model loader with error handling
export const ModelLoader = ({ 
  modelPath, 
  fallback,
  onError,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animation = null
}) => {
  const [error, setError] = useState(null)
  const { setModelError } = useAppStore()
  
  const fileUrl = pathToUrl(modelPath)
  
  useEffect(() => {
    if (!fileUrl || fileUrl === 'file:///') {
      const err = new Error('Invalid model path')
      setError(err)
      setModelError(modelPath, err)
    }
  }, [fileUrl, modelPath, setModelError])
  
  if (error || !fileUrl || !fileUrl.includes('file:///')) {
    return fallback || <Fallback3D icon="🏥" label="Healthcare" />
  }
  
  return (
    <ModelWrapper 
      modelPath={modelPath} 
      fallback={fallback}
      onError={(err) => {
        setError(err)
        setModelError(modelPath, err)
      }}
    >
      <GLTFModel 
        url={fileUrl}
        scale={scale}
        position={position}
        rotation={rotation}
        animation={animation}
      />
    </ModelWrapper>
  )
}

// GLTF model component
const GLTFModel = ({ url, scale, position, rotation, animation }) => {
  const { scene } = useGLTF(url, true)
  
  // Clone scene to avoid mutations
  const clonedScene = React.useMemo(() => scene.clone(), [scene])
  
  return (
    <primitive 
      object={clonedScene} 
      scale={scale}
      position={position}
      rotation={rotation}
    />
  )
}

// Preload models
export const preloadModels = (paths) => {
  paths.forEach(path => {
    const url = pathToUrl(path)
    if (url) {
      useGLTF.preload(url)
    }
  })
}

export { Fallback3D, ErrorBoundary, MODEL_PATHS }
