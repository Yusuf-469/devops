import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF, Html } from '@react-three/drei'
import { MODEL_PATHS } from '../../store/index.js'

// Dashboard 3D Model - Clickable only, no text
export const DashboardModel = ({ onClick }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const gltf = useGLTF(MODEL_PATHS.dashboard)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Slow floating rotation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1 + 2) * 0.1
      groupRef.current.rotation.y += 0.002
    }
  })
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2} floatingRange={[-0.15, 0.15]}>
      <group 
        ref={groupRef}
        scale={hovered ? 1.1 : 1}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Dashboard model */}
        <primitive object={gltf.scene} scale={3} position={[0, -1, 0]} />
        
        {/* Chat bubble on hover */}
        {hovered && (
          <Html position={[2, 1.5, 0]} center distanceFactor={8}>
            <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl rounded-bl-none shadow-lg max-w-xs">
              <p className="text-sm font-semibold">Your Health Command Center</p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATHS.dashboard)
export default DashboardModel
