<template>
  <section class="zhihu-page">
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
        <div v-if="!currentPost" class="feed">
          <article v-for="post in posts" :key="post.slug" class="feed-item">
            <router-link
              :to="{ name: 'BlogDetail', params: { slug: post.slug } }"
              class="feed-link"
            >
              <h2 class="feed-title">{{ post.title }}</h2>
              <p class="feed-excerpt">{{ getExcerpt(post.content) }}</p>
              <div class="feed-meta">
                <span class="meta-tag">专栏</span>
                <span class="meta-dot">·</span>
                <span class="meta-date">{{ post.date || '未标注日期' }}</span>
                <span class="meta-dot">·</span>
                <span class="meta-read">更新</span>
              </div>
            </router-link>
          </article>
        </div>
        <div v-else class="post-view">
          <button class="back-btn" @click="goBack">← 返回列表</button>
          <h1 class="post-title">{{ currentPost.title }}</h1>
          <div class="post-meta">
            <span class="post-tag">专栏</span>
            <span class="meta-dot">·</span>
            <span>{{ currentPost.date || '未标注日期' }}</span>
            <span class="meta-dot">·</span>
            <span>阅读记录</span>
          </div>
          <div class="post-content markdown-body">
            <vue3-markdown-it
              :source="currentPost.content"
              :options="markdownOptions"
              :plugins="plugins"
            />
          </div>
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
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Vue3MarkdownIt from 'vue3-markdown-it'
import hljs from 'highlight.js'
import MarkdownItKatex from 'markdown-it-katex'

// 自动导入所有 markdown 文件
const modules = import.meta.glob('../markdowns/*.md', { as: 'raw', eager: true })

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

    return { path, slug, title: displayTitle, content, date, sortKey }
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
const currentPost = ref(null)

function goBack() {
  router.push({ name: 'BlogHome' })
}

function findPostBySlug(slug) {
  return posts.find(post => post.slug === slug)
}

function getExcerpt(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_\-`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
    .concat('…')
}

watchEffect(() => {
  const slug = route.params.slug
  if (slug) {
    currentPost.value = findPostBySlug(slug)
  } else {
    currentPost.value = null
  }
})
</script>

<style scoped>
.zhihu-page {
  padding: 32px 24px 64px;
  font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #111827;
}

.zhihu-hero {
  max-width: 1120px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
}

.zhihu-hero-content {
  background: linear-gradient(135deg, #ffffff, #f1f6ff);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
}

.zhihu-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.zhihu-subtitle {
  color: #4b5563;
  margin-bottom: 18px;
}

.zhihu-tabs {
  display: flex;
  gap: 12px;
}

.tab {
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  background: #e5ecff;
  color: #1f3b8d;
  font-weight: 600;
  cursor: default;
}

.tab.active {
  background: #1677ff;
  color: #ffffff;
}

.zhihu-hero-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-label {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.hero-desc {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-pill {
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #374151;
}

.zhihu-container {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 28px;
}

.zhihu-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feed-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
}

.feed-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.feed-title {
  font-size: 1.4rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.feed-excerpt {
  color: #4b5563;
  margin-bottom: 14px;
  line-height: 1.7;
}

.feed-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.9rem;
}

.meta-tag,
.post-tag {
  background: #e5ecff;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
}

.meta-dot {
  color: #9ca3af;
}

.post-view {
  background: #ffffff;
  border-radius: 18px;
  padding: 28px 32px 36px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.back-btn {
  border: none;
  background: #eff6ff;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
}

.post-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  margin-bottom: 22px;
}

.post-content {
  line-height: 1.9;
}

.zhihu-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
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
  border: 3px solid #e5ecff;
}

.profile-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.profile-desc {
  color: #6b7280;
  font-size: 0.9rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #4b5563;
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
  background: #1677ff;
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
  background: #f3f4f6;
  color: #374151;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.side-text {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
}

.side-btn {
  width: 100%;
  border: none;
  background: #0f172a;
  color: #ffffff;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
}

.markdown-body {
  font-size: 1rem;
  line-height: 1.9;
  color: #111827;
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
  padding: 0.1em 0.3em;
  border-radius: 4px;
  background-color: #f3f4f6;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.markdown-body pre {
  padding: 1rem;
  border-radius: 6px;
  background-color: #0b1120;
  color: #e5e7eb;
  overflow-x: auto;
}

.markdown-body blockquote {
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 4px solid #e5e7eb;
  color: #6b7280;
}

.markdown-body .katex-display {
  margin: 1.4rem 0;
  text-align: left;
}

.markdown-body .katex-display > .katex {
  font-size: 1.02em;
}

.markdown-body .katex {
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .zhihu-hero,
  .zhihu-container {
    grid-template-columns: 1fr;
  }

  .zhihu-hero-card {
    order: -1;
  }
}

@media (max-width: 640px) {
  .zhihu-page {
    padding: 20px 16px 40px;
  }

  .zhihu-hero-content {
    padding: 22px;
  }

  .feed-item,
  .post-view {
    padding: 20px;
  }
}
</style>
