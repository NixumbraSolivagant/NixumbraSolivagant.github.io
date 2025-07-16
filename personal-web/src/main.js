import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Blog from './pages/Blog.vue'
import About from './pages/About.vue'
import Animation from './pages/Animation.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/blog', component: Blog, name: 'BlogHome' },
  { path: '/blog/:slug', component: Blog, name: 'BlogDetail' },
  { path: '/about', component: About },
  { path: '/animation', component: Animation },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
