import { DEEPSEEK_CONFIG, ALT_AI_CONFIG, getActiveAIConfig } from '../store/index.js'

// Generic AI Chat completion (works with both DeepSeek and alternative)
export const chatWithAI = async (messages, systemPrompt) => {
  const config = getActiveAIConfig()
  
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}

// Parse streaming response
export const parseStreamedResponse = async (response) => {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let result = ''

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
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            result += content
          }
        } catch (e) {
          // Ignore parse errors for incomplete chunks
        }
      }
    }
  }

  return result
}

// Main chat function for Dr. AI
export const getChatResponse = async (userMessage, conversationHistory = []) => {
  const systemPrompt = `You are Dr. AI, a helpful medical assistant. 
    Provide symptom analysis, ask clarifying questions, suggest possible conditions with confidence levels, 
    and recommend when to see a human doctor. 
    Always include a disclaimer that you are not a substitute for professional medical advice.
    Be thorough but caring in your responses.`

  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  return chatWithAI(messages, systemPrompt)
}

// DeepSeek-specific symptom analysis
export const analyzeSymptoms = async (symptoms, conversationHistory = []) => {
  const systemPrompt = `You are Dr. AI, a helpful medical assistant. 
    Provide symptom analysis, ask clarifying questions, suggest possible conditions with confidence levels, 
    and recommend when to see a human doctor. 
    Always include a disclaimer that you are not a substitute for professional medical advice.`

  const messages = [
    ...conversationHistory,
    { role: 'user', content: `I'm experiencing: ${symptoms}. Can you help me understand what this might be?` }
  ]

  return chatWithAI(messages, systemPrompt)
}

// Report analysis
export const analyzeReport = async (reportText) => {
  const systemPrompt = `You are a medical report analyzer. 
    Extract key values, identify abnormalities, compare to normal ranges, and explain in plain language.
    Format your response as:
    1) Summary
    2) Key Findings (normal/abnormal)
    3) Recommendations
    Be clear and easy to understand for a non-medical person.`

  const messages = [
    { role: 'user', content: `Analyze this medical report: ${reportText}` }
  ]

  return chatWithAI(messages, systemPrompt)
}

// Drug interaction check
export const checkDrugInteractions = async (currentMeds, newMed) => {
  const systemPrompt = `You are a medication safety expert. 
    Check for drug interactions. List: severity (critical/moderate/minor), mechanism, recommendation.
    Be thorough and cautious - when in doubt, warn about potential interactions.`

  const messages = [
    { role: 'user', content: `Check interactions between: ${currentMeds.join(', ')} and new medication: ${newMed}` }
  ]

  return chatWithAI(messages, systemPrompt)
}

// Health insights
export const getHealthInsights = async (userData) => {
  const systemPrompt = `You are a health predictor AI. 
    Based on user health data, predict potential risks and suggest preventive measures. 
    Be encouraging, not alarmist. Focus on actionable advice.`

  const messages = [
    { role: 'user', content: `Based on: Age: ${userData.age}, History: ${userData.conditions}, Recent: ${userData.recentReports}, Medications: ${userData.medications}` }
  ]

  return chatWithAI(messages, systemPrompt)
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
  parseStreamedResponse,
  getChatResponse,
  analyzeSymptoms,
  analyzeReport,
  checkDrugInteractions,
  getHealthInsights,
  checkForEmergency,
  analyzeResponseTone
}
