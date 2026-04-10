// Vercel Serverless Function for HEALIX AI Chat
// This runs on the server side, keeping the API key secure

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// CORS headers - will be made dynamic based on request origin

// Single handler for both OPTIONS and POST requests
export default async function handler(request) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '*'
  
  // Enhanced CORS headers that include dynamic origin
  const dynamicCorsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  }

  // Handle CORS preflight requests - respond immediately with proper headers
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: dynamicCorsHeaders
    })
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...dynamicCorsHeaders
        }
      }
    )
  }

  try {
  try {
    // Validate API key exists on server
    if (!OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY not configured on server')
      return new Response(
        JSON.stringify({
          error: 'Server configuration error: missing OpenRouter API key'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...dynamicCorsHeaders
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { messages, model = 'openrouter/free', stream = false } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...dynamicCorsHeaders
          }
        }
      )
    }

    console.log(`🤖 AI Request: ${model}, messages: ${messages.length}, stream: ${stream}`)

    // Prepare OpenRouter request
    const openRouterPayload = {
      model,
      messages,
      stream,
      temperature: 0.7,
      max_tokens: stream ? undefined : 1000
    }

    // Make request to OpenRouter from server
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': request.headers.get('referer') || 'https://healix.vercel.app',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify(openRouterPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`🚫 OpenRouter API Error: ${response.status} - ${errorText}`)

      // Handle specific error codes with user-friendly messages
      let errorMessage = 'AI service temporarily unavailable. Please try again.'
      let statusCode = 503

      if (response.status === 401) {
        errorMessage = 'Server authentication with AI provider failed. Check your OpenRouter API key.'
        statusCode = 500
      } else if (response.status === 429) {
        errorMessage = 'AI service rate limit exceeded. Please try again later.'
        statusCode = 429
      } else if (response.status === 400) {
        errorMessage = 'Invalid request to AI service.'
        statusCode = 400
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: statusCode,
          headers: {
            'Content-Type': 'application/json',
            ...dynamicCorsHeaders
          }
        }
      )
    }

    // Handle streaming response
    if (stream && response.body) {
      console.log('🌊 Returning streaming response')

      // For Vercel, we need to return the response directly
      // since TransformStream might not work in all environments
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...dynamicCorsHeaders
        }
      })
    }

    // Handle non-streaming response
    const data = await response.json()
    console.log('✅ AI Response successful')

    return new Response(
      JSON.stringify({
        success: true,
        content: data.choices?.[0]?.message?.content || '',
        model: data.model,
        usage: data.usage
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    )

  } catch (error) {
    console.error('💥 Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...dynamicCorsHeaders
        }
      }
    )
  }
}