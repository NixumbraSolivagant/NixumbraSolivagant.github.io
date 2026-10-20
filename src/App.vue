<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AuroraBackground from '@/components/layout/AuroraBackground.vue'
import CursorGlow from '@/components/layout/CursorGlow.vue'
import ScrollProgress from '@/components/layout/ScrollProgress.vue'
import { useLocale } from '@/composables/useLocale'
import {
  destroyLenis,
  initLenis,
  scrollToHash,
  scrollToTop,
} from '@/composables/useLenis'

const { t } = useLocale()
const router = useRouter()

router.afterEach((to) => {
  // 等新页面挂载、高度更新后再滚动
  requestAnimationFrame(() => {
    if (to.hash) scrollToHash(to.hash)
    else scrollToTop(true)
  })
})

onMounted(() => initLenis())
onBeforeUnmount(() => destroyLenis())
</script>

<template>
  <a href="#main" class="skip-link">{{ t('a11y.skip') }}</a>

  <AuroraBackground />
  <CursorGlow />
  <ScrollProgress />
  <AppHeader />

  <main id="main" class="relative">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <AppFooter />
</template>
