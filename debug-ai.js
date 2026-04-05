/**
 * Debug AI functionality
 * Run this in browser console to test AI
 */

// Test primary AI
window.testPrimaryAI = async () => {
  console.log('Testing Primary AI...')
  try {
    const { analyzeSymptoms } = await import('./src/services/qwen.js')
    const result = await analyzeSymptoms('I have fever and headache', [], (content) => {
      console.log('Streaming:', content)
    })
    console.log('Primary AI Result:', result)
    return result
  } catch (error) {
    console.error('Primary AI Error:', error)
    return null
  }
}

// Test fallback AI
window.testFallbackAI = async () => {
  console.log('Testing Fallback AI...')
  try {
    const { analyzeSymptoms } = await import('./src/services/fallbackAI.js')
    const result = await analyzeSymptoms('I have fever and headache', [], (content) => {
      console.log('Streaming:', content)
    })
    console.log('Fallback AI Result:', result)
    return result
  } catch (error) {
    console.error('Fallback AI Error:', error)
    return null
  }
}

// Test environment variables
window.checkEnv = () => {
  console.log('Environment check:')
  console.log('VITE_OPENROUTER_API_KEY:', import.meta.env.VITE_OPENROUTER_API_KEY ? 'Set' : 'Not set')
  console.log('API Key length:', import.meta.env.VITE_OPENROUTER_API_KEY?.length || 0)
}

// Run all tests
window.runDebugTests = async () => {
  console.log('='.repeat(50))
  console.log('🔧 HEALIX AI DEBUG TESTS')
  console.log('='.repeat(50))

  checkEnv()
  console.log('')

  const primary = await testPrimaryAI()
  console.log('')

  if (!primary || !primary.success) {
    const fallback = await testFallbackAI()
    console.log('')

    if (!fallback || !fallback.success) {
      console.log('❌ Both AI systems failed, using hardcoded responses')
    }
  }

  console.log('='.repeat(50))
}

console.log('Debug functions loaded. Run runDebugTests() to start testing.')