import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Preload all 3D models at app startup
import { useGLTF } from '@react-three/drei'

const MODEL_PATHS = [
  '/models/medical doctor 3d model.glb',
  '/models/stethoscope 3d model.glb',
  '/models/cartoon syringe 3d model.glb',
  '/models/pill bottle 3d model.glb',
  '/models/dashboard.glb'
]

// Preload all models
MODEL_PATHS.forEach(path => {
  try {
    useGLTF.preload(path)
  } catch (e) {
    // Ignore preload errors - models will load on demand
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
