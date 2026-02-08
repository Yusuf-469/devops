import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Plus, Bell, Clock, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/index.js'

const TrackerModal = ({ onClose }) => {
  const { addNotification } = useAppStore()
  const [viewMode, setViewMode] = useState('month') // 'month' or 'week'
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Sample treatment data
  const [treatments, setTreatments] = useState([
    { id: 1, name: 'COVID-19 Vaccine', type: 'vaccination', date: '2024-01-15', status: 'completed' },
    { id: 2, name: 'Blood Pressure Check', type: 'appointment', date: '2024-01-20', status: 'upcoming' },
    { id: 3, name: 'Metformin', type: 'medication', date: '2024-01-10', status: 'taken' },
    { id: 4, name: 'Flu Shot', type: 'vaccination', date: '2024-01-25', status: 'upcoming' }
  ])
  
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    type: 'vaccination',
    date: '',
    notes: ''
  })
  
  const getTypeColor = (type) => {
    const colors = {
      vaccination: 'bg-blue-500',
      medication: 'bg-green-500',
      appointment: 'bg-orange-500'
    }
    return colors[type] || 'bg-gray-500'
  }
  
  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-400',
      taken: 'text-green-400',
      upcoming: 'text-healix-cyan',
      past: 'text-gray-400'
    }
    return colors[status] || 'text-gray-400'
  }
  
  const handleAddTreatment = () => {
    if (!newTreatment.name || !newTreatment.date) {
      addNotification({ type: 'error', message: 'Please fill in required fields' })
      return
    }
    
    const treatment = {
      id: Date.now(),
      ...newTreatment,
      status: 'upcoming'
    }
    
    setTreatments(prev => [...prev, treatment])
    setNewTreatment({ name: '', type: 'vaccination', date: '', notes: '' })
    setShowAddModal(false)
    addNotification({ type: 'success', message: 'Treatment added successfully!' })
  }
  
  const handleMarkComplete = (id) => {
    setTreatments(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'completed' } : t
    ))
    addNotification({ type: 'success', message: 'Treatment marked as complete!' })
  }
  
  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }
  
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const today = new Date().getDate()
  
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }
  
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
        className="w-full max-w-4xl max-h-[90vh] glass-morphism-dark rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-xl">💉</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Treatment Tracker</h2>
              <p className="text-sm text-gray-400">Vaccinations & Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> Add Treatment
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-white/10 rounded-lg">
                  <ChevronLeft />
                </button>
                <h3 className="text-lg font-semibold text-white">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-white/10 rounded-lg">
                  <ChevronRight />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs text-gray-400 py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                      day === today
                        ? 'bg-healix-blue text-white font-bold'
                        : day
                        ? 'hover:bg-white/10 cursor-pointer'
                        : ''
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Treatments List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-3">Upcoming & Recent</h3>
              
              {treatments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No treatments scheduled</p>
                </div>
              ) : (
                treatments.map(treatment => (
                  <div
                    key={treatment.id}
                    className="p-3 bg-white/5 rounded-xl flex items-center gap-3"
                  >
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(treatment.type)}`} />
                    <div className="flex-1">
                      <div className="text-white font-medium">{treatment.name}</div>
                      <div className="text-gray-400 text-sm flex items-center gap-2">
                        <Clock size={12} />
                        {new Date(treatment.date).toLocaleDateString()}
                        <span className={getStatusColor(treatment.status)}>
                          ({treatment.status})
                        </span>
                      </div>
                    </div>
                    {treatment.status === 'upcoming' && (
                      <button
                        onClick={() => handleMarkComplete(treatment.id)}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-400">{treatments.filter(t => t.status === 'completed').length}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-3xl font-bold text-healix-cyan">{treatments.filter(t => t.status === 'upcoming').length}</div>
              <div className="text-gray-400 text-sm">Upcoming</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-3xl font-bold text-red-400">{treatments.filter(t => t.status === 'overdue').length}</div>
              <div className="text-gray-400 text-sm">Overdue</div>
            </div>
          </div>
        </div>
        
        {/* Add Treatment Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md p-6 glass-morphism-dark rounded-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Add Treatment</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Type</label>
                    <select
                      value={newTreatment.type}
                      onChange={e => setNewTreatment(prev => ({ ...prev, type: e.target.value }))}
                      className="input-field"
                    >
                      <option value="vaccination">Vaccination</option>
                      <option value="medication">Medication</option>
                      <option value="appointment">Checkup</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Name</label>
                    <input
                      type="text"
                      value={newTreatment.name}
                      onChange={e => setNewTreatment(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Flu Shot, Metformin"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Date</label>
                    <input
                      type="date"
                      value={newTreatment.date}
                      onChange={e => setNewTreatment(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Notes (optional)</label>
                    <textarea
                      value={newTreatment.notes}
                      onChange={e => setNewTreatment(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                      className="input-field resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTreatment}
                      className="flex-1 btn-primary"
                    >
                      Add Treatment
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default TrackerModal
