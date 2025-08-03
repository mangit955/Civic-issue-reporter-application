import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://civic-issue-reporter-application.onrender.com',
    },
  },
  plugins: [
    tailwindcss(),
  ],
})