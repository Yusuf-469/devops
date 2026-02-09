/**
 * AI Model Test Script
 * Test Upstage Solar Pro with new API key
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

async function chatWithAI(messages, model = 'upstage/solar-pro-3:free') {
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
  console.log("🧪 Testing Upstage Solar Pro AI...\n")
  
  console.log("📡 Testing: upstage/solar-pro-3:free")
  console.log("─".repeat(50))
  
  try {
    console.log("\nResponse:\n")
    await chatWithAI([
      { role: "system", content: MEDICAL_SYSTEM_PROMPT },
      { role: "user", content: "I have a headache and fever since yesterday. What could this be?" }
    ], 'upstage/solar-pro-3:free')
    console.log("\n\n✅ Upstage Solar Pro: SUCCESS\n")
  } catch (error) {
    console.error("❌ Upstage Solar Pro: FAILED", error.message, "\n")
  }
}

testAI()
