import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'bulma/css/bulma.css'
import 'github-markdown-css/github-markdown.css'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('./pages/Home.vue')
const Blog = () => import('./pages/Blog.vue')
const About = () => import('./pages/About.vue')
const Animation = () => import('./pages/Animation.vue')

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
  scrollBehavior() {
    return { top: 0 }
  },
})

createApp(App).use(router).mount('#app')
