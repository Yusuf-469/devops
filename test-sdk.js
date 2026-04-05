/**
 * Test OpenRouter SDK Integration
 * Run this in browser console to test the new SDK implementation
 */

import { OpenRouter } from "@openrouter/sdk";

const testSDKConnection = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  console.log('🔑 Testing OpenRouter SDK...')
  console.log('API Key exists:', !!apiKey)

  if (!apiKey) {
    console.error('❌ No API key found in environment')
    return
  }

  try {
    const openrouter = new OpenRouter({
      apiKey: apiKey
    })

    console.log('📡 Testing simple chat completion...')

    const completion = await openrouter.chat.completions.create({
      model: "qwen/qwen3.6-plus:free",
      messages: [
        {
          role: "user",
          content: "Hello, can you confirm you're working?"
        }
      ]
    })

    console.log('✅ SDK connection successful!')
    console.log('Response:', completion.choices[0]?.message?.content)

    return completion

  } catch (error) {
    console.error('❌ SDK connection failed:', error.message)
    console.error('Error details:', error)
    return null
  }
}

const testStreamingChat = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  console.log('🌊 Testing streaming chat...')

  try {
    const openrouter = new OpenRouter({
      apiKey: apiKey
    })

    const stream = await openrouter.chat.completions.create({
      model: "qwen/qwen3.6-plus:free",
      messages: [
        {
          role: "user",
          content: "Count how many r's are in 'strawberry' and explain briefly."
        }
      ],
      stream: true
    })

    let response = ""
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        response += content
        process.stdout.write(content)
      }

      if (chunk.usage) {
        console.log("\n📊 Reasoning tokens:", chunk.usage.reasoningTokens)
      }
    }

    console.log('\n✅ Streaming test completed!')
    return response

  } catch (error) {
    console.error('❌ Streaming test failed:', error.message)
    return null
  }
}

window.testSDKConnection = testSDKConnection
window.testStreamingChat = testStreamingChat

console.log('SDK test functions loaded:')
console.log('- testSDKConnection() - Test basic SDK connection')
console.log('- testStreamingChat() - Test streaming chat functionality')