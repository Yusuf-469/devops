import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '', '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true
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
      // Ensure env variables are inlined
      define: {
        'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(env.VITE_OPENROUTER_API_KEY || ''),
        'import.meta.env.VITE_EMERGENCY_NUMBER': JSON.stringify(env.VITE_EMERGENCY_NUMBER || '102'),
        'import.meta.env.VITE_HELP_NUMBER': JSON.stringify(env.VITE_HELP_NUMBER || '7903810922')
      }
    },
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion']
    }
  }
})