import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Make the server accessible from any device on the network
    port: 5173,        // Keep the same port or change if needed
  },
  build: {
    outDir: "dist",   // Ensure correct build output
  },
  base: "/", // Important for Vercel to properly handle routing
});