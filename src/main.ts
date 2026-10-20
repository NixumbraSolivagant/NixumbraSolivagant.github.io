import { createApp } from 'vue'
import 'lenis/dist/lenis.css'
import './styles/index.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

document.documentElement.lang =
  String(i18n.global.locale.value) === 'en' ? 'en' : 'zh-CN'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
