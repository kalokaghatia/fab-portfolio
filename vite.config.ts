/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

/*
 * Foto importate con `?responsive`: in build diventano WebP in più larghezze (mai oltre
 * l'originale), così il browser scarica quella adatta allo spazio in cui la mostra.
 */
const responsiveWidths = [360, 480, 640, 800, 1080, 1440]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: async (url, metadata) => {
        if (!url.searchParams.has('responsive')) return new URLSearchParams()
        const directives = new URLSearchParams({ format: 'webp', as: 'img' })
        const { width } = await metadata()
        if (width) {
          directives.set('w', [...responsiveWidths.filter((w) => w < width), width].join(';'))
        }
        return directives
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
  },
})
