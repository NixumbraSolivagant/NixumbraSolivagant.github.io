<template>
  <section>
    <h1>博客</h1>
    <div v-if="!currentPost">
      <ul>
        <li v-for="post in posts" :key="post.slug">
          <router-link :to="{ name: 'BlogDetail', params: { slug: post.slug } }">{{ post.title }}</router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <button @click="goBack">返回列表</button>
      <h2>{{ currentPost.title }}</h2>
      <vue3-markdown-it :source="currentPost.content" />
    </div>
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Vue3MarkdownIt from 'vue3-markdown-it'

// 自动导入所有 markdown 文件
const modules = import.meta.glob('../markdowns/*.md', { as: 'raw', eager: true })

// 解析文件名和内容，生成 slug
const posts = Object.entries(modules).map(([path, content]) => {
  const match = path.match(/\/([^/]+)\.md$/)
  const slug = match ? match[1] : path
  const title = match ? decodeURIComponent(match[1]) : path
  return { path, slug, title, content }
})

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
