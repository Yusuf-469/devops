import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { MODEL_PATHS } from '../../store/index.js'

// Doctor 3D Model - Clickable only, no cursor tracking
export const DoctorModel = ({ onClick }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const gltf = useGLTF(MODEL_PATHS.doctor)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating only, no cursor tracking
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15
    }
  })
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.2, 0.2]}>
      <group 
        ref={groupRef}
        scale={hovered ? 1.03 : 1}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Doctor model */}
        <primitive object={gltf.scene} scale={3} position={[0, -2, 0]} />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATHS.doctor)
export default DoctorModel
