import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/work', name: 'work', component: () => import('@/pages/ProjectsPage.vue') },
    { path: '/blog', name: 'blog', component: () => import('@/pages/BlogPage.vue') },
    { path: '/blog/:slug', name: 'post', component: () => import('@/pages/PostPage.vue') },
    { path: '/about', name: 'about', component: () => import('@/pages/AboutPage.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
  // 滚动交给 Lenis 与 App.vue 统一处理，避免两套滚动逻辑打架
  scrollBehavior() {
    return false
  },
})

export default router
