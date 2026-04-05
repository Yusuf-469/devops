#!/usr/bin/env node

/**
 * Local Development API Server
 * Simulates Vercel serverless functions for development
 */

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('🧪 Local API: Chat request received')

    // Check for API key
    if (!OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY not set')
      return res.status(500).json({
        error: 'Server configuration error: OPENROUTER_API_KEY not set. Run: export OPENROUTER_API_KEY=your_key_here'
      })
    }

    const { messages, model = 'nvidia/nemotron-3-super-120b-a12b:free', stream = false } = req.body

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' })
    }

    console.log(`🤖 Local API: ${model}, messages: ${messages.length}, stream: ${stream}`)

    // Make request to OpenRouter
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HEALIX Medical Dashboard'
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        temperature: 0.7,
        max_tokens: stream ? undefined : 1000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`🚫 OpenRouter API Error: ${response.status} - ${errorText}`)

      let errorMessage = 'AI service temporarily unavailable.'
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Check your OPENROUTER_API_KEY environment variable.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      }

      return res.status(response.status).json({ error: errorMessage })
    }

    // Handle streaming
    if (stream) {
      console.log('🌊 Local API: Streaming response')
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        res.write(chunk)
      }

      res.end()
      return
    }

    // Handle regular response
    const data = await response.json()
    console.log('✅ Local API: Response successful')

    res.json({
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      model: data.model,
      usage: data.usage
    })

  } catch (error) {
    console.error('💥 Local API server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`)
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`)
  console.log(`🔑 API Key configured: ${OPENROUTER_API_KEY ? '✅' : '❌'}`)

  if (!OPENROUTER_API_KEY) {
    console.log('')
    console.log('⚠️  To enable AI functionality:')
    console.log('   export OPENROUTER_API_KEY=your_api_key_here')
    console.log('   Get your key from: https://openrouter.ai/keys')
  }
})