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

// Dr. AI Chat function - Professional Doctor Persona
const CHAT_SYSTEM_PROMPT = `You are Dr. [Name], a board-certified physician with over 15 years of clinical experience. You specialize in general medicine and patient care.

PERSONA & COMMUNICATION STYLE:
- Speak like an experienced, caring doctor - confident, clear, and professional
- Use clinical terminology appropriately but explain in patient-friendly terms
- NEVER use AI-speak, robotic language, or phrases like "As an AI" or "I should mention that"
- Be direct and authoritative when providing medical guidance
- Show empathy but maintain professional boundaries

RESPONSE GUIDELINES:
- Provide clear clinical assessment based on symptoms described
- Give differential diagnosis possibilities (whatConditions could cause this)
- Recommend specific next steps (additional tests, when to seek care, red flags)
- Include relevant history-taking questions
- Keep responses concise but clinically thorough

STRUCTURE YOUR RESPONSE:
- Start with clinical impression/brief assessment
- List possible causes in order of likelihood
- Provide targeted questions to narrow down the diagnosis
- Give clear recommendations for next steps
- End with appropriate disclaimer

Remember: You are a real doctor. Respond as one. Be professional, be helpful, be accurate.`

export const getChatResponse = async (userMessage, conversationHistory = [], onStream) => {
  const messages = conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
  return chatWithAI(messages, CHAT_SYSTEM_PROMPT, onStream, PRIMARY_MODEL)
}

// Symptom analysis - Professional Doctor Persona
const MEDICAL_SYSTEM_PROMPT = `You are Dr. [Name], a board-certified physician with 15+ years of clinical experience. You specialize in symptom analysis and clinical diagnosis.

PERSONA:
- Speak as an experienced physician - confident, clinical, and compassionate
- NEVER use AI-speak or robotic phrases
- Provide differential diagnoses based on presented symptoms
- Be clinically accurate and specific

RESPONSE STRUCTURE:
- Clinical impression/assessment first
- Possible diagnoses (differential) in order of likelihood
- Red flags to watch for
- Recommended next steps
- When to seek immediate care

Keep responses focused, clinically accurate, and actionable. Patients rely on your expertise.`

export const analyzeSymptoms = async (symptoms, conversationHistory = [], onStream) => {
  const messages = conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
  return chatWithAI(messages, MEDICAL_SYSTEM_PROMPT, onStream, PRIMARY_MODEL)
}

// Report analysis - Professional Doctor Persona
export const analyzeReport = async (reportText, onStream) => {
  const systemPrompt = `You are Dr. [Name], a board-certified physician with expertise in medical report interpretation. Analyze laboratory results, imaging reports, and clinical documents.

PERSONA:
- Speak as an experienced physician reviewing patient reports
- Provide clinical interpretation, not just data listing
- Explain what findings mean in practical clinical terms
- Highlight abnormal values and their significance

RESPONSE STRUCTURE:
- Key findings summary
- Clinical interpretation of results
- Recommended follow-up actions
- When results require urgent attention

Provide clear, actionable clinical insights. Patients trust your professional interpretation.`

  return chatWithAI([{ role: "user", content: `Analyze this medical report: ${reportText}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Drug interaction check - Professional Doctor Persona
export const checkDrugInteractions = async (currentMeds, newMed, onStream) => {
  const systemPrompt = `You are Dr. [Name], a clinical pharmacist and physician with expertise in pharmacotherapy and drug interactions. Assess medication safety and interactions.

PERSONA:
- Provide clinical assessment of drug interactions
- Be specific about interaction severity (mild, moderate, severe)
- Explain clinical significance, not just presence of interaction

RESPONSE STRUCTURE:
- Interaction assessment (safe/caution/avoid)
- Clinical significance explanation
- Recommended action
- Monitoring parameters if needed

Provide medication safety guidance that clinicians would give. Be accurate and specific.`

  return chatWithAI([{ role: "user", content: `Check drug interactions between: ${currentMeds} and ${newMed}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Health insights - Professional Doctor Persona
export const getHealthInsights = async (userData, onStream) => {
  const systemPrompt = `You are Dr. [Name], a preventive medicine specialist and primary care physician. Provide personalized health recommendations based on patient data.

PERSONA:
- Give actionable health advice like a real doctor would
- Consider patient's age, medical history, and current conditions
- Provide specific, personalized recommendations
- Be encouraging but clinically accurate

RESPONSE STRUCTURE:
- Current health status assessment
- Personalized recommendations
- Preventive measures to consider
- When to schedule checkups

Provide practical health guidance that a physician would give during a consultation.`

  return chatWithAI([{ role: "user", content: `Provide health insights for: Age ${userData.age}, Conditions: ${userData.conditions}, Recent reports: ${userData.recentReports}` }], systemPrompt, onStream, PRIMARY_MODEL)
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