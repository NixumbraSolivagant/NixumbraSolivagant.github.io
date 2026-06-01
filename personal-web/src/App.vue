<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showNav = computed(() => route.path !== '/')

// ===== 全局背景轮播 =====
// 改为延迟加载：只预加载下一张，不预加载全部
const backgroundMedia = ref([])
const currentBgIndex = ref(0)
let bgTimer = null

// 双层 DOM 节点引用
const layerA = ref(null)  // 当前显示层
const layerB = ref(null)  // 下一张层
let activeLayer = 'A'

// 亮度缓存
const luminanceCache = new Map()

// 缓存已加载的图片，避免重复请求
const loadedImages = new Set()

// 只预加载下一张图片，而不是全部
const preloadNextImage = () => {
  if (!backgroundMedia.value.length) return
  const nextIndex = (currentBgIndex.value + 1) % backgroundMedia.value.length
  const nextMedia = backgroundMedia.value[nextIndex]
  if (!nextMedia || nextMedia.type === 'video' || loadedImages.has(nextMedia.src)) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = nextMedia.src
  loadedImages.add(nextMedia.src)
}

const detectLuminance = (imageUrl) => {
  if (luminanceCache.has(imageUrl)) return Promise.resolve(luminanceCache.get(imageUrl))

  const img = new Image()
  img.crossOrigin = 'anonymous'

  return new Promise(resolve => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(false); return }
      const size = 40
      canvas.width = size
      canvas.height = size
      ctx.drawImage(img, 0, 0, size, size)
      const { data } = ctx.getImageData(0, 0, size, size)
      let total = 0
      for (let i = 0; i < data.length; i += 4) {
        total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      }
      const brightness = total / (data.length / 4)
      const isDark = brightness < 140
      luminanceCache.set(imageUrl, isDark)
      resolve(isDark)
    }
    img.onerror = () => resolve(false)
    img.src = imageUrl
  })
}

const applyTheme = (isDark) => {
  const root = document.documentElement
  if (isDark) {
    root.style.setProperty('--main_text_color', '#f8fafc')
    root.style.setProperty('--item_left_title_color', '#f8fafc')
    root.style.setProperty('--item_left_text_color', '#e2e8f0')
    root.style.setProperty('--footer_text_color', '#e2e8f0')
    root.style.setProperty('--fill', '#ffffff')
    root.style.setProperty('--text_bg_color', 'rgba(0, 0, 0, 0.45)')
    root.style.setProperty('--item_bg_color', 'rgba(15, 23, 42, 0.52)')
    root.style.setProperty('--item_hover_color', 'rgba(15, 23, 42, 0.65)')
    root.style.setProperty('--left_tag_item', 'rgba(15, 23, 42, 0.55)')
    root.style.setProperty('--back_filter_color', 'rgba(0, 0, 0, 0.35)')
    root.style.setProperty('--card_stroke_color', 'rgba(255, 255, 255, 0.2)')
    root.style.setProperty('--accent', '#38bdf8')
    root.style.setProperty('--accent_strong', '#7dd3fc')
  } else {
    root.style.setProperty('--main_text_color', '#111827')
    root.style.setProperty('--item_left_title_color', '#111827')
    root.style.setProperty('--item_left_text_color', '#4b5563')
    root.style.setProperty('--footer_text_color', '#374151')
    root.style.setProperty('--fill', '#111827')
    root.style.setProperty('--text_bg_color', 'rgba(255, 255, 255, 0.7)')
    root.style.setProperty('--item_bg_color', 'rgba(255, 255, 255, 0.72)')
    root.style.setProperty('--item_hover_color', 'rgba(255, 255, 255, 0.85)')
    root.style.setProperty('--left_tag_item', 'rgba(255, 255, 255, 0.7)')
    root.style.setProperty('--back_filter_color', 'rgba(255, 255, 255, 0.2)')
    root.style.setProperty('--card_stroke_color', 'rgba(148, 163, 184, 0.18)')
    root.style.setProperty('--accent', '#38bdf8')
    root.style.setProperty('--accent_strong', '#0284c7')
  }
}

const switchToBg = async (media) => {
  const video = document.getElementById('background-video')

  if (media.type === 'video') {
    if (video) {
      video.style.display = 'block'
      if (video.getAttribute('src') !== media.src) {
        video.setAttribute('src', media.src)
        video.load()
      }
      video.play().catch(() => {})
    }
    applyTheme(false)
    preloadNextImage()
    return
  }

  if (video) { video.pause(); video.style.display = 'none' }

  const targetLayer = activeLayer === 'A' ? layerB.value : layerA.value
  if (!targetLayer) return

  targetLayer.style.backgroundImage = `url(${media.src})`
  targetLayer.style.opacity = '0'

  await new Promise(r => requestAnimationFrame(r))
  targetLayer.style.opacity = '1'

  const oldLayer = activeLayer === 'A' ? layerA.value : layerB.value
  if (oldLayer) oldLayer.style.opacity = '0'

  activeLayer = activeLayer === 'A' ? 'B' : 'A'

  const isDark = await detectLuminance(media.src)
  applyTheme(isDark)

  // 切换完成后预加载下一张
  preloadNextImage()
}

const startBgRotation = () => {
  if (!backgroundMedia.value.length) return
  const first = backgroundMedia.value[currentBgIndex.value]
  if (first) {
    if (layerA.value) layerA.value.style.backgroundImage = `url(${first.src})`
    loadedImages.add(first.src)
    if (first.type === 'image') detectLuminance(first.src).then(applyTheme)
    else applyTheme(false)
    // 只预加载当前这张和下一张
    preloadNextImage()
  }
  bgTimer = window.setInterval(() => {
    let nextIndex
    do {
      nextIndex = Math.floor(Math.random() * backgroundMedia.value.length)
    } while (nextIndex === currentBgIndex.value && backgroundMedia.value.length > 1)
    currentBgIndex.value = nextIndex
    switchToBg(backgroundMedia.value[nextIndex])
  }, 12000)
}

onMounted(async () => {
    // Load the media manifest generated at build time.
    // Falls back to an empty array in dev (manifest is only written to dist/).
    const manifestUrl = '/media-manifest.json'
    try {
      const resp = await fetch(manifestUrl)
      if (resp.ok) {
        backgroundMedia.value = await resp.json()
      }
    } catch {
      // No manifest yet — dev server fallback: glob /static/media via raw import
      const modules = import.meta.glob('/public/static/media/*.{png,jpg,jpeg,webp,gif,mp4,webm}', { eager: true })
      backgroundMedia.value = Object.values(modules)
        .filter(Boolean)
        .map(mod => {
          const src = typeof mod === 'string' ? mod : mod.default
          const lower = (src || '').toLowerCase()
          const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm')
          return { type: isVideo ? 'video' : 'image', src }
        })
        .sort((a, b) => a.src.localeCompare(b.src))
    }

    startBgRotation()
})

onBeforeUnmount(() => {
  if (bgTimer) clearInterval(bgTimer)
})
</script>

<template>
  <div>
    <!-- Skip to main content link for keyboard/screen reader users -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- 全局背景（双层 crossfade） -->
    <div class="nix-filter"></div>
    <div ref="layerA" class="bg-layer bg-layer--active" />
    <div ref="layerB" class="bg-layer" />
    <video
      id="background-video"
      class="background-video"
      muted
      loop
      playsinline
      preload="auto"
    ></video>

    <router-view id="main-content" v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="r.fullPath" />
      </Transition>
    </router-view>
  </div>
</template>

<style>
/* 双层 crossfade 背景 */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}

@media (hover: none), (max-width: 768px) {
  .bg-layer {
    background-attachment: scroll;
  }
}
.bg-layer--active {
  opacity: 1;
}
</style>
