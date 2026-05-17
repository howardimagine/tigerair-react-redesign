import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

const REPO_NAME = 'tigerair-react-redesign'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
}))
