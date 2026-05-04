<template>
  <nav class="site-navbar">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="brand-logo">Nix</span>
        <span class="brand-dot"></span>
      </router-link>

      <div class="navbar-links">
        <router-link to="/" class="nav-link">
          <span>首页</span>
        </router-link>
        <router-link to="/blog" class="nav-link">
          <span>博客</span>
        </router-link>
        <router-link to="/about" class="nav-link">
          <span>关于</span>
        </router-link>
        <router-link to="/animation" class="nav-link">
          <span>动画</span>
        </router-link>
      </div>

      <a
        class="nav-github"
        href="https://github.com/NixumbraSolivagant"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
      >
        <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
          <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"/>
        </svg>
      </a>

      <button
        class="navbar-toggle"
        :class="{ open: mobileOpen }"
        @click="mobileOpen = !mobileOpen"
        aria-label="菜单"
      >
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu" :class="{ open: mobileOpen }">
      <router-link to="/" class="mobile-link" @click="mobileOpen = false">首页</router-link>
      <router-link to="/blog" class="mobile-link" @click="mobileOpen = false">博客</router-link>
      <router-link to="/about" class="mobile-link" @click="mobileOpen = false">关于</router-link>
      <router-link to="/animation" class="mobile-link" @click="mobileOpen = false">动画</router-link>
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
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
}

@media (prefers-color-scheme: dark) {
  .site-navbar {
    background: rgba(15, 23, 42, 0.82);
    border-bottom-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.3);
  }
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 58px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.navbar-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.brand-logo {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: linear-gradient(
    135deg,
    #a855f7 0%,
    #ec4899 25%,
    #f43f5e 45%,
    #f97316 65%,
    #eab308 80%,
    #22c55e 90%,
    #06b6d4 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.45));
}

.brand-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  flex-shrink: 0;
  animation: pulse-dot 2.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.7; }
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--item_left_text_color);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;
  overflow: hidden;
}

.nav-link span {
  position: relative;
  z-index: 1;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  right: 50%;
  height: 2px;
  background: linear-gradient(90deg, #a855f7, #ec4899, #f43f5e);
  border-radius: 1px;
  transition: left 0.25s ease, right 0.25s ease;
}

.nav-link:hover {
  color: var(--main_text_color);
  background: var(--item_hover_color);
}

.nav-link:hover::before {
  left: 14px;
  right: 14px;
}

.nav-link.router-link-active {
  color: var(--main_text_color);
  background: var(--item_hover_color);
}

.nav-link.router-link-active::before {
  left: 14px;
  right: 14px;
}

.nav-github {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--item_left_text_color);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.nav-github:hover {
  color: var(--main_text_color);
  background: var(--item_hover_color);
  transform: scale(1.08);
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

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 8px 12px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  gap: 2px;
}

@media (prefers-color-scheme: dark) {
  .mobile-menu {
    border-top-color: rgba(255, 255, 255, 0.06);
  }
}

.mobile-link {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--item_left_text_color);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}

.mobile-link:hover,
.mobile-link.router-link-active {
  color: var(--main_text_color);
  background: var(--item_hover_color);
}

@media (max-width: 640px) {
  .navbar-links,
  .nav-github {
    display: none;
  }

  .navbar-toggle {
    display: flex;
  }

  .mobile-menu.open {
    display: flex;
  }
}
</style>
