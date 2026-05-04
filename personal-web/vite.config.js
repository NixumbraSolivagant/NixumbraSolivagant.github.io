import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router'],
          'vendor-md': ['markdown-it', 'markdown-it-katex', 'highlight.js', 'katex', 'vue3-markdown-it'],
          'vendor-ui': ['buefy', 'bulma'],
        },
      },
    },
  },
})
