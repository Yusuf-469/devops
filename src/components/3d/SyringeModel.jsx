import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { MODEL_PATHS } from '../../store/index.js'

// Syringe 3D Model - Clickable only, no text
export const SyringeModel = ({ onClick }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const gltf = useGLTF(MODEL_PATHS.syringe)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.15
      
      // Subtle tilt
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[-0.2, 0.2]}>
      <group 
        ref={groupRef}
        scale={hovered ? 1.1 : 1}
        rotation={[0, 0, Math.PI / 6]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Syringe model */}
        <primitive object={gltf.scene} scale={4} position={[0, -1, 0]} />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATHS.syringe)
export default SyringeModel
