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
          <span class="has-text-weight-bold brand-logo">Nix</span>
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
        <b-navbar-item tag="router-link" :to="{ path: '/animation' }">
          动画
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

<style>
.brand-logo {
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  background: linear-gradient(120deg, #bd34fe, #e0321b 30%, #41d1ff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-section {
  padding-top: 4.5rem;
}
</style>
