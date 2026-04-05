/**
 * OpenRouter API Key Verification
 * Run this in browser console to debug API key issues
 */

const verifyAPIKey = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🔍 API Key Verification:')
  console.log('API Key exists:', !!apiKey)
  console.log('API Key starts with:', apiKey?.substring(0, 12) + '...')
  console.log('API Key length:', apiKey?.length)

  if (!apiKey) {
    console.error('❌ No API key found!')
    return
  }

  try {
    // Test 1: Auth endpoint
    console.log('\n📡 Testing auth endpoint...')
    const authResponse = await fetch(`${baseUrl}/auth/key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    console.log('Auth response status:', authResponse.status)

    if (authResponse.ok) {
      const authData = await authResponse.json()
      console.log('✅ Auth successful:', authData)
    } else {
      const authError = await authResponse.text()
      console.error('❌ Auth failed:', authResponse.status, authError)
    }

    // Test 2: Simple completion
    console.log('\n🤖 Testing chat completion...')
    const chatResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-plus:free",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10
      })
    })

    console.log('Chat response status:', chatResponse.status)

    if (chatResponse.ok) {
      const chatData = await chatResponse.json()
      console.log('✅ Chat successful:', chatData.choices[0]?.message?.content)
    } else {
      const chatError = await chatResponse.text()
      console.error('❌ Chat failed:', chatResponse.status, chatError)
    }

  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

window.verifyAPIKey = verifyAPIKey
console.log('🔧 API verification function loaded. Run verifyAPIKey() to test your API key.')