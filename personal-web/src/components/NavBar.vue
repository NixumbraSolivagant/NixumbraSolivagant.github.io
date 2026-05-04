<template>
  <nav class="site-navbar">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="brand-logo">Nix</span>
      </router-link>

      <button
        class="navbar-toggle"
        :class="{ open: mobileOpen }"
        @click="mobileOpen = !mobileOpen"
        aria-label="菜单"
      >
        <span></span><span></span><span></span>
      </button>

      <div class="navbar-links" :class="{ open: mobileOpen }">
        <router-link to="/" class="nav-link" @click="mobileOpen = false">
          首页
        </router-link>
        <router-link to="/blog" class="nav-link" @click="mobileOpen = false">
          博客
        </router-link>
        <router-link to="/about" class="nav-link" @click="mobileOpen = false">
          关于我
        </router-link>
        <router-link to="/animation" class="nav-link" @click="mobileOpen = false">
          动画
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const mobileOpen = ref(false)
</script>

<style scoped>
.site-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--item_bg_color);
  border-bottom: 1px solid var(--card_stroke_color);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 56px;
  gap: 8px;
}

.navbar-brand {
  text-decoration: none;
  flex-shrink: 0;
}

.brand-logo {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: linear-gradient(120deg, #bd34fe, #e0321b 30%, #41d1ff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--item_left_text_color);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  opacity: 0.8;
}

.nav-link:hover {
  color: var(--main_text_color);
  background: var(--item_hover_color);
  border-color: var(--card_stroke_color);
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--main_text_color);
  background: var(--item_hover_color);
  border-color: var(--card_stroke_color);
  opacity: 1;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--card_stroke_color);
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.navbar-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--item_left_text_color);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.navbar-toggle.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.navbar-toggle.open span:nth-child(2) {
  opacity: 0;
}
.navbar-toggle.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 640px) {
  .navbar-toggle {
    display: flex;
  }

  .navbar-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--item_bg_color);
    border-bottom: 1px solid var(--card_stroke_color);
    padding: 8px 12px 12px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
  }

  .navbar-links.open {
    display: flex;
  }

  .nav-link {
    padding: 10px 14px;
    border-radius: 10px;
  }
}
</style>
