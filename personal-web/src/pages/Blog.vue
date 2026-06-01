<template>
  <section class="zhihu-page">
    <NavBar />
    <div class="zhihu-shell">
      <div class="zhihu-body">
        <div class="zhihu-hero">
          <div class="zhihu-hero-content">
            <div class="zhihu-title">{{ t('blog.heroTitle') }}</div>
            <p class="zhihu-subtitle">{{ t('blog.heroSubtitle') }}</p>
            <div class="zhihu-tabs">
              <button class="tab active">{{ t('blog.tabRecommend') }}</button>
              <button class="tab">{{ t('blog.tabLatest') }}</button>
              <button class="tab">{{ t('blog.tabEssay') }}</button>
            </div>
          </div>
          <div class="zhihu-hero-card">
            <div class="hero-label">{{ t('blog.heroLabel') }}</div>
            <div class="hero-desc">{{ t('blog.heroDesc') }}</div>
            <div class="hero-actions">
              <span class="hero-pill">{{ t('blog.heroTechMarkdown') }}</span>
              <span class="hero-pill">{{ t('blog.heroTechVue') }}</span>
              <span class="hero-pill">{{ t('blog.heroTechStudy') }}</span>
            </div>
          </div>
        </div>
        <div class="zhihu-container">
          <main class="zhihu-main">
            <div v-if="!isDetailView" class="feed">
              <article v-for="post in posts" :key="post.slug" class="feed-item">
                <router-link
                  :to="{ name: 'BlogDetail', params: { slug: post.slug } }"
                  class="feed-link"
                >
                  <div class="feed-content">
                    <h2 class="feed-title">{{ post.title }}</h2>
                    <p class="feed-excerpt">{{ post.excerpt }}</p>
                  </div>
                  <div class="feed-footer">
                    <div class="feed-meta">
                      <span class="meta-tag">{{ t('blog.metaColumn') }}</span>
                      <span class="meta-dot">·</span>
                      <span class="meta-date">{{ post.date || t('blog.metaNoDate') }}</span>
                      <span class="meta-dot">·</span>
                      <span class="meta-read">{{ t('blog.metaReadMinutes', { n: post.readMinutes }) }}</span>
                    </div>
                    <span class="feed-arrow">→</span>
                  </div>
                </router-link>
              </article>
            </div>
            <div v-else-if="currentPost" class="post-view">
              <div class="post-header">
                <button class="back-btn" @click="goBack">{{ t('blog.backToList') }}</button>
                <h1 class="post-title">{{ currentPost.title }}</h1>
                <div class="post-meta">
                  <span class="post-tag">{{ t('blog.metaColumn') }}</span>
                  <span class="meta-dot">·</span>
                  <span>{{ currentPost.date || t('blog.postMetaDate') }}</span>
                  <span class="meta-dot">·</span>
                  <span>{{ t('blog.postMetaReadTime', { n: currentPost.readMinutes }) }}</span>
                </div>
              </div>
              <div ref="postContentRef" class="post-content">
                <MarkdownRenderer
                  :source="currentPost.content"
                  @rendered="buildToc"
                />
              </div>
            </div>
            <div v-else class="post-empty">
              <h2>{{ t('blog.postNotFound') }}</h2>
              <p>{{ t('blog.postNotFoundDesc') }}</p>
              <button class="back-btn" @click="goBack">{{ t('blog.backToBlog') }}</button>
            </div>
          </main>
          <aside class="zhihu-side">
            <!-- ── 移动端 TOC 抽屉触发按钮 ── -->
            <div v-if="isDetailView && tocItems.length" class="toc-drawer-toggle">
              <button class="drawer-btn" @click="drawerOpen = true" :aria-label="t('blog.tocTitle')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
                </svg>
                {{ t('blog.tocTitle') }}
              </button>
            </div>

            <div class="side-card profile">
              <div class="profile-header">
                <div class="profile-avatar"></div>
                <div>
                  <div class="profile-name">{{ t('blog.profileName') }}</div>
                  <div class="profile-desc">{{ t('blog.profileDesc') }}</div>
                </div>
              </div>
              <div class="profile-stats">
                <div>
                  <strong>{{ posts.length }}</strong>
                  <span>{{ t('blog.statsArticles') }}</span>
                </div>
                <div>
                  <strong>{{ t('blog.statsActive') }}</strong>
                  <span>{{ t('blog.statsCode') }}</span>
                </div>
                <div>
                  <strong>{{ t('blog.statsGithub') }}</strong>
                  <span>{{ t('blog.statsCode') }}</span>
                </div>
              </div>
              <a class="profile-link" :href="SITE_AUTHOR.githubUrl" target="_blank" rel="noreferrer">
                {{ t('blog.visitGithub') }}
              </a>
            </div>
            <div class="side-card">
              <div class="side-title">{{ t('blog.sidebarTags') }}</div>
              <div class="tag-list">
                <span class="tag">{{ t('blog.tagLearning') }}</span>
                <span class="tag">{{ t('blog.tagAlgorithm') }}</span>
                <span class="tag">{{ t('blog.tagFrontend') }}</span>
                <span class="tag">{{ t('blog.tagLife') }}</span>
              </div>
            </div>
            <div class="side-card">
              <div class="side-title">{{ t('blog.sidebarUpdate') }}</div>
              <p class="side-text">{{ t('blog.sidebarUpdateDesc') }}</p>
              <button class="side-btn">{{ t('blog.sidebarFollow') }}</button>
            </div>
            <!-- ── 目录：桌面端 sticky + 移动端 teleport ── -->
            <div v-if="isDetailView" class="side-card post-toc" :class="{ 'toc-mobile': isMobileDrawer }">
              <div class="toc-header">
                <div class="toc-title">{{ t('blog.tocTitle') }}</div>
                <button v-if="isMobileDrawer" class="toc-close" @click="drawerOpen = false" :aria-label="t('blog.modalClose')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <ul class="toc-list">
                <li v-for="item in tocItems" :key="item.id" :data-id="item.id" :class="['toc-item', item.level, { 'toc-active': activeId === item.id }]">
                  <button type="button" class="toc-link" @click="scrollToHeading(item.id)">
                    {{ item.text }}
                  </button>
                </li>
                <li v-if="!tocItems.length" class="toc-empty">{{ t('blog.tocEmpty') }}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- 移动端目录抽屉（Teleport 到 body 层） -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="isMobileDrawer && drawerOpen" class="toc-drawer-overlay" @click.self="drawerOpen = false">
          <div class="toc-drawer-panel">
            <div class="toc-drawer-header">
              <span class="toc-drawer-title">{{ t('blog.tocTitle') }}</span>
              <button class="toc-close" @click="drawerOpen = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <nav class="toc-drawer-body">
              <ul class="toc-drawer-list">
                <li
                  v-for="item in tocItems"
                  :key="item.id"
                  :data-id="item.id"
                  :class="['toc-drawer-item', item.level, { 'toc-active': activeId === item.id }]"
                >
                  <button type="button" class="toc-drawer-link" @click="scrollToHeading(item.id)">
                    {{ item.text }}
                  </button>
                </li>
                <li v-if="!tocItems.length" class="toc-drawer-empty">{{ t('blog.tocEmpty') }}</li>
              </ul>
            </nav>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import NavBar from '@/components/NavBar.vue'
import { useRouter, useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { SITE_AUTHOR } from '@/config/author.js'

const { t } = useI18n()

// auto import all markdown files
const markdownModules = import.meta.glob('../markdowns/*.md', { eager: true, query: '?raw', import: 'default' })

function extractContent(mod) {
  if (!mod) return ''
  if (typeof mod === 'string') return mod
  return mod && typeof mod === 'object' && 'default' in mod ? mod.default : String(mod)
}

function buildExcerpt(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_\-`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
    .concat('…')
}

function getReadingStats(content) {
  const trimmed = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_\-`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const chineseChars = trimmed.match(/[\u4e00-\u9fa5]/g)?.length ?? 0
  const wordCount = trimmed.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length
  const total = wordCount + chineseChars
  return {
    wordCount: total,
    readMinutes: Math.max(1, Math.round(total / 300)),
    excerpt: buildExcerpt(trimmed),
  }
}

// stats cache — keyed by content hash so Map lookup is O(1)
const statsCache = new Map()

const getCachedStats = (content) => {
  if (!statsCache.has(content)) {
    statsCache.set(content, getReadingStats(content))
  }
  return statsCache.get(content)
}

const posts = Object.entries(markdownModules)
  .map(([path, mod]) => {
    const content = extractContent(mod)
    const match = path.match(/\/([^/]+)\.md$/)
    const slug = match ? match[1] : path

    // Extract display title: try heading first, then date-prefixed name
    let displayTitle = slug
    let date = null

    // Title from first H1 in content
    const headingMatch = content.match(/^#\s+(.+)$/m)
    if (headingMatch) {
      displayTitle = headingMatch[1].trim()
    }

    // Date prefix in filename: YYYY-MM-DD-title or YYYY-MM-DD_title
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})[-_](.+)$/)
    if (dateMatch) {
      date = dateMatch[1]
      // Only override displayTitle if no H1 was found
      if (!headingMatch) {
        displayTitle = dateMatch[2]
      }
    }

    const sortKey = date ?? slug
    const stats = getCachedStats(content)

    return {
      path,
      slug,
      title: displayTitle,
      content,
      date,
      sortKey,
      excerpt: stats.excerpt,
      readMinutes: stats.readMinutes,
      wordCount: stats.wordCount,
    }
  })
  .sort((a, b) => {
    if (a.sortKey === b.sortKey) return 0
    return a.sortKey < b.sortKey ? 1 : -1
  })

const route = useRoute()
const router = useRouter()

const isDetailView = computed(() => Boolean(route.params.slug))
const currentPost = computed(() => {
  if (!route.params.slug) return null
  return findPostBySlug(route.params.slug)
})
const postContentRef = ref(null)
const tocItems = ref([])
const activeId = ref('')
const drawerOpen = ref(false)
const MOBILE_BREAKPOINT = 768
const isMobileDrawer = ref(false)

// 在组件创建时就检测一次，避免 SPA 路由切换后仍是初始值
let rafId = null
let scrollHandler = null
let resizeObserver = null

function checkMobile() {
  isMobileDrawer.value = window.innerWidth < MOBILE_BREAKPOINT
}

function goBack() {
  router.push({ name: 'BlogHome' })
}

function findPostBySlug(slug) {
  return posts.find(post => post.slug === slug)
}

function buildToc(el) {
  const root = el ?? postContentRef.value
  if (!root) {
    tocItems.value = []
    return
  }
  const headings = Array.from(root.querySelectorAll('h2, h3'))
  tocItems.value = headings.map(heading => {
    const level = heading.tagName.toLowerCase()
    return { id: heading.id, text: heading.textContent?.trim() || '标题', level }
  })
}

function scrollToHeading(id) {
  const target = document.getElementById(id)
  if (!target) return
  drawerOpen.value = false
  const navHeight = 90
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight
  window.scrollTo({ top, behavior: 'smooth' })
}

function setupScrollspy() {
  destroyScrollspy()
  if (!tocItems.value.length) return
  const headingEls = tocItems.value
    .map(item => document.getElementById(item.id))
    .filter(Boolean)
  if (!headingEls.length) return

  function updateActive() {
    const navHeight = 90
    const scrollTop = window.scrollY
    let current = null
    for (const el of headingEls) {
      const top = el.getBoundingClientRect().top + scrollTop - navHeight
      if (top <= scrollTop + 5) {
        current = el
      }
    }
    if (current) activeId.value = current.id
  }

  function onScroll() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateActive()
      rafId = null
    })
  }

  scrollHandler = onScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })
  updateActive()
}

function destroyScrollspy() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
}

function setupResizeObserver() {
  resizeObserver = new ResizeObserver(() => checkMobile())
  resizeObserver.observe(document.documentElement)
}

watch(
  currentPost,
  post => {
    if (!post) {
      tocItems.value = []
      destroyScrollspy()
    }
  },
  { immediate: true }
)

// TOC 构建完成后（DOM 更新完毕）再启动 Scrollspy
watch(tocItems, async () => {
  if (!tocItems.value.length) {
    destroyScrollspy()
    return
  }
  await nextTick()
  setupScrollspy()
})

// 活动条目变化时，自动滚动目录使其进入可视范围
watch(activeId, async (id) => {
  if (!id) return
  await nextTick()
  // 桌面端：.post-toc 内滚动
  const tocEl = document.querySelector('.post-toc')
  const tocItem = tocEl?.querySelector(`[data-id="${id}"]`)
  if (tocItem) {
    tocItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  // 移动端：抽屉打开时滚动抽屉内部
  if (drawerOpen.value) {
    const drawerBody = document.querySelector('.toc-drawer-body')
    const drawerItem = drawerBody?.querySelector(`[data-id="${id}"]`)
    if (drawerItem) {
      drawerItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
})

onMounted(() => {
  checkMobile()
  setupResizeObserver()
})

onBeforeUnmount(() => {
  destroyScrollspy()
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.zhihu-page {
  font-family: "Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--main_text_color);
  background: transparent;
  min-height: 100vh;
}

.zhihu-shell {
  padding: 0 0 88px;
}

.zhihu-body {
  padding: 0 16px;
}

.zhihu-hero {
  max-width: 1400px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 26px;
}

.zhihu-hero-content {
  background: var(--item_bg_color);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.2);
  color: var(--main_text_color);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--card_stroke_color);
}

.zhihu-hero-content::after {
  content: "";
  position: absolute;
  inset: -45% -30% auto auto;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, var(--accent), transparent 65%);
  pointer-events: none;
  opacity: 0.5;
}

.zhihu-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.zhihu-subtitle {
  color: var(--item_left_text_color);
  opacity: 0.8;
  margin-bottom: 20px;
}

.zhihu-tabs {
  display: flex;
  gap: 12px;
}

.tab {
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--item_hover_color);
  color: var(--item_left_text_color);
  font-weight: 600;
  cursor: default;
  opacity: 0.7;
  border: 1px solid var(--card_stroke_color);
}

.tab.active {
  background: var(--accent);
  color: var(--main_text_color);
  opacity: 1;
  border-color: transparent;
}

.zhihu-hero-card {
  background: var(--item_bg_color);
  border-radius: 18px;
  padding: 26px;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-label {
  font-weight: 600;
  color: var(--main_text_color);
  margin-bottom: 6px;
}

.hero-desc {
  color: var(--item_left_text_color);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-pill {
  background: var(--item_hover_color);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--main_text_color);
  border: 1px solid var(--card_stroke_color);
}

.zhihu-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 30px;
}

.zhihu-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-item {
  background: var(--item_bg_color);
  border-radius: 20px;
  padding: 28px 30px;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.feed-item::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.14), transparent 55%);
  pointer-events: none;
}

.feed-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 54px rgba(15, 23, 42, 0.16);
}

.feed-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.feed-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feed-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.feed-arrow {
  font-size: 1.6rem;
  color: var(--accent_strong);
  font-weight: 600;
}

.feed-title {
  font-size: 1.78rem;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.feed-excerpt {
  color: var(--item_left_text_color);
  margin-bottom: 14px;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--item_left_text_color);
  font-size: 0.88rem;
  opacity: 0.75;
}

.meta-tag,
.post-tag {
  background: var(--item_hover_color);
  color: var(--accent_strong);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid var(--card_stroke_color);
}

.meta-dot {
  color: var(--item_left_text_color);
  opacity: 0.5;
}

.post-view {
  background: var(--item_bg_color);
  border-radius: 24px;
  padding: 36px 40px 44px;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 26px 50px rgba(15, 23, 42, 0.12);
}

.post-toc {
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--card_stroke_color) transparent;
}

.post-toc::-webkit-scrollbar {
  width: 4px;
}
.post-toc::-webkit-scrollbar-thumb {
  background: var(--card_stroke_color);
  border-radius: 999px;
}
.post-toc::-webkit-scrollbar-track {
  background: transparent;
}

.post-empty {
  background: var(--item_bg_color);
  border-radius: 20px;
  padding: 32px 36px;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toc-title {
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--main_text_color);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-item {
  display: flex;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.toc-item:hover {
  background: var(--item_hover_color);
}

.toc-item.h3 {
  padding-left: 12px;
}

.toc-link {
  border: none;
  background: transparent;
  color: var(--item_left_text_color);
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  font-size: 0.88rem;
  line-height: 1.45;
  padding: 5px 8px;
  width: 100%;
  border-radius: 8px;
  transition: color 0.15s ease;
}

.toc-link:hover {
  color: var(--main_text_color);
}

.toc-active .toc-link {
  color: var(--accent_strong);
  font-weight: 700;
}

.toc-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}

.toc-item {
  position: relative;
}

.toc-empty {
  color: var(--item_left_text_color);
  font-size: 0.85rem;
  opacity: 0.6;
  padding: 4px 8px;
}

/* ── 目录头部（移动端有关闭按钮） ── */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toc-header .toc-title {
  margin-bottom: 0;
}

.toc-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--card_stroke_color);
  border-radius: 8px;
  background: var(--item_hover_color);
  color: var(--item_left_text_color);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.toc-close:hover {
  background: var(--accent);
  color: var(--main_text_color);
  border-color: transparent;
}

/* ── 移动端抽屉触发按钮（桌面端隐藏） ── */
.toc-drawer-toggle {
  display: none;
}

/* ── 移动端抽屉 Overlay ── */
.toc-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
}

.toc-drawer-panel {
  width: 100%;
  max-height: 70vh;
  background: var(--item_bg_color);
  border-radius: 20px 20px 0 0;
  border: 1px solid var(--card_stroke_color);
  border-bottom: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -16px 48px rgba(15, 23, 42, 0.3);
}

.toc-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 14px;
  border-bottom: 1px solid var(--card_stroke_color);
  flex-shrink: 0;
}

.toc-drawer-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--main_text_color);
}

.toc-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0 24px;
  scrollbar-width: thin;
  scrollbar-color: var(--card_stroke_color) transparent;
}

.toc-drawer-body::-webkit-scrollbar {
  width: 4px;
}
.toc-drawer-body::-webkit-scrollbar-thumb {
  background: var(--card_stroke_color);
  border-radius: 999px;
}

.toc-drawer-list {
  list-style: none;
  padding: 0 12px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-drawer-item {
  position: relative;
  border-radius: 10px;
  transition: background 0.15s ease;
}

.toc-drawer-item:hover {
  background: var(--item_hover_color);
}

.toc-drawer-item.h3 {
  padding-left: 16px;
}

.toc-drawer-item.toc-active::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}

.toc-drawer-link {
  border: none;
  background: transparent;
  color: var(--item_left_text_color);
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 8px 12px;
  width: 100%;
  border-radius: 10px;
  transition: color 0.15s ease;
}

.toc-drawer-link:hover {
  color: var(--main_text_color);
}

.toc-drawer-item.toc-active .toc-drawer-link {
  color: var(--accent_strong);
  font-weight: 700;
}

.toc-drawer-empty {
  color: var(--item_left_text_color);
  font-size: 0.88rem;
  opacity: 0.6;
  padding: 8px 12px;
  text-align: center;
}

/* ── 抽屉滑入/滑出动画 ── */
.drawer-enter-active .toc-drawer-panel {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-leave-active .toc-drawer-panel {
  transition: transform 0.25s ease-in;
}
.drawer-enter-from .toc-drawer-panel,
.drawer-leave-to .toc-drawer-panel {
  transform: translateY(100%);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .zhihu-hero,
  .zhihu-container {
    grid-template-columns: 1fr;
  }

  .zhihu-hero-card {
    order: -1;
  }

  /* 移动端显示抽屉按钮，隐藏内嵌目录 */
  .toc-drawer-toggle {
    display: block;
  }

  /* 桌面端在 1024px 及以上隐藏内嵌抽屉触发按钮 */
  .toc-drawer-toggle {
    display: none;
  }

  /* 桌面端（>1024px）目录保持 sticky */
  .zhihu-side:not(.mobile-mode) .post-toc {
    position: sticky;
    top: 90px;
  }
}

@media (max-width: 768px) {
  .zhihu-shell {
    padding: 0 0 40px;
  }

  .zhihu-body {
    padding: 0 12px;
  }

  .zhihu-hero-content {
    padding: 22px;
  }

  .feed-item,
  .post-view {
    padding: 22px;
  }

  /* 768px 以下：隐藏内嵌目录卡片，只保留抽屉触发按钮 */
  .zhihu-side .post-toc {
    display: none;
  }

  .toc-drawer-toggle {
    display: flex;
  }
}

.back-btn {
  border: none;
  background: var(--item_hover_color);
  color: var(--accent_strong);
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  border: 1px solid var(--card_stroke_color);
}

.post-title {
  font-size: 2.2rem;
  margin-bottom: 10px;
  color: var(--main_text_color);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--item_left_text_color);
  opacity: 0.75;
  margin-bottom: 22px;
}

.post-content {
  line-height: 1.95;
  font-size: 1.05rem;
}

.zhihu-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card {
  background: var(--item_bg_color);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: url('/static/img/avatar.png') center 20% / cover no-repeat;
  border: 3px solid var(--accent);
}

.profile-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--main_text_color);
}

.profile-desc {
  color: var(--item_left_text_color);
  font-size: 0.9rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--item_left_text_color);
  font-size: 0.85rem;
}

.profile-stats strong {
  display: block;
  color: var(--main_text_color);
  font-size: 1rem;
}

.profile-link {
  display: block;
  text-align: center;
  padding: 10px 14px;
  background: var(--accent);
  color: var(--main_text_color);
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
}

.side-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--main_text_color);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: var(--item_hover_color);
  color: var(--main_text_color);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid var(--card_stroke_color);
}

.side-text {
  color: var(--item_left_text_color);
  line-height: 1.6;
  margin-bottom: 12px;
}

.side-btn {
  width: 100%;
  border: none;
  background: var(--accent);
  color: var(--main_text_color);
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
