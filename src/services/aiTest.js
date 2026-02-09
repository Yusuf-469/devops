/**
 * HEALIX AI Model Test Suite
 * Tests the dolphin-mistral-24b model and fallback scenarios
 */

import { getActiveAIConfig } from '../store/index.js'
import { chatWithAI } from './deepseek.js'
import { analyzeSymptoms, quickSymptomCheck, checkDrugInteractions } from './fallbackAI.js'

// Test configuration
const CONFIG = getActiveAIConfig()
console.log('🔧 Current AI Configuration:')
console.log(`   Provider: ${CONFIG.baseUrl.includes('openrouter') ? 'OpenRouter' : 'DeepSeek'}`)
console.log(`   Model: ${CONFIG.model}`)
console.log('')

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Fallback AI - Fever Symptoms',
    test: async () => {
      console.log('🧪 Testing: Fallback AI - Fever Symptoms')
      const result = await analyzeSymptoms('I have fever and headache')
      console.log(`   ✅ Success: ${result.success}`)
      console.log(`   📄 Response length: ${result.content.length} chars`)
      console.log(`   🔄 Is Fallback: ${result.isFallback}`)
      return result.success
    }
  },
  {
    name: 'Fallback AI - Cough Analysis',
    test: async () => {
      console.log('🧪 Testing: Fallback AI - Cough Analysis')
      const result = await analyzeSymptoms('I have been coughing for 3 days')
      console.log(`   ✅ Success: ${result.success}`)
      console.log(`   📄 Contains conditions: ${result.content.includes('Cold') || result.content.includes('Bronchitis')}`)
      return result.success
    }
  },
  {
    name: 'Quick Symptom Check - Headache',
    test: async () => {
      console.log('🧪 Testing: Quick Symptom Check - Headache')
      const result = quickSymptomCheck('headache')
      console.log(`   ✅ Has conditions: ${result.conditions.length > 0}`)
      console.log(`   💊 Has advice: ${result.advice.length > 0}`)
      return result.conditions.length > 0
    }
  },
  {
    name: 'Quick Symptom Check - Stomach Pain',
    test: async () => {
      console.log('🧪 Testing: Quick Symptom Check - Stomach Pain')
      const result = quickSymptomCheck('stomach pain')
      console.log(`   ✅ Has conditions: ${result.conditions.length > 0}`)
      console.log(`   🚨 Has emergency keywords: ${result.emergency?.length > 0}`)
      return result.conditions.length > 0
    }
  },
  {
    name: 'Drug Interaction Check',
    test: async () => {
      console.log('🧪 Testing: Drug Interaction Check')
      const currentMeds = ['Warfarin', 'Aspirin']
      const newMed = 'Ibuprofen'
      const result = await checkDrugInteractions(currentMeds, newMed)
      console.log(`   ✅ Has interactions: ${result.interactions.length > 0}`)
      console.log(`   🚨 Has critical: ${result.hasCritical}`)
      return result.interactions.length > 0 || result.hasCritical === false
    }
  },
  {
    name: 'API Connection Test (Dolphin-Mistral)',
    test: async () => {
      console.log('🧪 Testing: API Connection - Dolphin-Mistral-24B')
      try {
        const result = await chatWithAI(
          [{ role: 'user', content: 'Hello' }],
          'You are a helpful medical assistant. Reply with just "OK".',
          () => {}
        )
        console.log(`   ✅ API Success: ${result.success}`)
        console.log(`   🔄 Is Fallback: ${result.isFallback}`)
        if (result.success) {
          console.log(`   📄 Response: ${result.content.substring(0, 100)}...`)
        }
        return result.success
      } catch (error) {
        console.log(`   ❌ API Error: ${error.message}`)
        return false
      }
    }
  },
  {
    name: 'Medical System Prompt Test',
    test: async () => {
      console.log('🧪 Testing: Medical System Prompt')
      const medicalPrompt = `You are Dr. AI, a highly trained medical assistant.
Reply with:
1. Assessment
2. Possible Causes
3. Recommended Actions
4. Self-Care Tips
5. Disclaimer`

      const result = await chatWithAI(
        [{ role: 'user', content: 'I have fever and body aches' }],
        medicalPrompt,
        () => {}
      )

      console.log(`   ✅ Success: ${result.success}`)
      console.log(`   📄 Has sections: ${result.content.includes('Assessment')}`)
      return result.success && result.content.includes('Assessment')
    }
  }
]

// Run all tests
const runTests = async () => {
  console.log('='.repeat(50))
  console.log('🩺 HEALIX AI Model Test Suite')
  console.log('='.repeat(50))
  console.log('')

  let passed = 0
  let failed = 0

  for (const scenario of TEST_SCENARIOS) {
    try {
      const result = await scenario.test()
      if (result) {
        passed++
        console.log(`   ✅ PASSED\n`)
      } else {
        failed++
        console.log(`   ❌ FAILED\n`)
      }
    } catch (error) {
      failed++
      console.log(`   ❌ ERROR: ${error.message}\n`)
    }
  }

  console.log('='.repeat(50))
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`)
  console.log('='.repeat(50))
  console.log('')
  console.log('💡 Tips:')
  console.log('   - API tests require internet connection')
  console.log('   - Fallback tests work offline')
  console.log('   - If API fails, fallback AI is used automatically')
  console.log('')

  return { passed, failed }
}

// Export for use in browser console
window.runAITests = runTests
window.testFallback = () => analyzeSymptoms('I have headache and fever')
window.testQuickCheck = (symptom) => quickSymptomCheck(symptom)
window.testDrugInteractions = () => checkDrugInteractions(['Warfarin'], 'Ibuprofen')

export { runTests, TEST_SCENARIOS }
