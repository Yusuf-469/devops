/**
 * HEALIX Upstage Solar Pro AI Service
 * Direct HTTP integration with OpenRouter API
 * Primary: Upstage Solar Pro (upstage/solar-pro-3:free)
 * Fallback: Hardcoded responses (only if AI fails)
 */

// API Configuration - Use environment variable or fallback to placeholder
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ""
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

// Primary Model: Upstage Solar Pro
const PRIMARY_MODEL = 'upstage/solar-pro-3:free'

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
      throw new Error(`API Error: ${response.status} - ${error}`)
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
              const content = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content
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
const CHAT_SYSTEM_PROMPT = `You are Dr. AI, a board-certified physician with 15+ years of clinical experience. 

RESPONSE STYLE:
- Keep responses concise and actionable (under 150 words)
- Use professional medical terminology while remaining accessible
- Be direct and confident in your assessments

STRUCTURE:
1. Brief acknowledgment
2. Likely diagnosis with confidence level
3. Key red flags to watch for
4. Clear next steps (1-3 items max)

Always include the disclaimer at the end: "This is not a medical diagnosis. Please consult a qualified healthcare professional."`

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
const MEDICAL_SYSTEM_PROMPT = `You are Dr. AI, a board-certified physician with 15+ years of clinical experience.

RESPONSE STYLE:
- Keep responses concise and actionable (under 150 words)
- Use professional medical terminology while remaining accessible
- Be direct and confident in your assessments

STRUCTURE:
1. Brief acknowledgment
2. Likely diagnosis with confidence level
3. Key red flags to watch for
4. Clear next steps (1-3 items max)

Always include the disclaimer at the end: "This is not a medical diagnosis. Please consult a qualified healthcare professional."`

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
  const systemPrompt = `You are a medical report analyzer. 
    Extract key values, identify abnormalities, compare to normal ranges, and explain in plain language.
    Format your response as:
    1) Summary
    2) Key Findings (normal/abnormal)
    3) Recommendations
    Be clear and easy to understand for a non-medical person.`

  return chatWithAI(
    [{ role: "user", content: `Analyze this medical report: ${reportText}` }],
    systemPrompt,
    onStream,
    PRIMARY_MODEL
  )
}

// Drug interaction check
export const checkDrugInteractions = async (currentMeds, newMed, onStream) => {
  const systemPrompt = `You are a medication safety expert. 
    Check for drug interactions. List: severity (critical/moderate/minor), mechanism, recommendation.
    Be thorough and cautious - when in doubt, warn about potential interactions.`

  return chatWithAI(
    [{ role: "user", content: `Check interactions between: ${currentMeds.join(', ')} and new medication: ${newMed}` }],
    systemPrompt,
    onStream,
    PRIMARY_MODEL
  )
}

// Health insights
export const getHealthInsights = async (userData, onStream) => {
  const systemPrompt = `You are a health predictor AI. 
    Based on user health data, predict potential risks and suggest preventive measures. 
    Be encouraging, not alarmist. Focus on actionable advice.`

  return chatWithAI(
    [{ role: "user", content: `Based on: Age: ${userData.age}, History: ${userData.conditions}, Recent: ${userData.recentReports}, Medications: ${userData.medications}` }],
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
