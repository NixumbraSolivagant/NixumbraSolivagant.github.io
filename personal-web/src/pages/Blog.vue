<template>
  <section class="zhihu-page">
    <div class="zhihu-shell">
      <nav class="blog-nav">
        <div class="nav-inner">
          <div class="nav-brand">Nix</div>
          <div class="nav-links">
            <router-link class="nav-link" to="/">主页</router-link>
            <router-link class="nav-link active" to="/blog">博客</router-link>
            <router-link class="nav-link" to="/about">关于</router-link>
            <router-link class="nav-link" to="/animation">动画</router-link>
          </div>
          <a class="nav-cta" href="https://github.com/NixumbraSolivagant" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>
      <div class="zhihu-body">
        <div class="zhihu-hero">
      <div class="zhihu-hero-content">
        <div class="zhihu-title">博客</div>
        <p class="zhihu-subtitle">记录学习、思考与项目沉淀</p>
        <div class="zhihu-tabs">
          <button class="tab active">推荐</button>
          <button class="tab">最新</button>
          <button class="tab">随笔</button>
        </div>
      </div>
      <div class="zhihu-hero-card">
        <div class="hero-label">本地 Markdown</div>
        <div class="hero-desc">文章自动加载于 /src/markdowns</div>
        <div class="hero-actions">
          <span class="hero-pill">Markdown</span>
          <span class="hero-pill">Vue</span>
          <span class="hero-pill">Study</span>
        </div>
      </div>
    </div>

        <div class="zhihu-container">
      <main class="zhihu-main">
        <div v-if="!currentPost && !hasSlug" class="feed">
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
                  <span class="meta-tag">专栏</span>
                  <span class="meta-dot">·</span>
                  <span class="meta-date">{{ post.date || '未标注日期' }}</span>
                  <span class="meta-dot">·</span>
                  <span class="meta-read">阅读 {{ post.readMinutes }} 分钟</span>
                </div>
                <span class="feed-arrow">→</span>
              </div>
            </router-link>
          </article>
        </div>
        <div v-else-if="currentPost" class="post-view">
          <div class="post-header">
            <button class="back-btn" @click="goBack">← 返回列表</button>
            <h1 class="post-title">{{ currentPost.title }}</h1>
            <div class="post-meta">
              <span class="post-tag">专栏</span>
              <span class="meta-dot">·</span>
              <span>{{ currentPost.date || '未标注日期' }}</span>
              <span class="meta-dot">·</span>
              <span>约 {{ currentPost.readMinutes }} 分钟阅读</span>
            </div>
          </div>
          <div class="post-layout">
            <aside class="post-toc">
              <div class="toc-title">目录</div>
              <ul class="toc-list">
                <li v-for="item in tocItems" :key="item.id" :class="['toc-item', item.level]">
                  <button type="button" class="toc-link" @click="scrollToHeading(item.id)">
                    {{ item.text }}
                  </button>
                </li>
                <li v-if="!tocItems.length" class="toc-empty">暂无目录</li>
              </ul>
            </aside>
            <div ref="postContentRef" class="post-content markdown-body">
              <vue3-markdown-it
                :source="currentPost.content"
                :options="markdownOptions"
                :plugins="plugins"
              />
            </div>
          </div>
        </div>
        <div v-else class="post-empty">
          <h2>文章未找到</h2>
          <p>可能是链接已更新，返回列表查看最新文章。</p>
          <button class="back-btn" @click="goBack">返回博客首页</button>
        </div>
      </main>

      <aside class="zhihu-side">
        <div class="side-card profile">
          <div class="profile-header">
            <div class="profile-avatar"></div>
            <div>
              <div class="profile-name">Mingzhang HU</div>
              <div class="profile-desc">Computer Student · 南昌</div>
            </div>
          </div>
          <div class="profile-stats">
            <div>
              <strong>{{ posts.length }}</strong>
              <span>文章</span>
            </div>
            <div>
              <strong>活跃</strong>
              <span>更新</span>
            </div>
            <div>
              <strong>GitHub</strong>
              <span>代码</span>
            </div>
          </div>
          <a class="profile-link" href="https://github.com/NixumbraSolivagant" target="_blank" rel="noreferrer">
            访问 GitHub
          </a>
        </div>

        <div class="side-card">
          <div class="side-title">专栏标签</div>
          <div class="tag-list">
            <span class="tag">学习笔记</span>
            <span class="tag">算法</span>
            <span class="tag">前端</span>
            <span class="tag">生活</span>
          </div>
        </div>

        <div class="side-card">
          <div class="side-title">更新提醒</div>
          <p class="side-text">每周整理一次学习收获，欢迎交流。</p>
          <button class="side-btn">关注专栏</button>
        </div>
      </aside>
    </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Vue3MarkdownIt from 'vue3-markdown-it'
import hljs from 'highlight.js'
import MarkdownItKatex from 'markdown-it-katex'

// 自动导入所有 markdown 文件
const modules = import.meta.glob('../markdowns/*.md', { query: '?raw', import: 'default', eager: true })

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

// 解析文件名和内容，生成元信息（slug、标题、日期等）
const posts = Object.entries(modules)
  .map(([path, content]) => {
    const match = path.match(/\/([^/]+)\.md$/)
    const slug = match ? match[1] : path
    const decoded = match ? decodeURIComponent(match[1]) : path

    let date = null
    let displayTitle = decoded

    // 文件名形如：2025-01-01-我的第一篇博客.md
    const dateMatch = decoded.match(/^(\d{4}-\d{2}-\d{2})[-_](.+)$/)
    if (dateMatch) {
      date = dateMatch[1]
      displayTitle = dateMatch[2]
    }

    // 如果 markdown 第一行有一级标题，则用它作为最终标题
    const headingMatch = content.match(/^#\s+(.+)$/m)
    if (headingMatch) {
      displayTitle = headingMatch[1].trim()
    }

    const sortKey = date ?? decoded
    const stats = getReadingStats(content)

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
  // 按日期或文件名倒序（最新的在上面）
  .sort((a, b) => {
    if (a.sortKey === b.sortKey) return 0
    return a.sortKey < b.sortKey ? 1 : -1
  })

const plugins = [
  {
    plugin: MarkdownItKatex,
  },
]

const markdownOptions = {
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    }
    return hljs.highlightAuto(code).value
  },
}

const route = useRoute()
const router = useRouter()
const currentPost = computed(() => {
  const slug = route.params.slug
  return slug ? findPostBySlug(slug) : null
})
const hasSlug = computed(() => Boolean(route.params.slug))
const postContentRef = ref(null)
const tocItems = ref([])

function goBack() {
  router.push({ name: 'BlogHome' })
}

function findPostBySlug(slug) {
  return posts.find(post => post.slug === slug)
}

function buildToc() {
  const root = postContentRef.value
  if (!root) {
    tocItems.value = []
    return
  }
  const headings = Array.from(root.querySelectorAll('h2, h3'))
  tocItems.value = headings.map((heading, index) => {
    const level = heading.tagName.toLowerCase()
    if (!heading.id) {
      heading.id = `heading-${index + 1}`
    }
    return { id: heading.id, text: heading.textContent?.trim() || '标题', level }
  })
}

function scrollToHeading(id) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(
  currentPost,
  post => {
    if (post) {
      nextTick(() => {
        buildToc()
      })
    } else {
      tocItems.value = []
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.zhihu-page {
  --ink: #0f172a;
  --muted: #3b4c66;
  --accent: #38bdf8;
  --accent-strong: #0284c7;
  --card: rgba(255, 255, 255, 0.94);
  --card-stroke: rgba(148, 163, 184, 0.18);
  font-family: "Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--ink);
  background: transparent;
  min-height: 100vh;
}

.zhihu-shell {
  padding: 0 0 88px;
}

.blog-nav {
  width: 100%;
  margin: 0 0 24px;
  padding: 0;
  background: rgba(15, 23, 42, 0.92);
  border-radius: 0 0 16px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.zhihu-body {
  padding: 0 16px;
}

.nav-brand {
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.08em;
  color: #f8fafc;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: rgba(248, 250, 252, 0.7);
  text-decoration: none;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.nav-link:hover,
.nav-link.router-link-active,
.nav-link.active {
  color: #f8fafc;
  background: rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.6);
}

.nav-cta {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.12);
  color: #f8fafc;
  font-weight: 600;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.3);
}

.zhihu-hero {
  max-width: 1280px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 26px;
}

.zhihu-hero-content {
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.92), rgba(56, 189, 248, 0.7));
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.2);
  color: #f8fafc;
  position: relative;
  overflow: hidden;
}

.zhihu-hero-content::after {
  content: "";
  position: absolute;
  inset: -45% -30% auto auto;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.5), transparent 65%);
  pointer-events: none;
}

.zhihu-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.zhihu-subtitle {
  color: rgba(248, 250, 252, 0.8);
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
  background: rgba(248, 250, 252, 0.12);
  color: rgba(248, 250, 252, 0.85);
  font-weight: 600;
  cursor: default;
}

.tab.active {
  background: var(--accent);
  color: #e0f2fe;
}

.zhihu-hero-card {
  background: var(--card);
  border-radius: 18px;
  padding: 26px;
  border: 1px solid var(--card-stroke);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-label {
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}

.hero-desc {
  color: var(--muted);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-pill {
  background: rgba(248, 250, 252, 0.8);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #0f172a;
}

.zhihu-container {
  max-width: 1280px;
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
  background: var(--card);
  border-radius: 20px;
  padding: 28px 30px;
  border: 1px solid var(--card-stroke);
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
  color: var(--accent-strong);
  font-weight: 600;
}

.feed-title {
  font-size: 1.78rem;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.feed-excerpt {
  color: var(--muted);
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
  color: #64748b;
  font-size: 0.88rem;
}

.meta-tag,
.post-tag {
  background: rgba(56, 189, 248, 0.2);
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
}

.meta-dot {
  color: #9ca3af;
}

.post-view {
  background: var(--card);
  border-radius: 24px;
  padding: 36px 40px 44px;
  border: 1px solid var(--card-stroke);
  box-shadow: 0 26px 50px rgba(15, 23, 42, 0.12);
}

.post-empty {
  background: var(--card);
  border-radius: 20px;
  padding: 32px 36px;
  border: 1px solid var(--card-stroke);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 24px;
}

.post-toc {
  position: sticky;
  top: 90px;
  align-self: start;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 18px 16px;
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.08);
  max-height: calc(100vh - 140px);
  overflow: auto;
}

.toc-title {
  font-weight: 700;
  margin-bottom: 12px;
  color: #0f172a;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-item {
  display: flex;
}

.toc-item.h3 {
  padding-left: 12px;
}

.toc-link {
  border: none;
  background: transparent;
  color: #334155;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  font-size: 0.92rem;
  line-height: 1.4;
  padding: 0;
}

.toc-link:hover {
  color: var(--accent-strong);
}

.toc-empty {
  color: #94a3b8;
  font-size: 0.85rem;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  margin-bottom: 24px;
}

.back-btn {
  border: none;
  background: rgba(56, 189, 248, 0.16);
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
}

.post-title {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
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
  background: var(--card);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid var(--card-stroke);
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
  border: 3px solid rgba(56, 189, 248, 0.4);
}

.profile-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.profile-desc {
  color: var(--muted);
  font-size: 0.9rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--muted);
  font-size: 0.85rem;
}

.profile-stats strong {
  display: block;
  color: #111827;
  font-size: 1rem;
}

.profile-link {
  display: block;
  text-align: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #ffffff;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
}

.side-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(15, 23, 42, 0.08);
  color: #1f2937;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.side-text {
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 12px;
}

.side-btn {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #ffffff;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
}

.markdown-body {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--ink);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  margin-top: 1.6rem;
  margin-bottom: 0.8rem;
  line-height: 1.3;
}

.markdown-body p {
  margin: 0.75rem 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.markdown-body li + li {
  margin-top: 0.25rem;
}

.markdown-body code {
  padding: 0.18em 0.4em;
  border-radius: 6px;
  background-color: rgba(14, 116, 144, 0.1);
  color: #0f172a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.markdown-body pre {
  padding: 1.2rem 1.4rem;
  border-radius: 14px;
  background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 45%), #0b1120;
  color: #e5e7eb;
  overflow-x: auto;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: inset 0 1px 0 rgba(248, 250, 252, 0.08);
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: 0.95rem;
}

.markdown-body pre::-webkit-scrollbar {
  height: 8px;
}

.markdown-body pre::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 999px;
}

.markdown-body blockquote {
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 4px solid #e5e7eb;
  color: #6b7280;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 14px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.18);
  margin: 1rem 0;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.4rem 0;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.markdown-body th,
.markdown-body td {
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  text-align: left;
}

.markdown-body th {
  background: rgba(14, 116, 144, 0.08);
  font-weight: 600;
}

.markdown-body tr:last-child td {
  border-bottom: none;
}

.markdown-body hr {
  border: none;
  border-top: 1px dashed rgba(148, 163, 184, 0.4);
  margin: 2rem 0;
}

.markdown-body .katex-display {
  margin: 1.6rem 0;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  background: rgba(14, 116, 144, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  overflow-x: auto;
  text-align: left;
}

.markdown-body .katex-display > .katex {
  font-size: 1.02em;
}

.markdown-body .katex {
  line-height: 1.4;
}

.markdown-body svg,
.markdown-body canvas {
  max-width: 100%;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
  margin: 1rem 0;
}

@media (max-width: 1024px) {
  .zhihu-hero,
  .zhihu-container {
    grid-template-columns: 1fr;
  }

  .zhihu-hero-card {
    order: -1;
  }

  .nav-inner {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-links {
    order: 3;
    flex-wrap: wrap;
  }

  .post-layout {
    grid-template-columns: 1fr;
  }

  .post-toc {
    position: static;
  }
}

@media (max-width: 640px) {
  .zhihu-shell {
    padding: 0 0 40px;
  }

  .nav-inner {
    gap: 10px;
    padding: 12px 12px;
  }

  .zhihu-body {
    padding: 0 12px;
  }

  .nav-links {
    gap: 12px;
  }

  .zhihu-hero-content {
    padding: 22px;
  }

  .feed-item,
  .post-view {
    padding: 22px;
  }
}
</style>
