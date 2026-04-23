import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, '../..'),
  resolve: {
    alias: {
      '@mastery-os/types': resolve(__dirname, '../../packages/types/src/index.ts'),
      '@mastery-os/knowledge-graph': resolve(__dirname, '../../packages/knowledge-graph/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
