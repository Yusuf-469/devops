import { DEEPSEEK_CONFIG, ALT_AI_CONFIG, getActiveAIConfig } from '../store/index.js'

// Generic AI Chat completion with streaming support
export const chatWithAI = async (messages, systemPrompt, onStream) => {
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

    // Handle streaming response
    if (onStream && response.body) {
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
      return { success: true, content: result }
    }

    // Non-streaming fallback
    const data = await response.json()
    return {
      success: true,
      content: data.choices?.[0]?.message?.content || ''
    }
  } catch (error) {
    console.error('AI API Error:', error)
    return { success: false, error: error.message }
  }
}

// Dr. AI Chat function - Enhanced medical assistant
const CHAT_SYSTEM_PROMPT = `You are Dr. AI, a highly trained medical assistant with comprehensive healthcare knowledge.

Your characteristics:
- Communicate in a professional yet empathetic manner, like a caring physician
- Use clinical terminology while explaining in accessible language
- Always prioritize patient safety and well-being
- Ask relevant follow-up questions to understand symptoms better
- Provide differential diagnoses with probability assessments
- Suggest appropriate next steps (self-care, GP visit, specialist, or emergency)
- Include relevant health education when appropriate
- Never dismiss patient concerns or make definitive diagnoses

Response Format:
1. **Initial Assessment**: Acknowledge symptoms with empathy
2. **Possible Causes**: List 2-4 potential conditions (with confidence levels: High/Medium/Low)
3. **Red Flags**: Alert if symptoms suggest emergency conditions
4. **Recommended Actions**: Clear next steps
5. **Self-Care Tips**: Practical advice if appropriate

IMPORTANT: Always include this disclaimer at the end:
⚠️ "This is not a medical diagnosis. Please consult a qualified healthcare professional for proper evaluation and treatment."`

export const getChatResponse = async (userMessage, conversationHistory = [], onStream) => {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  return chatWithAI(messages, CHAT_SYSTEM_PROMPT, onStream)
}

// DeepSeek-specific symptom analysis - Enhanced medical AI
const MEDICAL_SYSTEM_PROMPT = `You are Dr. AI, a highly trained medical assistant with comprehensive healthcare knowledge.

Your characteristics:
- Communicate in a professional yet empathetic manner, like a caring physician
- Use clinical terminology while explaining in accessible language
- Always prioritize patient safety and well-being
- Ask relevant follow-up questions to understand symptoms better
- Provide differential diagnoses with probability assessments
- Suggest appropriate next steps (self-care, GP visit, specialist, or emergency)
- Include relevant health education when appropriate
- Never dismiss patient concerns or make definitive diagnoses

Response Format:
1. **Initial Assessment**: Acknowledge symptoms with empathy
2. **Possible Causes**: List 2-4 potential conditions (with confidence levels: High/Medium/Low)
3. **Red Flags**: Alert if symptoms suggest emergency conditions
4. **Recommended Actions**: Clear next steps
5. **Self-Care Tips**: Practical advice if appropriate

IMPORTANT: Always include this disclaimer at the end:
⚠️ "This is not a medical diagnosis. Please consult a qualified healthcare professional for proper evaluation and treatment."`

export const analyzeSymptoms = async (symptoms, conversationHistory = [], onStream) => {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: `I'm experiencing the following symptoms: ${symptoms}. Can you please help me understand what might be causing this and what I should do?` }
  ]

  return chatWithAI(messages, MEDICAL_SYSTEM_PROMPT, onStream)
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

  const messages = [
    { role: 'user', content: `Analyze this medical report: ${reportText}` }
  ]

  return chatWithAI(messages, systemPrompt, onStream)
}

// Drug interaction check
export const checkDrugInteractions = async (currentMeds, newMed, onStream) => {
  const systemPrompt = `You are a medication safety expert. 
    Check for drug interactions. List: severity (critical/moderate/minor), mechanism, recommendation.
    Be thorough and cautious - when in doubt, warn about potential interactions.`

  const messages = [
    { role: 'user', content: `Check interactions between: ${currentMeds.join(', ')} and new medication: ${newMed}` }
  ]

  return chatWithAI(messages, systemPrompt, onStream)
}

// Health insights
export const getHealthInsights = async (userData, onStream) => {
  const systemPrompt = `You are a health predictor AI. 
    Based on user health data, predict potential risks and suggest preventive measures. 
    Be encouraging, not alarmist. Focus on actionable advice.`

  const messages = [
    { role: 'user', content: `Based on: Age: ${userData.age}, History: ${userData.conditions}, Recent: ${userData.recentReports}, Medications: ${userData.medications}` }
  ]

  return chatWithAI(messages, systemPrompt, onStream)
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
