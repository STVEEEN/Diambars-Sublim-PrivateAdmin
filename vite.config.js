import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Backend local para desarrollo
        changeOrigin: true,
        secure: false, // false para desarrollo local
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