// Simple test for fallback AI
import { analyzeSymptoms } from './src/services/fallbackAI.js'

console.log('Testing fallback AI...')

analyzeSymptoms('I have fever and headache').then(result => {
  console.log('Fallback AI result:', result)
}).catch(error => {
  console.error('Fallback AI error:', error)
})