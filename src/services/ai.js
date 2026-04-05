/**
 * HEALIX AI Service
 * OpenRouter SDK with nvidia/nemotron-3-super-120b-a12b:free model
 */

import { OpenRouter } from "@openrouter/sdk";

// API Configuration - Use environment variable for security
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

// Primary Model: Nvidia Nemotron 3 Super 120B via OpenRouter
const PRIMARY_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free'

// Initialize OpenRouter client
const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY
})

// Generic AI Chat completion with streaming support
export const chatWithAI = async (messages, systemPrompt, onStream, model = PRIMARY_MODEL) => {
  // Check if API key is configured
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not configured.')
    throw new Error('API key not configured')
  }

  try {
    // Prepare messages with system prompt
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ]

    // Stream the response to get reasoning tokens in usage
    const stream = await openrouter.chat.send({
      model: model,
      messages: allMessages,
      stream: true
    })

    let response = ""
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        response += content
        if (onStream) {
          onStream(response)
        }
      }

      // Usage information comes in the final chunk
      if (chunk.usage) {
        console.log("Reasoning tokens:", chunk.usage.reasoningTokens)
      }
    }

    return {
      success: true,
      content: response,
      isFallback: false,
      model: model
    }

  } catch (error) {
    console.error('OpenRouter SDK Error:', error.message)
    throw error // Don't fallback - let caller handle the error
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
