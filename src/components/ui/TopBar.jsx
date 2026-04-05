import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, User, Menu, X, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { FuturisticHealixCompact } from './FuturisticHealixText'

// Email constant
const CONTACT_EMAIL = 'healix@ai'

export const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const userMenuRef = useRef(null)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 h-16 glass-morphism-dark border-b border-white/5 z-40 flex items-center justify-between px-4 md:px-8 pl-24"
    >
      {/* Logo Section - Enlarged HEALIX Logo */}
      <motion.div 
        className="flex items-start gap-3"
        whileHover={{ scale: 1.02 }}
      >
        <img 
          src="/logo.png" 
          alt="HEALIX" 
          className="h-14 w-auto object-contain" 
        />
        <FuturisticHealixCompact className="hidden md:flex" />
      </motion.div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Email Contact */}
        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-400">{CONTACT_EMAIL}</span>
        </motion.a>
        
        {/* Notifications */}
        <motion.button
          className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} className="text-gray-400" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="w-2 h-2 bg-white rounded-full" />
          </motion.span>
        </motion.button>
        
        {/* User Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} className="text-cyan-400" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-purple-400/0 animate-[shimmer_2s_infinite]" />
          </motion.button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 glass-morphism-dark border border-white/10 rounded-xl p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm text-gray-300 truncate">
                    {currentUser?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.displayName || 'User'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleLogout()
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <LogOut size={16} className="text-red-400" />
                  <span className="text-sm text-gray-300">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 glass-morphism-dark border-b border-white/10 p-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a 
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">{CONTACT_EMAIL}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default TopBar
