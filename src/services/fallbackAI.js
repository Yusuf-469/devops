/**
 * HEALIX Fallback AI Model
 * Offline medical symptom analysis using rule-based expert system
 * Works without any API calls - completely self-contained
 */

import { useAppStore } from '../store/index.js'

// ============================================
// MEDICAL KNOWLEDGE BASE
// ============================================

const SYMPTOM_PATTERNS = {
  fever: {
    keywords: ['fever', 'temperature', 'hot', 'high temperature', 'pyrexia'],
    conditions: [
      { name: 'Common Cold', confidence: 'Medium', probability: 30, severity: 'mild' },
      { name: 'Flu (Influenza)', confidence: 'Medium', probability: 35, severity: 'moderate' },
      { name: 'Viral Infection', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Bacterial Infection', confidence: 'Low', probability: 10, severity: 'moderate' }
    ],
    advice: 'Monitor temperature. Stay hydrated. Take paracetamol. Rest.',
    emergency: ['chest pain', 'difficulty breathing', 'confusion', 'rash']
  },
  cough: {
    keywords: ['cough', 'coughing', 'hacking', 'dry cough', 'wet cough'],
    conditions: [
      { name: 'Common Cold', confidence: 'High', probability: 40, severity: 'mild' },
      { name: 'Bronchitis', confidence: 'Medium', probability: 25, severity: 'moderate' },
      { name: 'Allergies', confidence: 'Medium', probability: 20, severity: 'mild' },
      { name: 'GERD/Acid Reflux', confidence: 'Low', probability: 15, severity: 'mild' }
    ],
    advice: 'Stay hydrated. Honey helps. Avoid smoke.',
    emergency: ['coughing up blood', 'shortness of breath', 'chest pain']
  },
  cold: {
    keywords: ['cold', 'runny nose', 'stuffy nose', 'sneezing', 'congestion', 'sore throat'],
    conditions: [
      { name: 'Common Cold (Viral)', confidence: 'High', probability: 60, severity: 'mild' },
      { name: 'Allergic Rhinitis', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Sinusitis', confidence: 'Low', probability: 15, severity: 'moderate' }
    ],
    advice: 'Rest. Stay hydrated. Use saline drops.',
    emergency: ['high fever', 'severe headache', 'stiff neck']
  },
  headache: {
    keywords: ['headache', 'head pain', 'migraine', 'throbbing head', 'pressure in head'],
    conditions: [
      { name: 'Tension Headache', confidence: 'High', probability: 45, severity: 'mild' },
      { name: 'Dehydration', confidence: 'Medium', probability: 20, severity: 'mild' },
      { name: 'Migraine', confidence: 'Medium', probability: 20, severity: 'moderate' },
      { name: 'Sinus Headache', confidence: 'Low', probability: 15, severity: 'mild' }
    ],
    advice: 'Rest in dark room. Stay hydrated. Take pain relievers.',
    emergency: ['sudden severe headache', 'weakness on one side', 'vision changes', 'confusion']
  },
  'stomach pain': {
    keywords: ['stomach pain', 'abdominal pain', 'stomach ache', 'belly pain', ' tummy pain'],
    conditions: [
      { name: 'Indigestion', confidence: 'Medium', probability: 30, severity: 'mild' },
      { name: 'Gastritis', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Food Poisoning', confidence: 'Medium', probability: 20, severity: 'moderate' },
      { name: 'IBS', confidence: 'Low', probability: 15, severity: 'mild' },
      { name: 'Appendicitis', confidence: 'Low', probability: 10, severity: 'severe' }
    ],
    advice: 'Eat bland foods. Stay hydrated. Avoid spicy foods.',
    emergency: ['severe pain', 'vomiting blood', 'blood in stool', 'high fever']
  },
  'body pain': {
    keywords: ['body pain', 'muscle pain', 'aches', 'joint pain', 'muscle ache', 'pain all over'],
    conditions: [
      { name: 'Flu (Influenza)', confidence: 'High', probability: 40, severity: 'moderate' },
      { name: 'Muscle Strain', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Fibromyalgia', confidence: 'Low', probability: 15, severity: 'moderate' },
      { name: 'Arthritis', confidence: 'Low', probability: 20, severity: 'mild' }
    ],
    advice: 'Rest. Gentle stretching. Pain relievers. Warm compress.',
    emergency: ['chest pain', 'difficulty breathing', 'unable to move']
  },
  fatigue: {
    keywords: ['fatigue', 'tired', 'exhausted', 'no energy', 'always sleepy', 'exhaustion'],
    conditions: [
      { name: 'Lack of Sleep', confidence: 'High', probability: 35, severity: 'mild' },
      { name: 'Stress/Anxiety', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Depression', confidence: 'Medium', probability: 20, severity: 'moderate' },
      { name: 'Anemia', confidence: 'Low', probability: 10, severity: 'moderate' },
      { name: 'Hypothyroidism', confidence: 'Low', probability: 10, severity: 'moderate' }
    ],
    advice: 'Sleep 7-9 hours. Exercise. Eat balanced diet.',
    emergency: ['sudden weakness', 'shortness of breath', 'chest pain']
  },
  nausea: {
    keywords: ['nausea', 'nauseous', 'feel sick', 'want to vomit', 'queasy'],
    conditions: [
      { name: 'Indigestion', confidence: 'Medium', probability: 30, severity: 'mild' },
      { name: 'Food Poisoning', confidence: 'Medium', probability: 25, severity: 'moderate' },
      { name: 'Pregnancy', confidence: 'Medium', probability: 15, severity: 'mild' },
      { name: 'Migraine', confidence: 'Low', probability: 15, severity: 'mild' },
      { name: 'Gastroenteritis', confidence: 'Medium', probability: 15, severity: 'moderate' }
    ],
    advice: 'Sip clear fluids. Eat bland foods. Rest.',
    emergency: ['vomiting blood', 'severe abdominal pain', 'confusion']
  },
  diarrhea: {
    keywords: ['diarrhea', 'loose stool', 'watery stool', 'frequent bowel movements'],
    conditions: [
      { name: 'Viral Gastroenteritis', confidence: 'High', probability: 40, severity: 'moderate' },
      { name: 'Food Poisoning', confidence: 'Medium', probability: 30, severity: 'moderate' },
      { name: 'Bacterial Infection', confidence: 'Medium', probability: 15, severity: 'moderate' },
      { name: 'IBS Flare-up', confidence: 'Low', probability: 15, severity: 'mild' }
    ],
    advice: 'Stay hydrated with electrolytes. Eat bland foods.',
    emergency: ['blood in stool', 'severe dehydration', 'high fever', 'lasts more than 3 days']
  },
  dizziness: {
    keywords: ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'spinning'],
    conditions: [
      { name: 'Dehydration', confidence: 'High', probability: 35, severity: 'mild' },
      { name: 'Low Blood Sugar', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Inner Ear Problem', confidence: 'Medium', probability: 20, severity: 'mild' },
      { name: 'Low Blood Pressure', confidence: 'Low', probability: 15, severity: 'mild' },
      { name: 'Anemia', confidence: 'Low', probability: 5, severity: 'moderate' }
    ],
    advice: 'Sit or lie down slowly. Stay hydrated. Eat regular meals.',
    emergency: ['chest pain', 'shortness of breath', 'slurred speech', 'fainting']
  },
  chest_pain: {
    keywords: ['chest pain', 'chest tightness', 'pain in chest', 'pressure in chest'],
    conditions: [
      { name: 'Muscle Strain', confidence: 'Medium', probability: 30, severity: 'mild' },
      { name: 'Acid Reflux/GERD', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Anxiety/Panic Attack', confidence: 'Medium', probability: 20, severity: 'moderate' },
      { name: 'Heart Attack', confidence: 'Low', probability: 15, severity: 'critical' },
      { name: 'Angina', confidence: 'Low', probability: 10, severity: 'severe' }
    ],
    advice: 'Seek immediate medical attention.',
    emergency: ['radiating to arm', 'shortness of breath', 'sweating', 'nausea']
  },
  shortness_of_breath: {
    keywords: ['shortness of breath', 'breathless', 'cant breathe', 'difficulty breathing', 'wheezing'],
    conditions: [
      { name: 'Asthma', confidence: 'Medium', probability: 30, severity: 'moderate' },
      { name: 'Anxiety/Panic Attack', confidence: 'Medium', probability: 25, severity: 'moderate' },
      { name: 'COPD', confidence: 'Low', probability: 15, severity: 'severe' },
      { name: 'Heart Failure', confidence: 'Low', probability: 10, severity: 'severe' },
      { name: 'Pulmonary Embolism', confidence: 'Low', probability: 10, severity: 'critical' },
      { name: 'Allergic Reaction', confidence: 'Low', probability: 10, severity: 'severe' }
    ],
    advice: 'Seek immediate medical attention.',
    emergency: ['cant breathe', 'blue lips', 'chest pain', 'confusion']
  },
  sore_throat: {
    keywords: ['sore throat', 'throat pain', 'pain when swallowing', 'scratchy throat'],
    conditions: [
      { name: 'Viral Pharyngitis', confidence: 'High', probability: 50, severity: 'mild' },
      { name: 'Strep Throat', confidence: 'Medium', probability: 25, severity: 'moderate' },
      { name: 'Tonsillitis', confidence: 'Medium', probability: 15, severity: 'moderate' },
      { name: 'Allergies', confidence: 'Low', probability: 10, severity: 'mild' }
    ],
    advice: 'Gargle salt water. Stay hydrated. Use lozenges.',
    emergency: ['difficulty breathing', 'difficulty swallowing', 'high fever']
  },
  rash: {
    keywords: ['rash', 'skin rash', 'hives', 'red skin', 'itchy rash'],
    conditions: [
      { name: 'Allergic Reaction', confidence: 'High', probability: 40, severity: 'moderate' },
      { name: 'Eczema', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Contact Dermatitis', confidence: 'Medium', probability: 20, severity: 'mild' },
      { name: 'Viral Infection', confidence: 'Low', probability: 15, severity: 'mild' }
    ],
    advice: 'Avoid scratching. Apply moisturizer. Antihistamines help.',
    emergency: ['difficulty breathing', 'swelling of face', 'rash spreads rapidly']
  },
  back_pain: {
    keywords: ['back pain', 'lower back pain', 'backache', 'pain in back'],
    conditions: [
      { name: 'Muscle Strain', confidence: 'High', probability: 45, severity: 'mild' },
      { name: 'Poor Posture', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Herniated Disc', confidence: 'Low', probability: 15, severity: 'moderate' },
      { name: 'Kidney Stone', confidence: 'Low', probability: 10, severity: 'severe' },
      { name: 'Arthritis', confidence: 'Low', probability: 5, severity: 'moderate' }
    ],
    advice: 'Rest but stay mobile. Apply ice/heat. Gentle stretching.',
    emergency: ['numbness in legs', 'loss of bladder control', 'fever']
  }
}

// ============================================
// FOLLOW-UP QUESTIONS DATABASE
// ============================================

const FOLLOW_UP_QUESTIONS = {
  fever: [
    'How long have you had fever?',
    'What is your temperature?',
    'Any chills or sweating?',
    'Other symptoms like cough, headache?'
  ],
  cough: [
    'Dry or wet cough?',
    'How long coughing?',
    'Coughing up blood/mucus?',
    'Shortness of breath?'
  ],
  cold: [
    'How long symptoms?',
    'Clear or colored discharge?',
    'Any fever?',
    'Facial pressure?'
  ],
  headache: [
    'Where is pain (front/back/side)?',
    'Throbbing or constant?',
    'How long lasts?',
    'Nausea, vision changes, light sensitivity?'
  ],
  'stomach pain': [
    'Where pain (upper/lower/right/left)?',
    'Sharp, dull, or cramping?',
    'When did it start?',
    'Nausea, vomiting, bowel changes?'
  ],
  'body pain': [
    'Which areas affected?',
    'How long?',
    'Fever or other symptoms?',
    'Recent strenuous activity?'
  ],
  fatigue: [
    'How long feeling tired?',
    'Hours of sleep daily?',
    'Sleep difficulty?',
    'Appetite or mood changes?'
  ],
  nausea: [
    'Vomiting?',
    'What triggers it?',
    'Diarrhea or abdominal pain?',
    'Could you be pregnant?'
  ],
  dizziness: [
    'Room spinning or lightheaded?',
    'When started?',
    'Hearing loss or ringing?',
    'Heart conditions or medications?'
  ],
  chest_pain: [
    'Sharp, dull, or pressure?',
    'Radiates to arm/jaw/back?',
    'Shortness of breath or sweating?',
    'Heart problem history?'
  ],
  shortness_of_breath: [
    'When started?',
    'Constant or comes/goes?',
    'Wheezing or chest tightness?',
    'Asthma or respiratory conditions?'
  ],
  sore_throat: [
    'Severity (mild/moderate/severe)?',
    'White patches on throat?',
    'Difficulty swallowing?',
    'Fever or swollen lymph nodes?'
  ],
  rash: [
    'Where started and spread?',
    'Itchy, painful, or neither?',
    'Fever or swelling?',
    'New soaps, foods, or plants?'
  ],
  back_pain: [
    'Where (upper/middle/lower)?',
    'Sudden or gradual?',
    'Pain down legs?',
    'Numbness, tingling, weakness?'
  ]
}

// ============================================
// GENERAL ADVICE RESPONSES
// ============================================

const GENERAL_RESPONSES = {
  greeting: [
    "Hello! I'm Dr. AI. Describe your symptoms for assessment.",
    "Hi! Tell me about your symptoms for guidance.",
    "Welcome! What symptoms are you experiencing?"
  ],
  closing: [
    "Hope this helps. Consult a doctor for proper care.",
    "Take care! Seek medical attention if worse.",
    "Your health matters. Follow up with a doctor."
  ],
  encouraging: [
    "Thank you. Let me analyze...",
    "I understand. Let me help...",
    "That's useful. Let me guide you..."
  ]
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const detectSymptoms = (text) => {
  const lowerText = text.toLowerCase()
  const detected = []
  
  for (const [symptom, data] of Object.entries(SYMPTOM_PATTERNS)) {
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword)) {
        detected.push(symptom)
        break
      }
    }
  }
  
  return detected.length > 0 ? detected : ['general']
}

const formatResponse = (detectedSymptoms, userMessage) => {
  let response = ''
  const symptomData = detectedSymptoms.map(s => SYMPTOM_PATTERNS[s]).filter(Boolean)
  
  if (symptomData.length === 0) {
    response = generateGeneralResponse(userMessage)
  } else {
    response = generateSymptomResponse(symptomData, userMessage)
  }
  
  return response
}

const generateSymptomResponse = (symptomData, userMessage) => {
  let response = ''
  
  // Top conditions
  const topConditions = symptomData[0]?.conditions.slice(0, 2) || []
  if (topConditions.length > 0) {
    response += `LIKELY:\n`
    topConditions.forEach(condition => {
      response += `- ${condition.name}\n`
    })
    response += `\n`
  }
  
  // Recommendations
  response += `DO:\n`
  const advice = symptomData[0]?.advice || 'Monitor symptoms'
  response += `- ${advice}\n`
  
  // Red flags
  const redFlags = symptomData[0]?.emergency || []
  if (redFlags.length > 0) {
    response += `\nWARN: ${redFlags[0]}\n`
  }
  
  // Follow-up questions in numbered list
  const symptomKey = Object.keys(SYMPTOM_PATTERNS).find(key => 
    symptomData[0]?.conditions.some(c => SYMPTOM_PATTERNS[key]?.conditions.includes(c))
  )
  const questions = FOLLOW_UP_QUESTIONS[symptomKey] || FOLLOW_UP_QUESTIONS.fever
  
  response += `\nANSWER:\n`
  questions.slice(0, 3).forEach((q, i) => {
    response += `${i + 1}. ${q}\n`
  })
  
  // Disclaimer
  response += `\n_Disclaimer: Consult a doctor._`
  
  return response
}

const generateGeneralResponse = (userMessage) => {
  const lowerText = userMessage.toLowerCase()
  
  // Check for medication questions
  if (lowerText.includes('medicine') || lowerText.includes('medication') || lowerText.includes('drug')) {
    return `CANNOT PRESCRIBE\n\n- Ask doctor/pharmacist\n- Never take meds without advice\n\nEmergencies: Call 102\n\n_Disclaimer: Consult a doctor._`
  }
  
  // Check for general health questions
  if (lowerText.includes('healthy') || lowerText.includes('diet') || lowerText.includes('exercise')) {
    return `STAY HEALTHY:\n- Balanced meals\n- Exercise regularly\n- Sleep 7-9 hours\n- Stay hydrated\n\n_Disclaimer: Consult a doctor._`
  }
  
  // Check for appointment questions
  if (lowerText.includes('appointment') || lowerText.includes('doctor') || lowerText.includes('see a doctor')) {
    return `SEE DOCTOR IF:\n1. Symptoms last > 1 week\n2. Getting worse\n3. High fever or severe pain\n\nEmergencies: Call 102\n\n_Disclaimer: Consult a doctor._`
  }
  
  // Default - ask for more details
  return `ANSWER:\n1. When symptoms started?\n2. Severity (mild/moderate/severe)?\n3. Location of any pain?\n4. Any triggering factors?\n\n_Disclaimer: Consult a doctor._`
}

// ============================================
// MAIN FUNCTIONS
// ============================================

// Streaming simulation for realistic effect
const createStreamingResponse = (fullResponse, onStream, speed = 20) => {
  let currentIndex = 0
  
  const streamChunk = () => {
    if (currentIndex < fullResponse.length) {
      const chunk = fullResponse.slice(currentIndex, currentIndex + speed)
      currentIndex += speed
      onStream(chunk)
      setTimeout(streamChunk, 50)
    }
  }
  
  streamChunk()
}

// Main symptom analysis function (fallback for DeepSeek)
export const analyzeSymptoms = async (userMessage, conversationHistory = [], onStream) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const detectedSymptoms = detectSymptoms(userMessage)
      const fullResponse = formatResponse(detectedSymptoms, userMessage)
      
      // Simulate streaming
      if (onStream) {
        let fullText = ''
        const words = fullResponse.split(' ')
        let wordIndex = 0
        
        const streamWord = () => {
          if (wordIndex < words.length) {
            fullText += (wordIndex > 0 ? ' ' : '') + words[wordIndex]
            onStream(fullText)
            wordIndex++
            setTimeout(streamWord, 30)
          } else {
            resolve({ success: true, content: fullResponse, isFallback: true })
          }
        }
        
        streamWord()
      } else {
        resolve({ success: true, content: fullResponse, isFallback: true })
      }
    }, 500) // Small delay to simulate processing
  })
}

// Chat response function
export const getChatResponse = async (userMessage, conversationHistory = [], onStream) => {
  return analyzeSymptoms(userMessage, conversationHistory, onStream)
}

// Quick symptom check for sidebar
export const quickSymptomCheck = (symptom) => {
  const symptomData = SYMPTOM_PATTERNS[symptom]
  
  if (!symptomData) {
    return {
      conditions: [],
      advice: 'Describe symptoms for assessment.',
      isFallback: true
    }
  }
  
  return {
    conditions: symptomData.conditions,
    advice: symptomData.advice,
    emergency: symptomData.emergency,
    isFallback: true
  }
}

// Drug interaction checker (basic local version)
export const checkDrugInteractions = async (currentMeds, newMed) => {
  // Basic drug interaction knowledge
  const interactions = []
  
  // Common interactions (simplified list)
  const knownInteractions = {
    'warfarin': ['aspirin', 'ibuprofen', 'naproxen'],
    'metformin': ['alcohol'],
    'lisinopril': ['potassium'],
    'simvastatin': ['grapefruit'],
    'amlodipine': ['grapefruit'],
    'levothyroxine': ['calcium', 'iron'],
    'sertraline': ['tramadol', 'st john\'s wort'],
    'escitalopram': ['tramadol', 'st john\'s wort']
  }
  
  const medLower = newMed.toLowerCase()
  
  for (const [current, interactionsList] of Object.entries(knownInteractions)) {
    if (currentMeds.some(m => m.toLowerCase().includes(current))) {
      for (const interaction of interactionsList) {
        if (medLower.includes(interaction)) {
          interactions.push({
            severity: 'moderate',
            drug: current,
            with: newMed,
            message: `${current} may interact with ${interaction}-containing products`
          })
        }
      }
    }
  }
  
  // Build response
  let response = ''
  if (interactions.length > 0) {
    response += `STATUS: Caution\n\nDETAILS:\n`
    interactions.forEach(i => {
      response += `- ${i.message}\n`
    })
    response += `\nRECOMMENDATION: Consult pharmacist before combining.\n`
  } else {
    response += `STATUS: Safe\n\nDETAILS:\n`
    response += `- No known interactions found\n\n`
    response += `RECOMMENDATION: Always inform your doctor about all medications.\n`
  }
  
  response += `\n_Disclaimer: Consult a doctor or pharmacist._`
  
  return {
    interactions,
    response,
    hasCritical: false,
    success: true,
    content: response,
    isFallback: true
  }
}

export default {
  analyzeSymptoms,
  getChatResponse,
  quickSymptomCheck,
  checkDrugInteractions
}
