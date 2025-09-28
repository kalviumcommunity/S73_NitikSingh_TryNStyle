import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { animate, keyframes } from 'framer-motion'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        'fade-in' : {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
      },
      animate: {
        'fade-in' : 'fade-in 0.5s ease-out forwards'
      },
    },
  },
  plugins: [react(),  tailwindcss()],
})
