/**
 * Test OpenRouter API Key
 * Run this in browser console to verify API key works
 */

const testAPIKey = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🔑 Testing API Key...')
  console.log('API Key exists:', !!apiKey)
  console.log('API Key length:', apiKey?.length || 0)

  if (!apiKey) {
    console.error('❌ No API key found')
    return
  }

  try {
    const response = await fetch(`${baseUrl}/auth/key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Auth check response:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Key valid!')
      console.log('Account data:', data)
    } else {
      const error = await response.text()
      console.error('❌ API Key invalid:', response.status, error)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

const testChatCompletion = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🤖 Testing Chat Completion...')

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-plus:free',
        messages: [
          { role: 'user', content: 'Hello, just testing the API' }
        ],
        max_tokens: 50
      })
    })

    console.log('Chat completion response:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Chat completion successful!')
      console.log('Response:', data.choices[0]?.message?.content)
    } else {
      const error = await response.text()
      console.error('❌ Chat completion failed:', response.status, error)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

window.testAPIKey = testAPIKey
window.testChatCompletion = testChatCompletion

console.log('API test functions loaded. Run:')
console.log('- testAPIKey() to check if API key is valid')
console.log('- testChatCompletion() to test chat functionality')