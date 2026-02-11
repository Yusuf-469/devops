import { create } from 'zustand'

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

// Primary AI Configuration (OpenRouter - deepseek/deepseek-r1-0528:free)
export const PRIMARY_AI_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  model: 'deepseek/deepseek-r1-0528:free'
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

// Main application store
export const useAppStore = create((set, get) => ({
  // Modal states
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
      set({ emergencyDetected: emergency })
      return emergency
    }
    return null
  }
}))
