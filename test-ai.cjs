/**
 * HEALIX AI Model Test Script
 * Run with: node test-ai.cjs
 */

const https = require('https')

// Configuration
const API_KEY = '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'
const MODEL = 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free'
const BASE_URL = 'api.openrouter.ai'

console.log('🩺 HEALIX AI Model Test')
console.log('='.repeat(40))
console.log(`Model: ${MODEL}`)
console.log(`API: ${BASE_URL}`)
console.log('')

// Test 1: Simple API Connection
console.log('🧪 Test 1: API Connection')
const test1Data = JSON.stringify({
  model: MODEL,
  messages: [
    { role: 'system', content: 'You are Dr. AI, a medical assistant. Reply with just "OK" to confirm you are working.' },
    { role: 'user', content: 'Hello' }
  ],
  max_tokens: 50
})

const test1Options = {
  hostname: BASE_URL,
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'HEALIX Medical Dashboard',
    'Content-Length': Buffer.byteLength(test1Data)
  }
}

const test1Req = https.request(test1Options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data)
      if (res.statusCode === 200 && parsed.choices) {
        console.log('✅ API Connection: SUCCESS')
        console.log(`📄 Response: ${parsed.choices[0].message.content}`)
      } else {
        console.log('❌ API Connection: FAILED')
        console.log(`📄 Error: ${JSON.stringify(parsed)}`)
      }
    } catch (e) {
      console.log('❌ API Connection: PARSE ERROR')
      console.log(`📄 Raw: ${data}`)
    }
    console.log('')

    // Test 2: Medical Symptom Analysis
    console.log('🧪 Test 2: Medical Symptom Analysis')
    const test2Data = JSON.stringify({
      model: MODEL,
      messages: [
        { 
          role: 'system', 
          content: `You are Dr. AI, a medical assistant. 
Format your response:
1. Assessment: Brief summary
2. Possible Causes: List 2-3 conditions
3. Recommended Actions: Next steps
4. Disclaimer: Include medical disclaimer` 
        },
        { role: 'user', content: 'I have fever of 101°F and headache for 2 days' }
      ],
      max_tokens: 300,
      temperature: 0.7
    })

    const test2Options = {
      hostname: BASE_URL,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HEALIX Medical Dashboard',
        'Content-Length': Buffer.byteLength(test2Data)
      }
    }

    const test2Req = https.request(test2Options, (res2) => {
      let data2 = ''
      res2.on('data', chunk => data2 += chunk)
      res2.on('end', () => {
        try {
          const parsed2 = JSON.parse(data2)
          if (res2.statusCode === 200 && parsed2.choices) {
            console.log('✅ Symptom Analysis: SUCCESS')
            console.log(`📄 Response:\n${parsed2.choices[0].message.content}`)
          } else {
            console.log('❌ Symptom Analysis: FAILED')
            console.log(`📄 Error: ${JSON.stringify(parsed2)}`)
          }
        } catch (e) {
          console.log('❌ Symptom Analysis: PARSE ERROR')
          console.log(`📄 Raw: ${data2}`)
        }
        console.log('')
        console.log('='.repeat(40))
        console.log('💡 Tests complete!')
        console.log('💡 Open http://localhost:3000 to try the full dashboard')
      })
    })

    test2Req.on('error', (e) => {
      console.log('❌ Symptom Analysis: REQUEST ERROR')
      console.log(`📄 ${e.message}`)
    })

    test2Req.write(test2Data)
    test2Req.end()
  })
})

test1Req.on('error', (e) => {
  console.log('❌ API Connection: REQUEST ERROR')
  console.log(`📄 ${e.message}`)
  console.log('')
  console.log('💡 If API fails, the fallback offline AI will be used automatically')
  console.log('💡 The dashboard works completely offline with local medical knowledge')
})

test1Req.write(test1Data)
test1Req.end()
