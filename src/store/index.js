import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Model paths configuration - Relative paths for Vite public folder
export const MODEL_PATHS = {
  doctor: '/models/medical doctor 3d model.glb',
  stethoscope: '/models/stethoscope 3d model.glb',
  syringe: '/models/cartoon syringe 3d model.glb',
  pills: '/models/pill bottle 3d model.glb',
  dashboard: '/models/dashboard.glb'
}

// Convert path to URL (for public folder paths, just return as-is)
export const pathToUrl = (path) => {
  return path.startsWith('/') ? path : `/${path}`
}

// Primary AI Configuration (OpenRouter - openrouter/free)
// The browser only talks to our own serverless endpoint. The OpenRouter key
// lives server-side in Vercel env (OPENROUTER_API_KEY) and is never bundled.
export const PRIMARY_AI_CONFIG = {
  baseUrl: '/api/chat',
  model: 'openrouter/free'
}

// Fallback AI Configuration (Offline rule-based system)
export const FALLBACK_AI_CONFIG = {
  baseUrl: '',
  apiKey: '',
  model: 'offline-fallback'
}

// Get current AI config (primary or fallback)
export const getActiveAIConfig = (isPrimaryFailed = false) => {
  return isPrimaryFailed ? FALLBACK_AI_CONFIG : PRIMARY_AI_CONFIG
}

// Emergency numbers from env or defaults
export const EMERGENCY_NUMBER = import.meta.env.VITE_EMERGENCY_NUMBER || '102'
export const HELP_NUMBER = import.meta.env.VITE_HELP_NUMBER || '7903810922'

// Emergency keywords for detection
export const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', "can't breathe", 'unconscious',
  'bleeding heavily', 'suicide', 'overdose', 'anaphylaxis', 'not breathing',
  'severe allergic reaction', 'seizure', 'poisoning', 'electric shock'
]

// Main application store (persisted to localStorage via Zustand persist)
export const useAppStore = create(persist((set, get) => ({
  // Individual Modal states - CRITICAL FOR INTERACTIVITY
  isChatOpen: false,
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  
  isAnalyzerOpen: false,
  setIsAnalyzerOpen: (open) => set({ isAnalyzerOpen: open }),
  
  isTrackerOpen: false,
  setIsTrackerOpen: (open) => set({ isTrackerOpen: open }),
  
  isMedicationOpen: false,
  setIsMedicationOpen: (open) => set({ isMedicationOpen: open }),
  
  isDashboardOpen: false,
  setIsDashboardOpen: (open) => set({ isDashboardOpen: open }),
  
  isEmergencyOpen: false,
  setIsEmergencyOpen: (open) => set({ isEmergencyOpen: open }),
  
  // Current section for scroll
  currentSection: 0,
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Legacy modal state
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  
  // Emergency state
  emergencyDetected: null,
  setEmergencyDetected: (emergency) => set({ emergencyDetected: emergency }),
  
  // Chat state
  conversationHistory: [],
  addMessage: (message) => set((state) => ({
    conversationHistory: [...state.conversationHistory, message]
  })),
  
  // Medication list (persisted)
  medications: [
    { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: '2 hours', adherence: 95 },
    { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextDose: '8 hours', adherence: 88 },
    { id: 3, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', nextDose: '1 hour', adherence: 100 }
  ],
  // Accepts a new array or an updater function, like React's setState
  setMedications: (update) => set((state) => ({
    medications: typeof update === 'function' ? update(state.medications) : update
  })),

  // Treatment tracker entries (persisted)
  treatments: [
    { id: 1, name: 'COVID-19 Vaccine', type: 'vaccination', date: '2024-01-15', status: 'completed' },
    { id: 2, name: 'Blood Pressure Check', type: 'appointment', date: '2024-01-20', status: 'upcoming' },
    { id: 3, name: 'Metformin', type: 'medication', date: '2024-01-10', status: 'taken' },
    { id: 4, name: 'Flu Shot', type: 'vaccination', date: '2024-01-25', status: 'upcoming' }
  ],
  setTreatments: (update) => set((state) => ({
    treatments: typeof update === 'function' ? update(state.treatments) : update
  })),

  // Analysis results
  latestAnalysis: null,
  setLatestAnalysis: (analysis) => set({ latestAnalysis: analysis }),
  
  // User profile
  user: {
    name: 'User',
    age: 30,
    conditions: [],
    medications: [],
    healthScore: 75
  },
  setUser: (user) => set({ user: { ...get().user, ...user } }),
  
  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }]
  })),
  
  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Model load errors for fallback UI
  modelErrors: {},
  setModelError: (modelName, error) => set((state) => ({
    modelErrors: { ...state.modelErrors, [modelName]: error }
  })),
  
  // Actions
  clearActiveModal: () => set({ activeModal: null }),
  
  // Close all modals
  closeAllModals: () => set({
    isChatOpen: false,
    isAnalyzerOpen: false,
    isTrackerOpen: false,
    isMedicationOpen: false,
    isDashboardOpen: false,
    isEmergencyOpen: false,
    activeModal: null
  }),
  
  // Check for emergency in text
  checkEmergency: (text) => {
    const lower = text.toLowerCase()
    const isEmergency = EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword))
    
    if (isEmergency) {
      const emergency = {
        level: 'critical',
        action: 'CALL_102',
        message: 'Emergency detected. Please seek immediate care.',
        countdown: 10
      }
      set({ emergencyDetected: emergency, isEmergencyOpen: true })
      return emergency
    }
    return null
  }
}), {
  name: 'healix-store',
  storage: createJSONStorage(() => localStorage),
  // Persist only user data. UI state (open modals, loading, errors) resets on reload.
  // Chat history is capped so localStorage doesn't grow without bound.
  partialize: (state) => ({
    medications: state.medications,
    treatments: state.treatments,
    conversationHistory: state.conversationHistory.slice(-100),
    latestAnalysis: state.latestAnalysis,
    user: state.user
  })
}))
