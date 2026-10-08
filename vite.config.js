import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '', '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      // /api/chat is a Vercel function. For local dev, run `vercel dev` (port 3001 below)
      // alongside `npm run dev`, or override with VITE_API_PROXY.
      proxy: {
        '/api': env.VITE_API_PROXY || 'http://localhost:3001'
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      // Only public, non-secret values are inlined into the client bundle
      define: {
        'import.meta.env.VITE_EMERGENCY_NUMBER': JSON.stringify(env.VITE_EMERGENCY_NUMBER || '102'),
        'import.meta.env.VITE_HELP_NUMBER': JSON.stringify(env.VITE_HELP_NUMBER || '7903810922')
      }
    },
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion']
    }
  }
})