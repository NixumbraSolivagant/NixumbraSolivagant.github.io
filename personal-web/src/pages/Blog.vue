<template>
  <section>
    <h1>博客</h1>
    <div v-if="!currentPost">
      <ul>
        <li v-for="post in posts" :key="post.slug">
          <router-link
            :to="{ name: 'BlogDetail', params: { slug: post.slug } }"
            class="post-title"
          >
            {{ post.title }}
          </router-link>
          <span v-if="post.date" class="post-date">{{ post.date }}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      <button @click="goBack">返回列表</button>
      <h2>{{ currentPost.title }}</h2>
      <div class="markdown-body markdown-body">
        <vue3-markdown-it
          :source="currentPost.content"
          :options="markdownOptions"
          :plugins="plugins"
        />
      </div>
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
section {
  max-width: 720px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li + li {
  margin-top: 0.75rem;
}

 .post-title {
  color: #1f6feb;
}

.post-date {
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

button {
  margin-bottom: 1rem;
}

.markdown-body {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.8;
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
</style>
