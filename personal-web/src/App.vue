<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showNav = computed(() => route.path !== '/')
</script>

<template>
  <div>
    <b-navbar v-if="showNav" type="is-white" wrapper-class="container" fixed-top shadow>
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <span class="has-text-weight-semibold">My Blog</span>
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          首页
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/blog' }">
          博客
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }">
          关于我
        </b-navbar-item>
      </template>
    </b-navbar>

    <router-view v-if="!showNav" />

    <section v-else class="section main-section">
      <div class="container">
        <router-view />
      </div>
    </section>
  </div>
</template>

<style scoped>
.main-section {
  padding-top: 4.5rem;
}
</style>
