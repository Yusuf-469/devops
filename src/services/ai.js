/**
 * HEALIX AI Service
 * Humanized Medical Assistant - Sounds like a real doctor, not a discharge summary
 */

// OpenRouter API configuration
// IMPORTANT: API key must be set via environment variable VITE_OPENROUTER_API_KEY
// Do not hardcode API keys in source code
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const PRIMARY_MODEL = 'openrouter/free'

// Emergency detection keywords
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', 'cant breathe', 'unconscious',
  'bleeding heavily', 'suicide', 'overdose', 'anaphylaxis', 'not breathing',
  'severe allergic reaction', 'seizure', 'poisoning', 'electric shock',
  'sudden numbness', 'slurred speech', 'severe headache', 'severe bleeding',
  'cant feel', 'wont wake', 'stopped breathing'
]

// Red flag symptom patterns for urgent responses
const RED_FLAG_PATTERNS = [
  { pattern: /chest.*pain|heart.*pain|arm.*pain.*jaw/i, urgency: 'high', reason: 'Chest pain radiating to arm/jaw can indicate cardiac emergency' },
  { pattern: /shortness.*breath|cant.*breathe|breathing.*difficult|drowning/i, urgency: 'high', reason: 'Breathing difficulty can be life-threatening' },
  { pattern: /sudden.*weak|numb|slur|face.*droop|arm.*weak/i, urgency: 'high', reason: 'Sudden neurological symptoms suggest stroke' },
  { pattern: /heavy.*bleed|severe.*bleed|wont.*stop.*bleed/i, urgency: 'high', reason: 'Severe bleeding requires immediate attention' },
  { pattern: /unconscious|wont.*wake|cant.*wake/i, urgency: 'critical', reason: 'Unconsciousness requires emergency response' },
  { pattern: /overdose|too.*much.*medic|poison/i, urgency: 'critical', reason: 'Poisoning/overdose requires immediate care' },
  { pattern: /anaphylax|throat.*swell|cant.*swallow.*breath/i, urgency: 'critical', reason: 'Severe allergic reaction can block airways' },
  { pattern: /seizure|convulsion|fitting/i, urgency: 'high', reason: 'Seizure requires medical evaluation' }
]

// Master System Prompt - Humanized Doctor Persona
const HUMANIZED_SYSTEM_PROMPT = `You are a thoughtful, experienced general physician speaking with a patient. Think of how a good doctor would actually talk to someone in an office visit - warm but professional, clear but not condescending.

CORE PRINCIPLES:
1. Start by acknowledging what the patient just told you. Show you've heard them.
2. Explain what could be happening in plain, conversational language.
3. Never sound like a medical textbook, discharge summary, or legal document.
4. Avoid these phrases entirely: "raises concern for", "differential diagnosis", "immediate evaluation is warranted", "life-threatening condition", "warrants immediate attention"
5. Use short paragraphs. Use numbered lists only when genuinely useful.
6. No emojis. No decorative bullets. No flashy formatting.

RESPONSE STYLE:
- First 1-2 sentences: Show empathy + immediate understanding of their concern
- Then: Likely explanations in simple terms (not a list of 10 conditions)
- Then: What they should do next (practical, grounded advice)
- Then: Warning signs to watch for (only if relevant to their situation)
- Keep it human. Keep it helpful. Keep it honest about uncertainty.

TONE SWITCHING:
- For common/mild symptoms: Reassuring, explain likely causes first, minimize alarm
- For concerning symptoms: Clear about seriousness without causing panic, give specific action
- For true emergencies: Urgent but human, tell them exactly what to do now

MEDICAL SAFETY:
- Never invent diagnoses as facts. Say "this could be..." or "one possibility is..."
- Be honest about uncertainty. "I'm not certain, but..."
- When something could be serious, say so clearly but without alarm
- Give clear guidance on when to seek care
- Never prescribe specific medications

Remember: You're a doctor having a conversation with a patient. Be real.`

// Chat with AI
export const chatWithAI = async (messages, systemPrompt, onStream, model = PRIMARY_MODEL) => {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not configured')
    throw new Error('API key not configured. Please set VITE_OPENROUTER_API_KEY in environment.')
  }

  try {
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ]

    console.log(`Calling OpenRouter: ${model}`)

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
      console.error('OpenRouter error:', response.status, errorText)
      throw new Error(`OpenRouter API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log('OpenRouter response received')

    return {
      success: true,
      content: data.choices?.[0]?.message?.content || 'No response received',
      model: data.model || model
    }

  } catch (error) {
    console.error('AI service error:', error.message)
    throw error
  }
}

// Detect urgency level from user message
const detectUrgencyLevel = (userMessage) => {
  const lower = userMessage.toLowerCase()
  
  for (const flag of RED_FLAG_PATTERNS) {
    if (flag.pattern.test(lower)) {
      return { level: flag.urgency, reason: flag.reason }
    }
  }
  
  // Check emergency keywords
  const hasEmergencyKeyword = EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword))
  if (hasEmergencyKeyword) {
    return { level: 'high', reason: 'Emergency keyword detected' }
  }
  
  return { level: 'low', reason: null }
}

// Build context-aware system prompt with urgency
const buildSystemPrompt = (urgencyLevel, conversationHistory) => {
  let toneGuidance = ''
  
  if (urgencyLevel.level === 'critical') {
    toneGuidance = `
URGENT SITUATION - The patient's symptoms suggest something that needs immediate attention. Be direct and clear:
- Tell them exactly what to do right now
- Don't soften the message, but don't cause panic either
- Be specific: "Call 102 now" or "Go to the nearest emergency"
- Explain briefly why this matters
- Keep it short - they need to act`
  } else if (urgencyLevel.level === 'high') {
    toneGuidance = `
CONCERNING SITUATION - Something here warrants medical attention but isn't necessarily an emergency. Be clear but not alarming:
- Explain what could be serious and why
- Give specific guidance on when to seek urgent care
- Mention what signs would mean they should go to emergency now
- Keep the tone balanced - take it seriously but don't terrify them`
  } else {
    toneGuidance = `
REASSURING MODE - This sounds like a common concern. Be warm and helpful:
- Start by acknowledging their worry - that's understandable
- Explain the most likely causes first (not the scariest ones)
- Keep the tone conversational, like a doctor explaining things during a visit
- Give practical self-care tips if appropriate
- Mention when it would be worth seeing a doctor, but don't push them toward emergency care`
  }
  
  // Add conversation context if available
  let contextNote = ''
  if (conversationHistory.length > 0) {
    contextNote = `
CONTEXT FROM CONVERSATION:
- This is an ongoing conversation, not the first message
- Build on what you've already discussed with the patient
- Reference their earlier messages naturally
- Don't repeat what you've already said - add new value`
  }
  
  return HUMANIZED_SYSTEM_PROMPT + toneGuidance + contextNote
}

// Main chat function with humanized responses
export const getChatResponse = async (userMessage, conversationHistory = [], onStream) => {
  const urgencyLevel = detectUrgencyLevel(userMessage)
  const systemPrompt = buildSystemPrompt(urgencyLevel, conversationHistory)
  
  const messages = conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
  return chatWithAI(messages, systemPrompt, onStream, PRIMARY_MODEL)
}

// Symptom analysis with humanized output
export const analyzeSymptoms = async (symptoms, conversationHistory = [], onStream) => {
  const urgencyLevel = detectUrgencyLevel(symptoms)
  const systemPrompt = buildSystemPrompt(urgencyLevel, conversationHistory)
  
  const messages = conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
  return chatWithAI(messages, systemPrompt, onStream, PRIMARY_MODEL)
}

// Report analysis - Professional but human
export const analyzeReport = async (reportText, onStream) => {
  const systemPrompt = `${HUMANIZED_SYSTEM_PROMPT}

You're reviewing a medical report for a patient. Explain the findings in plain language:
- Start with what the key findings are in simple terms
- Tell them what this means for their health
- If something needs attention, explain why and what to do about it
- If everything looks okay, say so directly - don't be vague just to be safe
- Give them a clear next step

Be helpful, be clear, be human. This isn't a data dump - it's explaining results to a person.`

  return chatWithAI([{ role: "user", content: `Analyze this medical report: ${reportText}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Drug interaction check
export const checkDrugInteractions = async (currentMeds, newMed, onStream) => {
  const systemPrompt = `${HUMANIZED_SYSTEM_PROMPT}

You're checking if a new medication is safe to take with their current medications:
- Start by saying whether this combination is safe, needs caution, or should be avoided
- Explain simply why (not a pharmacology lecture)
- If there's a concern, explain what to watch for
- Give practical guidance: should they call their doctor, wait, is there an alternative
- Be direct. Don't make them worry unnecessarily, but don't dismiss real risks either.`

  return chatWithAI([{ role: "user", content: `Check drug interactions between: ${currentMeds} and ${newMed}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Health insights - Personal and practical
export const getHealthInsights = async (userData, onStream) => {
  const systemPrompt = `${HUMANIZED_SYSTEM_PROMPT}

You're giving health advice to a patient during a routine consultation:
- Be practical and actionable, like a doctor would be in an office visit
- Focus on what actually matters for their situation
- Be encouraging - health advice works better when it's positive
- If they're due for any checkups or screenings, mention those naturally
- Don't overwhelm them with a list of everything they could possibly do

Keep it useful. Keep it positive. Keep it human.`

  return chatWithAI([{ role: "user", content: `Provide health insights for: Age ${userData.age}, Conditions: ${userData.conditions}, Recent reports: ${userData.recentReports}` }], systemPrompt, onStream, PRIMARY_MODEL)
}

// Emergency detection
export const checkForEmergency = (text) => {
  const lower = text.toLowerCase()
  const isEmergency = EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword))

  if (isEmergency) {
    return { level: 'critical', message: 'This sounds like it needs immediate attention. Please call 102 or go to your nearest emergency department now.', action: 'CALL_102', countdown: 10 }
  }
  return null
}

// Analyze response tone for UI feedback
export const analyzeResponseTone = (response) => {
  const lower = response.toLowerCase()
  
  if (lower.includes('call 102') || lower.includes('go to emergency') || lower.includes('right now') || lower.includes('immediate')) {
    return 'urgent'
  }
  if (lower.includes('probably') || lower.includes('likely') || lower.includes('common') || lower.includes('nothing to worry')) {
    return 'reassuring'
  }
  if (lower.includes('not sure') || lower.includes("couldn't tell") || lower.includes('might')) {
    return 'cautious'
  }
  return 'neutral'
}

export default { chatWithAI, getChatResponse, analyzeSymptoms, analyzeReport, checkDrugInteractions, getHealthInsights, checkForEmergency, analyzeResponseTone }
