import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'

// Lazy load the heavy 3D dashboard to avoid loading Three.js on landing page
const MainDashboard = lazy(() => import('./pages/MainDashboard.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LandingPage />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<MainDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
