<template>
  <nav class="blog-nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-brand" :style="brandStyle">
        Nix
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">主页</router-link>
        <router-link to="/blog" class="nav-link">博客</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
        <router-link to="/animation" class="nav-link">动画</router-link>
      </div>

      <a
        class="nav-cta"
        href="https://github.com/NixumbraSolivagant"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const brandStyle = ref({})
let raf = null
let phase = 0

let ha = Math.random() * 360, sa = 80, la = 60
let hb = Math.random() * 360, sb = 80, lb = 60
let ta = ha, tb = hb
let nextPhase = 0

const lerp = (a, b, t) => a + (b - a) * t

const hsl = (h, s, l) => `hsl(${h % 360}, ${s}%, ${l}%)`

const pickHue = () => Math.random() * 360

const step = () => {
  phase += 0.018

  if (phase >= nextPhase) {
    ha = ta; sa = 80; la = 60
    hb = tb; sb = 80; lb = 60
    ta = pickHue()
    tb = pickHue()
    phase = 0
    nextPhase = 1
  }

  const t = phase < 0.5 ? 2 * phase * phase : 1 - Math.pow(-2 * phase + 2, 2) / 2

  brandStyle.value = {
    background: `linear-gradient(135deg, ${hsl(lerp(ha, ta, t), lerp(sa, 80, t), lerp(la, 60, t))}, ${hsl(lerp(hb, tb, t), lerp(sb, 80, t), lerp(lb, 60, t))})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'none',
  }

  raf = requestAnimationFrame(step)
}

onMounted(() => { raf = requestAnimationFrame(step) })
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.blog-nav {
  width: 100%;
  margin: 0 0 24px;
  padding: 0;
  background: var(--item_bg_color);
  border-radius: 0 0 16px 16px;
  border-bottom: 1px solid var(--card_stroke_color);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-brand {
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  flex-shrink: 0;
  transition: filter 0.3s ease;
}

.nav-brand:hover {
  filter: brightness(1.15);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: var(--item_left_text_color);
  text-decoration: none;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  opacity: 0.75;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--main_text_color);
  background: var(--item_hover_color);
  border-color: var(--card_stroke_color);
  opacity: 1;
}

.nav-cta {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--item_bg_color);
  color: var(--main_text_color);
  font-weight: 600;
  border: 1px solid var(--card_stroke_color);
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.2);
  opacity: 0.9;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.nav-cta:hover {
  opacity: 1;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .blog-nav {
    border-radius: 0;
  }

  .nav-inner {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-links {
    order: 3;
    flex-wrap: wrap;
  }

  .zhihu-shell {
    padding: 0 0 40px;
  }

  .nav-inner {
    gap: 10px;
    padding: 12px 12px;
  }

  .nav-link {
    padding: 0 12px;
  }

  .nav-links {
    gap: 12px;
  }
}
</style>
