import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const repoRoot = fileURLToPath(new URL('.', import.meta.url))
const kitEntry = fileURLToPath(new URL('./src/index.ts', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'aether-kit': kitEntry,
    },
  },
  test: {
    root: repoRoot,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'catalog/**/*.test.{ts,tsx}'],
  },
})
