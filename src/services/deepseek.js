/**
 * HEALIX DeepSeek AI Service
 * OpenRouter API with deepseek/deepseek-r1-0528:free model
 */

// API Configuration - Use provided OpenRouter key
const OPENROUTER_API_KEY = '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'
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// Primary Model: DeepSeek R1 via OpenRouter
const PRIMARY_MODEL = 'deepseek/deepseek-r1-0528:free'

// Generic AI Chat completion with streaming support
export const chatWithAI = async (messages, systemPrompt, onStream, model = PRIMARY_MODEL) => {
  // Check if API key is configured
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured. Using fallback responses.')
    return { success: false, error: 'API key not configured', isFallback: true }
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API Error: ${response.status} - ${error}`)
    }

    // Handle streaming response
    if (onStream && response.body) {
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
              // Handle both regular content and reasoning content
              const content = parsed.choices?.[0]?.delta?.content || ''
              const reasoning = parsed.choices?.[0]?.delta?.reasoning_content || ''
              
              // Combine reasoning and content
              if (reasoning) {
                result += reasoning
                onStream(result)
              }
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

    // Non-streaming fallback
    const data = await response.json()
    return {
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      isFallback: false,
      model: model
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error.message)
    return { success: false, error: error.message, isFallback: true }
  }
}

// Dr. AI Chat function - Professional medical assistant
const CHAT_SYSTEM_PROMPT = `You are Dr. AI, a caring medical assistant. Be brief, precise, and use bullet points.

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
