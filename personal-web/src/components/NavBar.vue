<template>
  <nav class="blog-nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-brand">
        Nix
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">{{ t('nav.home') }}</router-link>
        <router-link to="/blog" class="nav-link">{{ t('nav.blog') }}</router-link>
        <router-link to="/about" class="nav-link">{{ t('nav.about') }}</router-link>
        <router-link to="/animation" class="nav-link">{{ t('nav.animation') }}</router-link>
      </div>

      <div class="nav-right">
        <button
          class="lang-switch"
          :title="locale === 'zh' ? t('common.switchToEn') : t('common.switchToZh')"
          @click="toggleLocale"
        >
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>

        <a
          class="nav-cta"
          href="https://github.com/NixumbraSolivagant"
          target="_blank"
          rel="noreferrer"
        >
          {{ t('nav.github') }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, i18n } from '@/i18n/index.js'

const { t, locale: currentLocale } = useI18n()
const locale = currentLocale

function toggleLocale() {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('locale', next)
}
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
  background: linear-gradient(
    90deg,
    hsl(280, 80%, 60%),
    hsl(320, 80%, 60%),
    hsl(0,   80%, 60%),
    hsl(40,  80%, 60%),
    hsl(80,  80%, 60%),
    hsl(140, 80%, 60%),
    hsl(200, 80%, 60%),
    hsl(260, 80%, 60%),
    hsl(280, 80%, 60%)
  );
  background-size: 300% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: brand-rainbow 6s ease-in-out infinite;
  transition: filter 0.3s ease;
}

.nav-brand:hover {
  filter: brightness(1.15);
}

@keyframes brand-rainbow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.lang-switch {
  border: none;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--item_hover_color);
  color: var(--main_text_color);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid var(--card_stroke_color);
  transition: all 0.2s ease;
  opacity: 0.85;
  letter-spacing: 0.04em;
}

.lang-switch:hover {
  opacity: 1;
  background: var(--accent);
  border-color: transparent;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .blog-nav {
    border-radius: 0;
  }

  .nav-inner {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: 12px 12px;
  }

  .nav-links {
    order: 3;
    flex-wrap: wrap;
    gap: 12px;
  }

  .nav-link {
    padding: 0 12px;
  }

  .nav-right {
    order: 2;
  }
}
</style>
