import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
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
        scale={hovered ? 1.15 : 1}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Dashboard model */}
        <primitive object={gltf.scene} scale={3.5} position={[0, -1, 0]} />
        
        {/* Glow effect on hover */}
        {hovered && (
          <>
            <pointLight position={[0, 2, 3]} intensity={3} color="#a855f7" distance={8} />
            <pointLight position={[0, 0, -2]} intensity={2} color="#06b6d4" distance={6} />
            <mesh position={[0, 0, -1]}>
              <torusGeometry args={[2.5, 0.03, 16, 100]} />
              <meshBasicMaterial color="#a855f7" transparent opacity={0.5} side={2} />
            </mesh>
          </>
        )}

        {/* Dashboard model */}
        <primitive object={gltf.scene} scale={3} position={[0, -1.5, 0]} />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATHS.dashboard)
export default DashboardModel
