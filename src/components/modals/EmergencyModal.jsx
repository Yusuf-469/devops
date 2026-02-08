import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, X, PhoneCall } from 'lucide-react'

const EmergencyModal = ({ emergency, onClose, onCancel }) => {
  const [countdown, setCountdown] = useState(emergency?.countdown || 10)
  const [isCalling, setIsCalling] = useState(false)
  
  useEffect(() => {
    if (!emergency) return
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleEmergencyCall()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [emergency])
  
  const handleEmergencyCall = () => {
    setIsCalling(true)
    // In production, integrate with actual emergency services
    setTimeout(() => {
      window.open('tel:102', '_self')
    }, 1000)
  }
  
  const handleCancel = () => {
    onCancel()
  }
  
  if (!emergency) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      >
        {/* Animated ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full border-4 border-red-500 emergency-flash" />
          <div className="absolute w-80 h-80 rounded-full border-4 border-red-400 emergency-flash animation-delay-300" />
          <div className="absolute w-64 h-64 rounded-full border-4 border-red-300 emergency-flash animation-delay-500" />
        </div>
        
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative z-10 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-red-500 mb-2">EMERGENCY DETECTED</h2>
            <p className="text-gray-300 mb-6">{emergency.message}</p>
            
            <div className="p-4 bg-red-500/10 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-2 text-xl font-bold text-red-400 mb-2">
                <PhoneCall className="animate-pulse" />
                Calling Ambulance (102)
              </div>
              <div className="text-gray-400">
                Auto-dial in <span className="text-red-400 font-bold text-2xl">{countdown}</span> seconds
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleEmergencyCall}
                className="py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={20} /> Call Now
              </button>
              
              <button
                onClick={handleCancel}
                className="py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} /> Cancel
              </button>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <MapPin size={16} />
                <span className="text-sm">Location will be shared with emergency services</span>
              </div>
              <p className="text-xs text-gray-500">
                In life-threatening situations, also call your local emergency number immediately.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EmergencyModal
