import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // No externalizar konva, asegurar que se incluya en el bundle
      external: [],
      output: {
        manualChunks: {
          konva: ['konva', 'react-konva']
        }
      }
    },
    commonjsOptions: {
      include: [/konva/, /react-konva/, /node_modules/]
    }
  },
  optimizeDeps: {
    include: ['konva', 'react-konva'],
    exclude: []
  },
  resolve: {
    alias: {
      // Remover el alias problemático y usar la resolución por defecto
    }
  },
  define: {
    global: 'globalThis'
  }
})