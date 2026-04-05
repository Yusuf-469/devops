/**
 * Test OpenRouter API Integration
 * Run this in browser console to test the API implementation
 */

const testAPIConnection = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🔑 Testing OpenRouter API...')
  console.log('API Key exists:', !!apiKey)

  if (!apiKey) {
    console.error('❌ No API key found in environment')
    return
  }

  try {
    console.log('📡 Testing simple chat completion...')

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-plus:free",
        messages: [
          {
            role: "user",
            content: "Hello, can you confirm you're working?"
          }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    console.log('✅ API connection successful!')
    console.log('Response:', data.choices[0]?.message?.content)

    return data

  } catch (error) {
    console.error('❌ API connection failed:', error.message)
    console.error('Error details:', error)
    return null
  }
}

const testStreamingChat = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🌊 Testing streaming chat...')

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
        model: "qwen/qwen3.6-plus:free",
        messages: [
          {
            role: "user",
            content: "Count how many r's are in 'strawberry' and explain briefly."
          }
        ],
        stream: true,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    // Handle streaming response
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ''

            if (content) {
              result += content
              process.stdout.write(content)
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }

    console.log('\n✅ Streaming test completed!')
    return result

  } catch (error) {
    console.error('❌ Streaming test failed:', error.message)
    return null
  }
}

window.testAPIConnection = testAPIConnection
window.testStreamingChat = testStreamingChat

console.log('API test functions loaded:')
console.log('- testAPIConnection() - Test basic API connection')
console.log('- testStreamingChat() - Test streaming chat functionality')