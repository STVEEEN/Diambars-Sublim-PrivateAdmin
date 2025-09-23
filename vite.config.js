import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Usar solo esbuild para evitar problemas de Rollup
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    // Deshabilitar Rollup completamente
    rollupOptions: undefined
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
  },
  // Configuración específica para evitar problemas de Rollup en Vercel
  esbuild: {
    target: 'esnext'
  }
})