import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { MODEL_PATHS } from '../../store/index.js'

// Stethoscope 3D Model - Clickable only, no text, no glow
export const StethoscopeModel = ({ onClick }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const gltf = useGLTF(MODEL_PATHS.stethoscope)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation when not hovered
      if (!hovered) {
        groupRef.current.rotation.y += 0.003
      }
    }
  })
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[-0.2, 0.2]}>
      <group 
        ref={groupRef}
        scale={hovered ? 1.1 : 1}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Stethoscope model */}
        <primitive object={gltf.scene} scale={4} position={[0, -1.5, 0]} />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATHS.stethoscope)
export default StethoscopeModel
