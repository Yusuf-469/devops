/**
 * OpenRouter API Verification
 * Run this in browser console to debug Nvidia Nemotron AI issues
 */

const testNemotronAPI = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🔍 Nvidia Nemotron API Verification:')
  console.log('API Key exists:', !!apiKey)
  console.log('API Key starts with:', apiKey?.substring(0, 12) + '...')

  if (!apiKey) {
    console.error('❌ No API key found!')
    return
  }

  try {
    console.log('\n📡 Testing Nvidia Nemotron API chat...')

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          {
            role: "user",
            content: "How many r's are in the word 'strawberry'?"
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
            // Ignore parse errors
          }
        }
      }
    }

    console.log('\n✅ Nvidia Nemotron API test successful!')
    console.log('Full response:', result)
    return result

  } catch (error) {
    console.error('❌ Nvidia Nemotron API test failed:', error.message)
    console.error('Error details:', error)
    return null
  }
}

const testSimpleNemotron = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const baseUrl = 'https://openrouter.ai/api/v1'

  console.log('🤖 Testing simple Nvidia Nemotron response...')

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          {
            role: "user",
            content: "Hello, are you working?"
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const result = data.choices[0]?.message?.content || ''

    console.log('✅ Simple test successful!')
    console.log('Response:', result)
    return result

  } catch (error) {
    console.error('❌ Simple test failed:', error.message)
    return null
  }
}

window.testNemotronAPI = testNemotronAPI
window.testSimpleNemotron = testSimpleNemotron

console.log('🔧 Nvidia Nemotron API test functions loaded:')
console.log('- testNemotronAPI() - Test streaming API call')
console.log('- testSimpleNemotron() - Simple non-streaming test')