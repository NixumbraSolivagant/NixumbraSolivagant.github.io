<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showNav = computed(() => route.path !== '/')

// ===== 全局背景轮播 =====
// 使用懒加载避免在 App.vue 初始化时阻塞
const backgroundMedia = ref([])
const currentBgIndex = ref(0)
let bgTimer = null
let bgLoaded = false

const applyBackground = (media) => {
  const root = document.documentElement
  const video = document.getElementById('background-video')
  if (media.type === 'video') {
    root.style.setProperty('--main_bg_color', 'none')
    if (video) {
      video.style.display = 'block'
      if (video.getAttribute('src') !== media.src) {
        video.setAttribute('src', media.src)
        video.load()
      }
      video.play().catch(() => {})
    }
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
    return
  }
  if (video) {
    video.pause()
    video.style.display = 'none'
  }
  root.style.setProperty('--main_bg_color', `url(${media.src})`)
  updateTextColorFromBackground(`url(${media.src})`)
}

const updateTextColorFromBackground = (imageUrl = '') => {
  const root = document.documentElement
  const source = imageUrl || getComputedStyle(root).getPropertyValue('--main_bg_color').trim()
  const urlMatch = source.match(/url\((['"]?)(.*?)\1\)/)
  if (!urlMatch) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = urlMatch[2]
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
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
    root.style.setProperty('--main_text_color', isDark ? '#f8fafc' : '#111827')
    root.style.setProperty('--item_left_title_color', isDark ? '#f8fafc' : '#111827')
    root.style.setProperty('--item_left_text_color', isDark ? '#e2e8f0' : '#4b5563')
    root.style.setProperty('--footer_text_color', isDark ? '#e2e8f0' : '#374151')
    root.style.setProperty('--fill', isDark ? '#ffffff' : '#111827')
    root.style.setProperty('--text_bg_color', isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.7)')
    root.style.setProperty('--item_bg_color', isDark ? 'rgba(15, 23, 42, 0.52)' : 'rgba(255, 255, 255, 0.72)')
    root.style.setProperty('--item_hover_color', isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.85)')
    root.style.setProperty('--left_tag_item', isDark ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255, 255, 255, 0.7)')
    root.style.setProperty('--back_filter_color', isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.2)')
    root.style.setProperty('--card_stroke_color', isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.18)')
    root.style.setProperty('--accent', isDark ? '#38bdf8' : '#38bdf8')
    root.style.setProperty('--accent_strong', isDark ? '#7dd3fc' : '#0284c7')
  }
}

const startBgRotation = () => {
  if (!backgroundMedia.value.length) return
  if (!bgLoaded) {
    bgLoaded = true
    applyBackground(backgroundMedia.value[currentBgIndex.value])
  }
  bgTimer = window.setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % backgroundMedia.value.length
    applyBackground(backgroundMedia.value[currentBgIndex.value])
  }, 12000)
}

onMounted(async () => {
  // 动态加载背景媒体文件
  const mediaModules = import.meta.glob('/public/static/media/*.{png,jpg,jpeg,webp,gif,mp4,webm}', { eager: true })
  backgroundMedia.value = Object.values(mediaModules)
    .filter(Boolean)
    .map(url => {
      const normalized = typeof url === 'string' ? url.replace('/public', '') : ''
      const lower = normalized.toLowerCase()
      const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm')
      return { type: isVideo ? 'video' : 'image', src: normalized }
    })
    .sort((a, b) => a.src.localeCompare(b.src))

  startBgRotation()
})

onBeforeUnmount(() => {
  if (bgTimer) clearInterval(bgTimer)
})
</script>

<template>
  <div>
    <!-- 全局背景 -->
    <div class="nix-filter"></div>
    <video
      id="background-video"
      class="background-video"
      muted
      loop
      playsinline
      preload="auto"
    ></video>

    <router-view v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="r.fullPath" />
      </Transition>
    </router-view>
  </div>
</template>

<style>
.brand-logo {
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  background: linear-gradient(120deg, #bd34fe, #e0321b 30%, #41d1ff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
