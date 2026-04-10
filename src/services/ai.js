/**
 * HEALIX AI Service
 * Direct OpenRouter API calls - simple and reliable
 */

// OpenRouter API configuration
// Priority: environment variable OR fallback to direct key (for quick fix)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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'
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// Primary Model
const PRIMARY_MODEL = 'openrouter/free'

// Direct AI Chat call to OpenRouter
export const chatWithAI = async (messages, systemPrompt, onStream, model = PRIMARY_MODEL) => {
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OpenRouter API key not configured')
    throw new Error('API key not configured. Please set VITE_OPENROUTER_API_KEY in environment.')
  }

  try {
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ]

    console.log(`🚀 Calling OpenRouter: ${model}`)

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://healix.vercel.app',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({
        model: model,
        messages: allMessages,
        stream: false,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ OpenRouter error:', response.status, errorText)
      throw new Error(`OpenRouter API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ OpenRouter response received')

    return {
      success: true,
      content: data.choices?.[0]?.message?.content || 'No response received',
      model: data.model || model
    }

  } catch (error) {
    console.error('💥 AI service error:', error.message)
    throw error
  }
}

// Dr. AI Chat function
const CHAT_SYSTEM_PROMPT = `You are Dr. AI, a caring medical assistant. Be brief and precise.

IMPORTANT: Never show your thinking process, reasoning, or internal analysis. Only output the final response directly.

RULES:
• Keep responses under 60 words
• Use bullet points (•) for assessment/info
• Ask follow-up questions in numbered list (1., 2., 3.)

Format:
• [Brief assessment in 1-2 lines]

1. [Follow-up question 1]
2. [Follow-up question 2]
3. [Follow-up question 3]

_Disclaimer: Consult a doctor._`

export const getChatResponse = async (userMessage, conversationHistory = [], onStream) => {
  const messages = conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
  return chatWithAI(messages, CHAT_SYSTEM_PROMPT, onStream, PRIMARY_MODEL)
}

// Symptom analysis
const MEDICAL_SYSTEM_PROMPT = `You are Dr. AI, a caring medical assistant. Be brief, precise, and use bullet points.

RULES:
• Keep responses under 60 words
• Use bullet points for all info
• Ask follow-up questions in numbered list

Format:
• [Assessment/Answer in 1-2 lines]

1. [Follow-up question 1]
2. [Follow-up question 2]
3. [Follow-up question 3]

_Disclaimer: Consult a doctor._`

export const analyzeSymptoms = async (symptoms, conversationHistory = [], onStream) => {
  const messages = conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
  return chatWithAI(messages, MEDICAL_SYSTEM_PROMPT, onStream, PRIMARY_MODEL)
}

// Report analysis
export const analyzeReport = async (reportText, onStream) => {
  const systemPrompt = `You are Dr. AI. Analyze medical reports briefly.

Format:
📋 SUMMARY: [1 line]
🔍 FINDINGS:
• [Finding 1]
• [Finding 2]
💡 RECOMMENDATION: [1 line]
_Disclaimer: Consult a doctor._`

  return chatWithAI([{ role: "user", content: `Analyze this: ${reportText}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Drug interaction check
export const checkDrugInteractions = async (currentMeds, newMed, onStream) => {
  const systemPrompt = `You are Dr. AI. Check drug interactions briefly.

Format:
⚠️ STATUS: [Safe/Caution/Warning]
🔍 DETAILS:
• [Interaction detail 1]
• [Interaction detail 2]
✅ RECOMMENDATION: [1 line]
_Disclaimer: Consult a doctor._`

  return chatWithAI([{ role: "user", content: `Check: ${currentMeds.join(', ')} + ${newMed}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Health insights
export const getHealthInsights = async (userData, onStream) => {
  const systemPrompt = `You are Dr. AI. Give health insights briefly.

Format:
💪 STRENGTH: [1 line]
⚡ TIP: [1 line]
🎯 FOCUS: [1 line]
_Disclaimer: Consult a doctor._`

  return chatWithAI([{ role: "user", content: `Data: Age ${userData.age}, History ${userData.conditions}, Recent ${userData.recentReports}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Emergency detection
export const checkForEmergency = (text) => {
  const emergencyKeywords = ['chest pain', 'heart attack', 'stroke', "can't breathe", 'unconscious', 'bleeding heavily', 'suicide', 'overdose', 'anaphylaxis', 'not breathing', 'severe allergic reaction', 'seizure', 'poisoning', 'electric shock']
  const lower = text.toLowerCase()
  const isEmergency = emergencyKeywords.some(keyword => lower.includes(keyword))

  if (isEmergency) {
    return { level: 'critical', message: 'Emergency detected. Please seek immediate care.', action: 'CALL_102', countdown: 10 }
  }
  return null
}

// Helper for response tone
export const analyzeResponseTone = (response) => {
  const lower = response.toLowerCase()
  if (lower.includes('serious') || lower.includes('critical') || lower.includes('immediate') || lower.includes('emergency')) return 'concerned'
  if (lower.includes('likely') || lower.includes('probably') || lower.includes('common')) return 'reassuring'
  if (lower.includes('think') || lower.includes('consider') || lower.includes('might')) return 'analyzing'
  return 'neutral'
}

export default { chatWithAI, getChatResponse, analyzeSymptoms, analyzeReport, checkDrugInteractions, getHealthInsights, checkForEmergency, analyzeResponseTone }