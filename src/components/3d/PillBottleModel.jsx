import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { MODEL_PATHS } from '../../store/index.js'

// Pill Bottle 3D Model - Clickable only, no text
export const PillBottleModel = ({ onClick }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const gltf = useGLTF(MODEL_PATHS.pills)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation when not hovered
      if (!hovered) {
        groupRef.current.rotation.y += 0.005
      }
    }
  })
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.2, 0.2]}>
      <group 
        ref={groupRef}
        scale={hovered ? 1.1 : 1}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Pill bottle model */}
        <primitive object={gltf.scene} scale={4} position={[0, -1.5, 0]} />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATHS.pills)
export default PillBottleModel
