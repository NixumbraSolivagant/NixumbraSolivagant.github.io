import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import { readdir, writeFile, mkdir } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

// ── Vite plugin: generates a media manifest (used by App.vue) ─────────────────
function mediaManifestPlugin() {
  const MANIFEST_FILE = 'media-manifest.json'
  const MEDIA_DIR = 'public/static/media'

  return {
    name: 'media-manifest',
    async buildStart() {
      const mediaDir = join(__dirname, '..', MEDIA_DIR)
      let entries
      try {
        entries = await readdir(mediaDir)
      } catch {
        return
      }

      const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm'])
      const media = entries
        .filter(f => supported.has(extname(f).toLowerCase()))
        .map(f => ({
          type: ['.mp4', '.webm'].includes(extname(f).toLowerCase()) ? 'video' : 'image',
          src: `/static/media/${f}`,
          name: basename(f, extname(f)),
        }))
        .sort((a, b) => a.src.localeCompare(b.src))

      await mkdir(join(__dirname, '..', 'dist'), { recursive: true })
      await writeFile(
        join(__dirname, '..', 'dist', MANIFEST_FILE),
        JSON.stringify(media, null, 2)
      )
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 1024,
    }),
    mediaManifestPlugin(),
  ],
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
