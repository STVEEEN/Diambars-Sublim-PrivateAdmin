import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://expo2025-8bjn.onrender.com', // cambiar a http://localhost:4000 para desarrollo
        changeOrigin: true,
        secure: true, // cambiar a false para desarrollo
      }
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  optimizeDeps: {
    include: ['konva', 'react-konva']
  },
  define: {
    global: 'globalThis'
  }
})