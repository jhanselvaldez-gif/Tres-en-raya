import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite publicar el proyecto en GitHub Pages sin cambiar rutas
export default defineConfig({
  plugins: [react()],
  base: './',
})
