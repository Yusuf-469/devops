/**
 * HEALIX AI Service
 * Secure backend API calls to Vercel serverless function
 */

// Backend API endpoint
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://healix.vercel.app'

// Primary Model: Nvidia Nemotron 3 Super 120B via OpenRouter
const PRIMARY_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free'

// Generic AI Chat completion with streaming support
export const chatWithAI = async (messages, systemPrompt, onStream, model = PRIMARY_MODEL) => {
  try {
    // Prepare messages with system prompt
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ]

    console.log(`🚀 Calling backend AI API: ${model}, messages: ${allMessages.length}`)

    // Call our secure backend endpoint
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: allMessages,
        model: model,
        stream: !!onStream // Convert to boolean
      })
    })

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Backend API error:', errorData.error)
      throw new Error(errorData.error || 'AI service error')
    }

    // Handle streaming response
    if (onStream && response.body) {
      console.log('🌊 Processing streaming response from backend')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              // Only show final response content - filter out reasoning
              const content = parsed.choices?.[0]?.delta?.content || ''

              if (content) {
                result += content
                onStream(result)
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
      return { success: true, content: result, isFallback: false, model: model }
    }

    // Handle non-streaming response
    const data = await response.json()
    console.log('✅ Backend API response successful')

    return {
      success: true,
      content: data.content || '',
      model: data.model || model,
      usage: data.usage
    }

  } catch (error) {
    console.error('💥 Frontend AI service error:', error.message)
    throw error // Let the UI handle the error
  }
}

// Dr. AI Chat function - Professional medical assistant
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
  const messages = conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }))

  return chatWithAI(
    messages,
    CHAT_SYSTEM_PROMPT,
    onStream,
    PRIMARY_MODEL
  )
}

// Symptom analysis - Professional medical AI
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
  const messages = conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }))

  return chatWithAI(
    messages,
    MEDICAL_SYSTEM_PROMPT,
    onStream,
    PRIMARY_MODEL
  )
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

  return chatWithAI(
    [{ role: "user", content: `Analyze this: ${reportText}` }],
    systemPrompt,
    onStream,
    PRIMARY_MODEL
  )
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

  return chatWithAI(
    [{ role: "user", content: `Check: ${currentMeds.join(', ')} + ${newMed}` }],
    systemPrompt,
    onStream,
    PRIMARY_MODEL
  )
}

// Health insights
export const getHealthInsights = async (userData, onStream) => {
  const systemPrompt = `You are Dr. AI. Give health insights briefly.

Format:
💪 STRENGTH: [1 line]

⚡ TIP: [1 line]

🎯 FOCUS: [1 line]

_Disclaimer: Consult a doctor._`

  return chatWithAI(
    [{ role: "user", content: `Data: Age ${userData.age}, History ${userData.conditions}, Recent ${userData.recentReports}` }],
    systemPrompt,
    onStream,
    PRIMARY_MODEL
  )
}

// Emergency detection
export const checkForEmergency = (text) => {
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'stroke', "can't breathe", 'unconscious',
    'bleeding heavily', 'suicide', 'overdose', 'anaphylaxis', 'not breathing',
    'severe allergic reaction', 'seizure', 'poisoning', 'electric shock'
  ]

  const lower = text.toLowerCase()
  const isEmergency = emergencyKeywords.some(keyword => lower.includes(keyword))

  if (isEmergency) {
    return {
      level: 'critical',
      message: 'Emergency detected. Please seek immediate care.',
      action: 'CALL_102',
      countdown: 10
    }
  }
  return null
}

// Helper to extract AI response tone for avatar reactions
export const analyzeResponseTone = (response) => {
  const lower = response.toLowerCase()
  
  if (lower.includes('serious') || lower.includes('critical') || lower.includes('immediate') || lower.includes('emergency')) {
    return 'concerned'
  }
  if (lower.includes('likely') || lower.includes('probably') || lower.includes('common')) {
    return 'reassuring'
  }
  if (lower.includes('think') || lower.includes('consider') || lower.includes('might')) {
    return 'analyzing'
  }
  return 'neutral'
}

export default {
  chatWithAI,
  getChatResponse,
  analyzeSymptoms,
  analyzeReport,
  checkDrugInteractions,
  getHealthInsights,
  checkForEmergency,
  analyzeResponseTone
}
