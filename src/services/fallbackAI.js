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
    advice: 'Monitor your temperature. Stay hydrated. Take paracetamol if needed. Rest well.',
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
    advice: 'Stay hydrated. Honey can help soothe cough. Avoid irritants like smoke.',
    emergency: ['coughing up blood', 'shortness of breath', 'chest pain']
  },
  cold: {
    keywords: ['cold', 'runny nose', 'stuffy nose', 'sneezing', 'congestion', 'sore throat'],
    conditions: [
      { name: 'Common Cold (Viral)', confidence: 'High', probability: 60, severity: 'mild' },
      { name: 'Allergic Rhinitis', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Sinusitis', confidence: 'Low', probability: 15, severity: 'moderate' }
    ],
    advice: 'Rest and stay hydrated. Use saline nasal drops. Warm liquids can help soothe.',
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
    advice: 'Rest in a quiet, dark room. Stay hydrated. Over-the-counter pain relievers may help.',
    emergency: ['sudden severe headache', 'weakness on one side', 'vision changes', 'confusion']
  },
  'stomach pain': {
    keywords: ['stomach pain', 'abdominal pain', 'stomach ache', 'belly pain', ' tummy pain'],
    conditions: [
      { name: 'Indigestion', confidence: 'Medium', probability: 30, severity: 'mild' },
      { name: 'Gastritis', confidence: 'Medium', probability: 25, severity: 'mild' },
      { name: 'Food Poisoning', confidence: 'Medium', probability: 20, severity: 'moderate' },
      { name: 'IBS (Irritable Bowel Syndrome)', confidence: 'Low', probability: 15, severity: 'mild' },
      { name: 'Appendicitis', confidence: 'Low', probability: 10, severity: 'severe' }
    ],
    advice: 'Eat bland foods. Stay hydrated. Avoid fatty or spicy foods. Rest.',
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
    advice: 'Rest. Gentle stretching. Over-the-counter pain relievers. Warm compress.',
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
    advice: 'Ensure adequate sleep (7-9 hours). Exercise regularly. Maintain a balanced diet.',
    emergency: ['sudden weakness', 'shortness of breath', 'chest pain']
  },
  nausea: {
    keywords: ['nausea', 'nauseous', 'feel sick', 'want to vomit', 'queasy'],
    conditions: [
      { name: 'Indigestion', confidence: 'Medium', probability: 30, severity: 'mild' },
      { name: 'Food Poisoning', confidence: 'Medium', probability: 25, severity: 'moderate' },
      { name: 'Pregnancy (Morning Sickness)', confidence: 'Medium', probability: 15, severity: 'mild' },
      { name: 'Migraine', confidence: 'Low', probability: 15, severity: 'mild' },
      { name: 'Gastroenteritis', confidence: 'Medium', probability: 15, severity: 'moderate' }
    ],
    advice: 'Sip small amounts of clear fluids. Eat bland foods like crackers. Rest.',
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
    advice: 'Stay hydrated with electrolyte solutions. Eat bland foods. Avoid dairy and fatty foods.',
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
    advice: 'Sit or lie down slowly. Stay hydrated. Eat regular meals. Avoid sudden movements.',
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
    advice: 'Seek immediate medical attention for chest pain. Call emergency services.',
    emergency: ['chest pain', 'radiating to arm', 'shortness of breath', 'sweating', 'nausea']
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
    advice: 'Seek immediate medical attention for breathing difficulties.',
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
    advice: 'Gargle with warm salt water. Stay hydrated. Use throat lozenges.',
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
    advice: 'Avoid scratching. Apply moisturizer. Use antihistamines for itching.',
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
    advice: 'Rest but stay mobile. Apply ice/heat. Gentle stretching. Over-the-counter pain relievers.',
    emergency: ['numbness in legs', 'loss of bladder control', 'fever']
  }
}

// ============================================
// FOLLOW-UP QUESTIONS DATABASE
// ============================================

const FOLLOW_UP_QUESTIONS = {
  fever: [
    'How long have you had this fever?',
    'What is your approximate temperature?',
    'Are you experiencing any chills or sweating?',
    'Do you have any other symptoms like cough, headache, or body aches?'
  ],
  cough: [
    'Is your cough dry or productive (bringing up phlegm)?',
    'How long have you been coughing?',
    'Are you coughing up any blood or colored mucus?',
    'Do you have any shortness of breath or chest pain?'
  ],
  cold: [
    'How long have you had these symptoms?',
    'Is your nasal discharge clear or colored?',
    'Do you have a fever?',
    'Any facial pressure or headache?'
  ],
  headache: [
    'Where is the pain located (front, back, one side)?',
    'How would you describe the pain (throbbing, constant, stabbing)?',
    'How long does the headache last?',
    'Any associated symptoms like nausea, vision changes, or sensitivity to light?'
  ],
  'stomach pain': [
    'Where exactly is the pain located (upper, lower, right, left)?',
    'How would you describe the pain (sharp, dull, cramping)?',
    'When did the pain start?',
    'Any associated symptoms like nausea, vomiting, or changes in bowel movements?'
  ],
  'body pain': [
    'Which areas of your body are affected?',
    'How long have you had these pains?',
    'Do you have a fever or other symptoms?',
    'Did you engage in any strenuous activity recently?'
  ],
  fatigue: [
    'How long have you been feeling this fatigued?',
    'How many hours of sleep do you get on average?',
    'Any difficulty falling or staying asleep?',
    'Any changes in appetite or mood?'
  ],
  nausea: [
    'Are you experiencing any vomiting?',
    'What triggers or worsens the nausea?',
    'Any diarrhea or abdominal pain?',
    'Could you be pregnant (if applicable)?'
  ],
  dizziness: [
    'Does the room spin (vertigo) or do you feel lightheaded?',
    'When did this start?',
    'Any associated hearing loss or ringing in ears?',
    'Do you have any heart conditions or take medications?'
  ],
  chest_pain: [
    'Can you describe the nature of the pain (sharp, dull, pressure)?',
    'Does the pain radiate to your arm, jaw, or back?',
    'Any associated shortness of breath or sweating?',
    'Do you have a history of heart problems?'
  ],
  shortness_of_breath: [
    'When did the breathing difficulty start?',
    'Is it constant or does it come and go?',
    'Any wheezing or chest tightness?',
    'Do you have asthma or other respiratory conditions?'
  ],
  sore_throat: [
    'How severe is the pain (mild, moderate, severe)?',
    'Do you have white patches on your throat or tonsils?',
    'Any difficulty swallowing?',
    'Any fever or swollen lymph nodes?'
  ],
  rash: [
    'Where did the rash start and has it spread?',
    'Is the rash itchy, painful, or neither?',
    'Any associated symptoms like fever or swelling?',
    'Have you been exposed to new soaps, foods, or plants?'
  ],
  back_pain: [
    'Where is the pain located (upper, middle, lower back)?',
    'Did the pain start suddenly or gradually?',
    'Any pain radiating down your legs?',
    'Any numbness, tingling, or weakness in your legs?'
  ]
}

// ============================================
// GENERAL ADVICE RESPONSES
// ============================================

const GENERAL_RESPONSES = {
  greeting: [
    "Hello! I'm Dr. AI, your medical assistant. I'm here to help you understand your symptoms and guide you toward appropriate care.",
    "Hi there! Describe your symptoms, and I'll provide an assessment to help you decide on next steps.",
    "Welcome! I'm here to help with your health concerns. Please tell me about your symptoms."
  ],
  closing: [
    "I hope this information helps. Remember to consult a healthcare professional for proper diagnosis and treatment.",
    "Take care of yourself! Don't hesitate to seek medical attention if symptoms worsen.",
    "Your health is important. Please follow up with a doctor for personalized care."
  ],
  encouraging: [
    "Thank you for sharing. Let me analyze your symptoms...",
    "I understand how you're feeling. Let me provide some guidance...",
    "That's helpful information. Let me help you understand what might be causing this..."
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
    // General health question
    response = generateGeneralResponse(userMessage)
  } else {
    // Symptom-specific response
    response = generateSymptomResponse(symptomData, userMessage)
  }
  
  return response
}

const generateSymptomResponse = (symptomData, userMessage) => {
  let response = ''
  
  // Professional acknowledgment
  response += `**Clinical Assessment**\n\n`
  
  // Top conditions
  const topConditions = symptomData[0]?.conditions.slice(0, 3) || []
  if (topConditions.length > 0) {
    response += `**Likely Diagnosis:**\n`
    topConditions.forEach(condition => {
      response += `• ${condition.name} (${condition.confidence})\n`
    })
    response += `\n`
  }
  
  // Red flags
  response += `**Red Flags - Seek Immediate Care If:**\n`
  const redFlags = symptomData[0]?.emergency || []
  redFlags.slice(0, 3).forEach(flag => {
    response += `• ${flag}\n`
  })
  response += `\n`
  
  // Recommendations
  response += `**Recommendations:**\n`
  const advice = symptomData[0]?.advice || 'Monitor symptoms and rest'
  response += `${advice}\n\n`
  
  // Disclaimer
  response += `---\n⚠️ **Disclaimer:** This is not a medical diagnosis. Please consult a qualified healthcare professional.`
  
  return response
}

const generateGeneralResponse = (userMessage) => {
  const lowerText = userMessage.toLowerCase()
  
  // Check for medication questions
  if (lowerText.includes('medicine') || lowerText.includes('medication') || lowerText.includes('drug')) {
    return `I'm unable to prescribe specific medications. Please consult your physician or pharmacist for medication advice based on your complete medical history.\n\n⚠️ **Important:** Never take medication without professional medical guidance.\n\nFor emergencies, call 102.`
  }
  
  // Check for general health questions
  if (lowerText.includes('healthy') || lowerText.includes('diet') || lowerText.includes('exercise')) {
    return `**General Health Recommendations:**\n• Balanced diet with fruits, vegetables, whole grains\n• Regular exercise (150+ minutes/week)\n• Adequate sleep (7-9 hours)\n• Stay hydrated\n• Stress management\n• Avoid smoking, limit alcohol\n\n⚠️ This is general information, not personalized advice.`
  }
  
  // Check for appointment questions
  if (lowerText.includes('appointment') || lowerText.includes('doctor') || lowerText.includes('see a doctor')) {
    return `**When to See a Doctor:**\n• Symptoms persist > 1 week\n• Worsening despite home care\n• High fever (>103°F)\n• Severe pain or difficulty breathing\n\n**To schedule:** Contact your PCP or visit a walk-in clinic.\n\n**Emergencies: Call 102 immediately.**`
  }
  
  // Default - ask for more details
  return `To provide accurate guidance, please describe:\n• When symptoms started\n• Severity (mild/moderate/severe)\n• Location of any pain\n• Any triggering factors\n\n⚠️ **Disclaimer:** Not a substitute for professional medical advice.`
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
      advice: 'Please describe your symptoms in more detail.',
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
  
  return {
    interactions,
    hasCritical: interactions.some(i => i.severity === 'critical'),
    isFallback: true
  }
}

export default {
  analyzeSymptoms,
  getChatResponse,
  quickSymptomCheck,
  checkDrugInteractions
}
