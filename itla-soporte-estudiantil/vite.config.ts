import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // Servidor PHP incorporado (sin XAMPP)
        changeOrigin: true,
        secure: false,
        ws: false,
        // No necesita rewrite porque el servidor PHP ya maneja /api
      },
    },
  },
})
