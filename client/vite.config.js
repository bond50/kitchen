import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../server', // Loading .env from the server directory
  define: {
    // Only define environment variables you need for the client-side app
    'process.env.CLIENT_ENV': JSON.stringify(process.env.VITE_CLIENT_ENV || 'development'), // Handling custom client environment
  },
})
