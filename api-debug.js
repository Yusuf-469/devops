/**
 * OpenRouter SDK Verification
 * Run this in browser console to debug Qwen AI issues
 */

import { OpenRouter } from "@openrouter/sdk";

const testQwenSDK = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  console.log('🔍 Qwen SDK Verification:')
  console.log('API Key exists:', !!apiKey)
  console.log('API Key starts with:', apiKey?.substring(0, 12) + '...')

  if (!apiKey) {
    console.error('❌ No API key found!')
    return
  }

  try {
    const openrouter = new OpenRouter({
      apiKey: apiKey
    })

    console.log('\n📡 Testing Qwen SDK chat...')

    // Test the exact code you provided
    const stream = await openrouter.chat.send({
      model: "qwen/qwen3.6-plus:free",
      messages: [
        {
          role: "user",
          content: "How many r's are in the word 'strawberry'?"
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
        console.log("\nReasoning tokens:", chunk.usage.reasoningTokens)
      }
    }

    console.log('\n✅ Qwen SDK test successful!')
    console.log('Full response:', response)
    return response

  } catch (error) {
    console.error('❌ Qwen SDK test failed:', error.message)
    console.error('Error details:', error)
    return null
  }
}

const testSimpleQwen = async () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  console.log('🤖 Testing simple Qwen response...')

  try {
    const openrouter = new OpenRouter({
      apiKey: apiKey
    })

    const stream = await openrouter.chat.send({
      model: "qwen/qwen3.6-plus:free",
      messages: [
        {
          role: "user",
          content: "Hello, are you working?"
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
    }

    console.log('\n✅ Simple test successful!')
    return response

  } catch (error) {
    console.error('❌ Simple test failed:', error.message)
    return null
  }
}

window.testQwenSDK = testQwenSDK
window.testSimpleQwen = testSimpleQwen

console.log('🔧 Qwen SDK test functions loaded:')
console.log('- testQwenSDK() - Test the exact code you provided')
console.log('- testSimpleQwen() - Simple hello test')