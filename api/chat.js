// Vercel Serverless Function (Edge runtime) for HEALIX AI chat.
// The browser calls POST /api/chat. This function adds the OpenRouter key,
// which exists only in server-side env (OPENROUTER_API_KEY), and forwards the
// request. The key is never sent to the client.

export const config = { runtime: 'edge' }

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Only models we choose can be used, so callers can't pick an expensive one.
const ALLOWED_MODELS = new Set(['openrouter/free'])
const DEFAULT_MODEL = 'openrouter/free'

// Request limits: keep prompts small so nobody can burn credits with huge inputs.
const MAX_MESSAGES = 40
const MAX_TOTAL_CHARS = 24000
const ALLOWED_ROLES = new Set(['system', 'user', 'assistant'])

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  })

export default async function handler(request) {
  // The frontend is served from the same origin, so no CORS headers are needed.
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY is not configured on the server')
    return json({ error: 'AI service is not configured.' }, 500)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const { messages, model = DEFAULT_MODEL } = body || {}

  // Validate input before spending anything on the upstream API.
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'messages must be a non-empty array.' }, 400)
  }
  if (messages.length > MAX_MESSAGES) {
    return json({ error: 'Too many messages in one request.' }, 413)
  }
  let totalChars = 0
  for (const m of messages) {
    if (!m || !ALLOWED_ROLES.has(m.role) || typeof m.content !== 'string') {
      return json({ error: 'Each message needs a valid role and string content.' }, 400)
    }
    totalChars += m.content.length
  }
  if (totalChars > MAX_TOTAL_CHARS) {
    return json({ error: 'Request is too large.' }, 413)
  }
  if (!ALLOWED_MODELS.has(model)) {
    return json({ error: 'Model not allowed.' }, 400)
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({ model, messages, stream: false, temperature: 0.7, max_tokens: 1000 })
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      console.error(`OpenRouter error ${upstream.status}: ${detail.slice(0, 300)}`)
      if (upstream.status === 429) {
        return json({ error: 'AI service is busy. Please try again shortly.' }, 429)
      }
      return json({ error: 'AI service temporarily unavailable.' }, 502)
    }

    const data = await upstream.json()
    return json({
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      model: data.model
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return json({ error: 'Internal server error.' }, 500)
  }
}
