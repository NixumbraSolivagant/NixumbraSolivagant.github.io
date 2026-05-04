import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/') || id.includes('node_modules/vue-router/')) return 'vendor-vue'
          if (id.includes('node_modules/three/')) return 'vendor-three'
          if (id.includes('node_modules/markdown-it') || id.includes('node_modules/katex') || id.includes('node_modules/highlight.js')) return 'vendor-md'
        },
      },
    },
  },
})
