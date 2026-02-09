/**
 * AI Model Test Script
 * Run this to test your OpenRouter AI integration
 * Usage: node src/test-ai.js
 */

const OPENROUTER_API_KEY = "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"
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

const MEDICAL_SYSTEM_PROMPT = `You are Dr. AI, a board-certified physician with 15+ years of clinical experience. 

RESPONSE STYLE:
- Keep responses concise and actionable (under 150 words)
- Use professional medical terminology while remaining accessible
- Be direct and confident in your assessments

STRUCTURE:
1. Brief acknowledgment
2. Likely diagnosis with confidence level
3. Key red flags to watch for
4. Clear next steps (1-3 items max)

Always include the disclaimer at the end: "This is not a medical diagnosis."`

async function chatWithAI(messages, model = 'openai/gpt-oss-120b:free') {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'HEALIX Test'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
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
          const content = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content
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

  return result
}

async function testAI() {
  console.log("🧪 Testing HEALIX AI Model...\n")
  
  // Test 1: GPT-OSS Model
  console.log("📡 Testing: openai/gpt-oss-120b:free")
  console.log("─".repeat(50))
  
  try {
    console.log("\nResponse (GPT-OSS):\n")
    await chatWithAI([
      { role: "system", content: MEDICAL_SYSTEM_PROMPT },
      { role: "user", content: "I have a headache and fever since yesterday. What could this be?" }
    ], 'openai/gpt-oss-120b:free')
    console.log("\n\n✅ GPT-OSS Model: SUCCESS\n\n")
  } catch (error) {
    console.error("❌ GPT-OSS Model: FAILED", error.message, "\n\n")
  }

  // Test 2: DeepSeek Model
  console.log("📡 Testing: tngtech/deepseek-r1t2-chimera:free")
  console.log("─".repeat(50))
  
  try {
    console.log("\nResponse (DeepSeek):\n")
    await chatWithAI([
      { role: "system", content: MEDICAL_SYSTEM_PROMPT },
      { role: "user", content: "I have been coughing for 3 days with chest congestion. What should I do?" }
    ], 'tngtech/deepseek-r1t2-chimera:free')
    console.log("\n\n✅ DeepSeek Model: SUCCESS\n\n")
  } catch (error) {
    console.error("❌ DeepSeek Model: FAILED", error.message, "\n\n")
  }

  // Test 3: Simple question
  console.log("📡 Testing: Quick response test")
  console.log("─".repeat(50))
  
  try {
    console.log("\nResponse:\n")
    await chatWithAI([
      { role: "user", content: "How many r's are in the word 'strawberry'?" }
    ], 'openai/gpt-oss-120b:free')
    console.log("\n\n✅ Quick Test: SUCCESS\n")
  } catch (error) {
    console.error("❌ Quick Test: FAILED", error.message, "\n")
  }
}

testAI()
