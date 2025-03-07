import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Make the server accessible from any device on the network
    port: 5173,        // Keep the same port or change if needed
  },
})
