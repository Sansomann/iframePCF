import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev: base is './' (relative, works locally).
// In CI/GH Pages build: VITE_BASE_URL is set to '/iframePCF/jet-landing/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL ?? './',
  build: {
    target: 'es2020',
  },
})
