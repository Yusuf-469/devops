import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Bell, Clock, AlertTriangle, Check, Search, Camera, Pill } from 'lucide-react'
import { useAppStore } from '../../store/index.js'
import { checkDrugInteractions } from '../../services/deepseek.js'

const MedicationModal = ({ onClose }) => {
  const { addNotification, user } = useAppStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showInteractionCheck, setShowInteractionCheck] = useState(false)
  const [newMedName, setNewMedName] = useState('')
  const [interactionResult, setInteractionResult] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  
  // Sample medications
  const [medications, setMedications] = useState([
    { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: '2 hours', adherence: 95 },
    { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextDose: '8 hours', adherence: 88 },
    { id: 3, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', nextDose: '1 hour', adherence: 100 }
  ])
  
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    duration: ''
  })
  
  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage) {
      addNotification({ type: 'error', message: 'Please fill in required fields' })
      return
    }
    
    const medication = {
      id: Date.now(),
      ...newMed,
      nextDose: '24 hours',
      adherence: 100
    }
    
    setMedications(prev => [...prev, medication])
    setNewMed({ name: '', dosage: '500mg', frequency: 'Once daily', duration: '' })
    setShowAddModal(false)
    addNotification({ type: 'success', message: 'Medication added!' })
  }
  
  const handleTakeDose = (id) => {
    addNotification({ type: 'success', message: 'Dose marked as taken!' })
    // In production, update the medication status
  }
  
  const handleSkipDose = (id) => {
    addNotification({ type: 'info', message: 'Dose skipped' })
  }
  
  const checkInteractions = async () => {
    if (!newMedName) {
      addNotification({ type: 'error', message: 'Enter a medication name to check' })
      return
    }
    
    setIsChecking(true)
    
    try {
      const currentMeds = medications.map(m => m.name)
      const result = await checkDrugInteractions(currentMeds, newMedName, (content) => {
        setInteractionResult(prev => ({ ...prev, streaming: content }))
      })
      
      if (result.success) {
        setInteractionResult({ content: result.content, checked: true })
      }
    } catch (error) {
      setInteractionResult({ 
        content: 'Unable to check interactions. Please consult your pharmacist.',
        error: true 
      })
    } finally {
      setIsChecking(false)
    }
  }
  
  const getAdherenceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400'
    if (percentage >= 75) return 'text-yellow-400'
    return 'text-red-400'
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <span className="text-xl">💊</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Medication Manager</h2>
              <p className="text-sm text-gray-400">Track & Manage Your Medications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInteractionCheck(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <AlertTriangle size={18} /> Check Interactions
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> Add Medication
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Medications List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-3">Current Medications</h3>
              
              {medications.map(med => (
                <div
                  key={med.id}
                  className="p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                      <Pill className="text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{med.name}</span>
                        <span className="text-gray-400 text-sm">{med.dosage}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{med.frequency}</div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-healix-cyan">
                          <Clock size={14} />
                          <span className="text-sm">Next dose: {med.nextDose}</span>
                        </div>
                        <div className={`font-semibold ${getAdherenceColor(med.adherence)}`}>
                          {med.adherence}%
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleTakeDose(med.id)}
                          className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1"
                        >
                          <Check size={16} /> Take
                        </button>
                        <button
                          onClick={() => handleSkipDose(med.id)}
                          className="flex-1 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Adherence Stats */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Adherence Overview</h3>
              
              <div className="p-6 bg-white/5 rounded-xl text-center mb-4">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(medications.reduce((a, m) => a + m.adherence, 0) / medications.length / 100) * 352} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(medications.reduce((a, m) => a + m.adherence, 0) / medications.length)}%
                      </div>
                      <div className="text-gray-400 text-sm">Overall</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Refill Reminders */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">🔔 Refill Reminders</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-lg">
                    <span className="text-yellow-400">Metformin</span>
                    <span className="text-gray-400 text-sm">7 days left</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                    <span className="text-green-400">Lisinopril</span>
                    <span className="text-gray-400 text-sm">15 days left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Medication Modal */}
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
                <h3 className="text-xl font-bold text-white mb-4">Add Medication</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Medication Name</label>
                    <input
                      type="text"
                      value={newMed.name}
                      onChange={e => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Metformin"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Dosage</label>
                      <input
                        type="text"
                        value={newMed.dosage}
                        onChange={e => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                        placeholder="e.g., 500mg"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Frequency</label>
                      <select
                        value={newMed.frequency}
                        onChange={e => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                        className="input-field"
                      >
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>As needed</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMedication}
                      className="flex-1 btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Interaction Check Modal */}
        <AnimatePresence>
          {showInteractionCheck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
              onClick={() => { setShowInteractionCheck(false); setInteractionResult(null); setNewMedName('') }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md p-6 glass-morphism-dark rounded-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Drug Interaction Checker</h3>
                
                {!interactionResult ? (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Check if a new medication interacts with your current medications.
                    </p>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">New Medication</label>
                      <input
                        type="text"
                        value={newMedName}
                        onChange={e => setNewMedName(e.target.value)}
                        placeholder="e.g., Ibuprofen"
                        className="input-field"
                      />
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Current medications:</div>
                      <div className="flex flex-wrap gap-1">
                        {medications.map(m => (
                          <span key={m.id} className="px-2 py-1 bg-white/10 rounded text-sm text-white">
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={checkInteractions}
                      disabled={isChecking || !newMedName}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      {isChecking ? 'Checking...' : 'Check Interactions'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${interactionResult.error ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={interactionResult.error ? 'text-red-400' : 'text-yellow-400'} />
                        <span className="font-semibold text-white">
                          {interactionResult.error ? 'Warning' : 'Interaction Check Results'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{interactionResult.content}</p>
                    </div>
                    
                    <button
                      onClick={() => { setInteractionResult(null); setNewMedName('') }}
                      className="btn-secondary w-full"
                    >
                      Check Another
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default MedicationModal
