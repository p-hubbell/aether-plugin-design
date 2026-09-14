import { fileURLToPath, URL } from 'node:url'

const kitEntry = fileURLToPath(new URL('./src/index.ts', import.meta.url))

/** Loaded by Ladle’s Vite 6. Do not add @vitejs/plugin-react — Ladle ships its own. */
export default {
  resolve: {
    alias: {
      'aether-kit': kitEntry,
    },
  },
}
