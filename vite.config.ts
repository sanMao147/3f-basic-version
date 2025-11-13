import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
  base: '/3f-basic-version/',
  plugins: [react(), tailwindcss()],
})
