import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, TrendingUp, Activity, Clock, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/index.js'
import { getHealthInsights } from '../../services/deepseek.js'

const DashboardOverviewModal = ({ onClose, onNavigate }) => {
  const { user, addNotification } = useAppStore()
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Mock health data
  const healthScore = 75
  const recentActivity = [
    { id: 1, action: 'Consultation with Dr. AI', time: '2 hours ago', icon: '👨‍⚕️' },
    { id: 2, action: 'Blood test analyzed', time: '5 hours ago', icon: '🩸' },
    { id: 3, action: 'Medication taken', time: '8 hours ago', icon: '💊' }
  ]
  
  const upcomingReminders = [
    { id: 1, title: 'Metformin', time: 'In 2 hours', type: 'medication' },
    { id: 2, title: 'Dr. Appointment', time: 'Tomorrow, 10:00 AM', type: 'appointment' },
    { id: 3, title: 'Flu Shot', time: 'In 5 days', type: 'vaccination' }
  ]
  
  useEffect(() => {
    const loadInsights = async () => {
      try {
        const userData = {
          age: user.age || 30,
          conditions: user.conditions || [],
          recentReports: [],
          medications: user.medications || []
        }
        
        const result = await getHealthInsights(userData, (content) => {
          setInsights({ streaming: content })
        })
        
        if (result.success) {
          setInsights({ content: result.content })
        }
      } catch (error) {
        setInsights({ content: 'Unable to load insights at this time.' })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInsights()
  }, [user])
  
  const getScoreColor = (score) => {
    if (score >= 90) return { color: '#00ffff', label: 'Excellent' }
    if (score >= 75) return { color: '#10b981', label: 'Good' }
    if (score >= 50) return { color: '#f59e0b', label: 'Fair' }
    return { color: '#ef4444', label: 'Needs Attention' }
  }
  
  const scoreConfig = getScoreColor(healthScore)
  
  const handleNavigate = (sectionIndex) => {
    if (onNavigate) onNavigate(sectionIndex)
    onClose()
  }
  
  const miniTools = [
    { id: 'doctor', icon: '👨‍⚕️', label: 'Dr. AI', section: 0, color: 'from-blue-500 to-cyan-500' },
    { id: 'analyzer', icon: '🩺', label: 'Analyzer', section: 1, color: 'from-red-500 to-pink-500' },
    { id: 'tracker', icon: '💉', label: 'Tracker', section: 2, color: 'from-green-500 to-emerald-500' },
    { id: 'medication', icon: '💊', label: 'Medications', section: 3, color: 'from-yellow-500 to-orange-500' }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-5xl max-h-[90vh] glass-morphism-dark rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-healix-blue to-healix-purple flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Health Dashboard</h2>
              <p className="text-gray-400">Your complete health overview</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Health Score Card */}
            <div className="md:col-span-2 p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Health Score</h3>
                  <p className="text-gray-400 text-sm">Based on your recent activity</p>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: `${scoreConfig.color}20`, color: scoreConfig.color }}
                >
                  {scoreConfig.label}
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={scoreConfig.color}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(healthScore / 100) * 440} 440`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-white">{healthScore}</div>
                    <div className="text-gray-400 text-sm">out of 100</div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <Activity className="text-healix-cyan mb-2" />
                      <div className="text-2xl font-bold text-white">72</div>
                      <div className="text-gray-400 text-sm">Avg. Heart Rate</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <TrendingUp className="text-green-400 mb-2" />
                      <div className="text-2xl font-bold text-white">7,842</div>
                      <div className="text-gray-400 text-sm">Steps Today</div>
                    </div>
                  </div>
                  
                  {/* Mini Tools Quick Access */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Quick Access</h4>
                    <div className="flex gap-2">
                      {miniTools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleNavigate(tool.section)}
                          className={`flex-1 p-3 rounded-xl bg-gradient-to-r ${tool.color} opacity-80 hover:opacity-100 transition-opacity flex flex-col items-center gap-1`}
                        >
                          <span className="text-xl">{tool.icon}</span>
                          <span className="text-xs text-white">{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              {/* Recent Activity */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{activity.action}</div>
                        <div className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock size={10} /> {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Reminders */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">Upcoming</h3>
                <div className="space-y-2">
                  {upcomingReminders.map(reminder => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          reminder.type === 'medication' ? 'bg-green-400' :
                          reminder.type === 'appointment' ? 'bg-orange-400' : 'bg-blue-400'
                        }`} />
                        <span className="text-white text-sm">{reminder.title}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{reminder.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Insights */}
          <div className="mt-6 p-6 bg-gradient-to-r from-healix-purple/20 to-healix-blue/20 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span>✨</span> AI Health Insights
            </h3>
            
            {isLoading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-6 h-6 border-2 border-healix-cyan border-t-transparent rounded-full animate-spin" />
                <span>Analyzing your health data...</span>
              </div>
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap">
                {insights?.content || insights?.streaming || 'Based on your activity, you\'re maintaining good health habits! Keep up with your medications and regular checkups. Your heart health metrics are within normal range. Remember to stay hydrated and get 7-8 hours of sleep daily.'}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DashboardOverviewModal
