import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, FileText, Loader, AlertCircle } from 'lucide-react'
import { useAppStore } from '../../store/index.js'
import { analyzeSymptoms as qwenAnalyze } from '../../services/qwen.js'
import { quickSymptomCheck } from '../../services/fallbackAI.js'

const ChatModal = ({ onClose }) => {
  const { conversationHistory, addMessage, addNotification, checkEmergency, setEmergencyDetected } = useAppStore()
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm Dr. AI, your medical assistant. I'm here to help you understand your symptoms and guide you toward appropriate care.\n\nPlease describe what symptoms you're experiencing, including:\n• When they started\n• Severity (mild/moderate/severe)\n• Any factors that worsen or improve them\n\nI'll provide an assessment with possible causes and recommended next steps.\n\n⚠️ Remember: This is not a substitute for professional medical advice.",
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])
  
  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }
    
    const emergency = checkEmergency(input.trim())
    if (emergency) {
      setMessages(prev => [...prev, userMessage, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🚨 ${emergency.message}`,
        isEmergency: true,
        timestamp: Date.now()
      }])
      setInput('')
      return
    }
    
    setMessages(prev => [...prev, userMessage])
    addMessage(userMessage)
    setInput('')
    setIsTyping(true)
    setStreamingContent('')
    setIsOnline(true)
    
    try {
      const response = await qwenAnalyze(
        input.trim(),
        conversationHistory,
        (content) => {
          setStreamingContent(content)
        }
      )
      
      if (response.success) {
        setIsOnline(true)
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev.filter(m => m.id !== 'streaming'), aiMessage])
        addMessage(aiMessage)
        addNotification({ type: 'success', message: 'Qwen AI diagnosis complete' })
      } else {
        throw new Error('Primary failed')
      }
    } catch (error) {
      setIsOnline(false)
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🚫 **API Error**: Unable to connect to Qwen AI service.\n\n**Error Details**: ${error.message}\n\n**Possible Solutions**:\n• Check your internet connection\n• Verify API key is valid\n• Ensure OpenRouter account has credits\n\n💡 **Please try again** or contact support.`,
        timestamp: Date.now(),
        isError: true
      }
      setMessages(prev => [...prev.filter(m => m.id !== 'streaming'), aiMessage])
      addMessage(aiMessage)
      addNotification({ type: 'error', message: 'Qwen AI service unavailable' })
    } finally {
      setIsTyping(false)
      setStreamingContent('')
    }
  }
  
  const generateHardcodedResponse = (symptoms) => {
    const lowerSym = symptoms.toLowerCase()
    let assessment = ''
    
    if (lowerSym.includes('fever')) {
      assessment = `**Assessment:**\nYou have reported fever symptoms.\n\n**Possible Causes:**\n• Common Cold/Flu (High confidence)\n• Viral Infection (Medium confidence)\n• Bacterial Infection (Low confidence)\n\n**Recommended Actions:**\n1. Monitor temperature\n2. Stay hydrated\n3. Rest adequately\n4. Take paracetamol if needed\n\n**Seek immediate care if:**\n• Fever exceeds 103°F\n• Chest pain or difficulty breathing\n• Confusion or severe headache`
    } else if (lowerSym.includes('cough')) {
      assessment = `**Assessment:**\nYou have reported cough symptoms.\n\n**Possible Causes:**\n• Common Cold (High confidence)\n• Bronchitis (Medium confidence)\n• Allergies (Medium confidence)\n\n**Recommended Actions:**\n1. Stay hydrated\n2. Use honey for soothing\n3. Avoid smoke/irritants\n4. Rest adequately`
    } else if (lowerSym.includes('headache')) {
      assessment = `**Assessment:**\nYou have reported headache symptoms.\n\n**Possible Causes:**\n• Tension Headache (High confidence)\n• Dehydration (Medium confidence)\n• Migraine (Medium confidence)\n\n**Recommended Actions:**\n1. Rest in quiet, dark room\n2. Stay hydrated\n3. Take OTC pain relievers\n4. Apply cold/heat compress`
    } else if (lowerSym.includes('stomach') || lowerSym.includes('abdominal')) {
      assessment = `**Assessment:**\nYou have reported stomach/abdominal pain.\n\n**Possible Causes:**\n• Indigestion (Medium confidence)\n• Gastritis (Medium confidence)\n• Food Poisoning (Low confidence)\n\n**Recommended Actions:**\n1. Eat bland foods\n2. Stay hydrated\n3. Avoid spicy/fatty foods\n4. Rest`
    } else if (lowerSym.includes('cold') || lowerSym.includes('runny') || lowerSym.includes('congestion')) {
      assessment = `**Assessment:**\nYou have reported cold-like symptoms.\n\n**Possible Causes:**\n• Common Cold (High confidence)\n• Allergic Rhinitis (Medium confidence)\n\n**Recommended Actions:**\n1. Rest and stay hydrated\n2. Use saline nasal drops\n3. Warm fluids help\n4. Humidifier may help`
    } else {
      assessment = `**Assessment:**\nThank you for describing your symptoms.\n\n**Recommended Actions:**\n1. Monitor your symptoms\n2. Note when they started\n3. Note severity (mild/moderate/severe)\n4. Note any triggering factors\n\n**General Advice:**\n• Stay hydrated\n• Get adequate rest\n• Maintain healthy diet\n• Consult doctor if symptoms worsen`
    }
    
    return `${assessment}\n\n⚠️ **Disclaimer:** This is automated medical information, not a diagnosis. Please consult a healthcare professional for proper evaluation.`
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  const exportConversation = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `healix-conversation-${Date.now()}.txt`
    a.click()
  }
  
  const quickSymptoms = [
    { label: 'Fever', icon: 'thermometer', query: 'I have fever' },
    { label: 'Cough', icon: 'lung', query: 'I have cough' },
    { label: 'Cold', icon: 'snowflake', query: 'I have cold symptoms' },
    { label: 'Headache', icon: 'brain', query: 'I have headache' },
    { label: 'Stomach', icon: 'stomach', query: 'I have stomach pain' },
    { label: 'Body Pain', icon: 'body', query: 'I have body aches and pain' },
    { label: 'Fatigue', icon: 'fatigue', query: 'I feel tired and fatigued' },
  ]
  
  const symptomIcons = {
    thermometer: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    lung: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    snowflake: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18l-4 4m4-4l4 4m-4 14l-4-4m4 4l4-4M3 12h18M3 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4" />
      </svg>
    ),
    brain: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    stomach: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    body: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    fatigue: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )
  }
  
  const handleQuickSymptom = (query) => {
    setInput(query)
    document.querySelector('.input-field')?.focus()
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
        className="w-full max-w-4xl h-[80vh] glass-morphism-dark rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-healix-blue to-healix-purple flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dr. AI Consultation</h2>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                AI-Powered Symptom Analysis
                {isOnline ? (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    Fallback
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportConversation}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Export conversation"
            >
              <FileText size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-healix-blue text-white'
                    : message.isEmergency
                    ? 'bg-red-500/80 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-healix-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-semibold text-healix-cyan">Dr. AI</span>
                    {message.isOffline && (
                      <span className="text-xs text-yellow-400">(Fallback)</span>
                    )}
                    {message.isFallback && (
                      <span className="text-xs text-yellow-400">(Fallback)</span>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-white/10 text-white">
                <p className="whitespace-pre-wrap">{streamingContent}</p>
                <span className="text-xs text-healix-cyan animate-pulse">Typing...</span>
              </div>
            </div>
          )}
          
          {isTyping && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-healix-cyan rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-healix-cyan rounded-full animate-bounce animation-delay-300" />
                <span className="w-2 h-2 bg-healix-cyan rounded-full animate-bounce animation-delay-500" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-white/10">
          {!messages.length || messages.length <= 1 ? (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">Quick select symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {quickSymptoms.map((symptom) => (
                  <motion.button
                    key={symptom.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickSymptom(symptom.query)}
                    disabled={isTyping}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {symptomIcons[symptom.icon]}
                    <span>{symptom.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                Or describe your symptoms:
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                  AI Active
                </span>
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-1 input-field resize-none h-12"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ This is an AI assistant. For emergencies, call 102 immediately.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChatModal
