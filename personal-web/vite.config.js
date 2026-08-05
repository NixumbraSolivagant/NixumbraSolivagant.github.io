import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

// ── Vite plugin: generates a media manifest (used by App.vue) ─────────────────
function createMediaManifest(mediaDir, base) {
  const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm'])

  return readdir(mediaDir).then(entries => entries
    .filter(file => supported.has(extname(file).toLowerCase()))
    .map(file => ({
      type: ['.mp4', '.webm'].includes(extname(file).toLowerCase()) ? 'video' : 'image',
      src: `${base}static/media/${file}`,
      name: basename(file, extname(file)),
    }))
    .sort((first, second) => first.src.localeCompare(second.src)))
}

function siteArtifactsPlugin(base) {
  const MANIFEST_FILE = 'media-manifest.json'
  const MEDIA_DIR = 'public/static/media'

  // Use process.cwd() — always the project root where npm run/build is invoked
  const projectRoot = process.cwd()
  const distDir = join(projectRoot, 'dist')
  const mediaDir = join(projectRoot, MEDIA_DIR)

  return {
    name: 'site-artifacts',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split('?')[0] !== `${base}${MANIFEST_FILE}`) {
          next()
          return
        }

        try {
          const media = await createMediaManifest(mediaDir, base)
          response.statusCode = 200
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify(media))
        } catch {
          response.statusCode = 500
          response.end('[]')
        }
      })
    },
    async writeBundle() {
      let media
      try {
        media = await createMediaManifest(mediaDir, base)
      } catch {
        return
      }

      await mkdir(distDir, { recursive: true })
      await writeFile(join(distDir, MANIFEST_FILE), JSON.stringify(media, null, 2))
      await copyFile(join(distDir, 'index.html'), join(distDir, '404.html'))
    },
  }
}

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [
      vue(),
      siteArtifactsPlugin(base),
      viteCompression({
        algorithm: 'brotliCompress',
        threshold: 1024,
      }),
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
  }
})
