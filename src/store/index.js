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

// Primary AI Configuration (OpenRouter - GPT-OSS)
export const PRIMARY_AI_CONFIG = {
  baseUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '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',
  model: 'openai/gpt-oss-120b:free'
}

// Fallback AI Configuration (DeepSeek)
export const FALLBACK_AI_CONFIG = {
  baseUrl: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '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',
  model: 'tngtech/deepseek-r1t2-chimera:free'
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
