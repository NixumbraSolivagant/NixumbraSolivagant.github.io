<template>
  <div ref="containerRef" class="md-renderer" v-html="renderedHtml"></div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import MarkdownItMark from 'markdown-it-mark'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps({
  source: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()

const containerRef = ref(null)
const emit = defineEmits(['rendered'])

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]/g, char => char.charCodeAt(0).toString(36))
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : null
    const highlighted = language
      ? hljs.highlight(code, { language, ignoreIllegals: true }).value
      : hljs.highlightAuto(code).value
    return `<div class="code-block-wrapper" data-code="${encodeURIComponent(code)}"><pre class="hljs"><code class="hljs language-${language || 'plaintext'}">${highlighted}</code></pre></div>`
  },
})

md.use(MarkdownItMark)
md.use(anchor, {
  slugify,
  level: [2, 3, 4],
  permalink: anchor.permalink.headerLink(),
})

// Preprocessing: protect code blocks from KaTeX processing, then restore them
function preprocess(source) {
  if (!source) return ''

  const codeBlocks = []
  let placeholder = source.replace(/```[\s\S]*?```/g, match => {
    codeBlocks.push(match)
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`
  })

  placeholder = placeholder
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
      try {
        return `<div class="katex-block">${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`
      } catch {
        return `$$${formula}$$`
      }
    })
    .replace(/(?<!\w)\$([^\n$]+?)\$/g, (_, formula) => {
      try {
        return `<span class="katex-inline">${katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })}</span>`
      } catch {
        return `$${formula}$`
      }
    })

  codeBlocks.forEach((block, i) => {
    placeholder = placeholder.replace(`__CODE_BLOCK_${i}__`, block)
  })

  return placeholder
}

// Post-processing: add lazy loading to images, open external links in new tab
function postprocess(html) {
  if (!html) return html
  const currentHost = window.location.origin

  return html.replace(/<img\s+([^>]*?)>/g, (match, attrs) => {
    if (!attrs.includes('loading=')) {
      return `<img ${attrs} loading="lazy">`
    }
    return match
  }).replace(/<a\s+([^>]*?)>/g, (match, attrs) => {
    const hrefMatch = attrs.match(/href="([^"]*)"/)
    if (hrefMatch) {
      const url = hrefMatch[1]
      if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
          const urlObj = new URL(url)
          if (urlObj.origin !== currentHost) {
            if (!attrs.includes('target=')) {
              return `<a ${attrs} target="_blank" rel="noopener noreferrer">`
            }
          }
        } catch {
          // ignore invalid URLs
        }
      }
    }
    return match
  })
}

const renderedHtml = computed(() => postprocess(md.render(preprocess(props.source || ''))))

watch(renderedHtml, async () => {
  await nextTick()
  injectCopyButtons()
  emit('rendered', containerRef.value)
})

onMounted(async () => {
  await nextTick()
  injectCopyButtons()
  emit('rendered', containerRef.value)
})

function injectCopyButtons() {
  if (!containerRef.value) return
  const wrappers = containerRef.value.querySelectorAll('.code-block-wrapper:not(.copy-injected)')
  wrappers.forEach(wrapper => {
    wrapper.classList.add('copy-injected')
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.type = 'button'
    btn.setAttribute('aria-label', t('common.copyCode'))
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
    btn.addEventListener('click', () => {
      const code = decodeURIComponent(wrapper.getAttribute('data-code') || '')
      if (!code) return
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
        btn.classList.add('copied')
        setTimeout(() => {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
          btn.classList.remove('copied')
        }, 2000)
      })
    })
    wrapper.appendChild(btn)
  })
}
</script>

<style scoped>
.md-renderer {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--main_text_color);
}

.md-renderer :deep(h1),
.md-renderer :deep(h2),
.md-renderer :deep(h3),
.md-renderer :deep(h4) {
  color: var(--main_text_color);
  margin-top: 1.6rem;
  margin-bottom: 0.8rem;
  line-height: 1.3;
  scroll-margin-top: 90px;
}

.md-renderer :deep(h1) { font-size: 1.8rem; }
.md-renderer :deep(h2) { font-size: 1.45rem; border-bottom: 1px solid var(--card_stroke_color); padding-bottom: 0.4rem; }
.md-renderer :deep(h3) { font-size: 1.2rem; }

.md-renderer :deep(h2 > a),
.md-renderer :deep(h3 > a),
.md-renderer :deep(h4 > a) {
  color: inherit;
  text-decoration: none;
}

.md-renderer :deep(h2 > a:hover),
.md-renderer :deep(h3 > a:hover),
.md-renderer :deep(h4 > a:hover) {
  color: var(--accent_strong);
}

.md-renderer :deep(p) {
  color: var(--main_text_color);
  margin: 0.75rem 0;
}

.md-renderer :deep(ul),
.md-renderer :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.md-renderer :deep(li + li) {
  margin-top: 0.25rem;
}

.md-renderer :deep(li) {
  color: var(--main_text_color);
}

.md-renderer :deep(code) {
  padding: 0.18em 0.4em;
  border-radius: 6px;
  background-color: var(--item_hover_color);
  color: var(--accent_strong);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  border: 1px solid var(--card_stroke_color);
}

.md-renderer :deep(.code-block-wrapper) {
  position: relative;
  margin: 1rem 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--card_stroke_color);
}

.md-renderer :deep(.copy-btn) {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--card_stroke_color);
  border-radius: 8px;
  background: var(--item_hover_color);
  color: var(--item_left_text_color);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease, background 0.2s ease;
  z-index: 2;
}

.md-renderer :deep(.code-block-wrapper:hover .copy-btn) {
  opacity: 1;
}

.md-renderer :deep(.copy-btn:hover) {
  background: var(--accent);
  color: var(--main_text_color);
  border-color: var(--accent);
}

.md-renderer :deep(.copy-btn.copied) {
  background: var(--accent);
  color: var(--main_text_color);
  border-color: var(--accent);
  opacity: 1;
}

.md-renderer :deep(.code-block-wrapper pre) {
  margin: 0;
  padding: 1.2rem 1.4rem;
  background: var(--item_hover_color) !important;
  color: var(--main_text_color);
  overflow-x: auto;
  border-radius: 0;
  border: none;
}

.md-renderer :deep(.code-block-wrapper pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: 0.95rem;
  border: none;
  border-radius: 0;
}

.md-renderer :deep(pre) {
  padding: 1.2rem 1.4rem;
  border-radius: 14px;
  background: var(--item_hover_color);
  color: var(--main_text_color);
  overflow-x: auto;
  border: 1px solid var(--card_stroke_color);
  margin: 1rem 0;
}

.md-renderer :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: 0.95rem;
}

.md-renderer :deep(pre::-webkit-scrollbar),
.md-renderer :deep(.code-block-wrapper ::-webkit-scrollbar) {
  height: 8px;
}

.md-renderer :deep(pre::-webkit-scrollbar-thumb),
.md-renderer :deep(.code-block-wrapper ::-webkit-scrollbar-thumb) {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 999px;
}

.md-renderer :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.8rem 1.2rem;
  border-left: 4px solid var(--accent);
  background: var(--item_hover_color);
  border-radius: 0 8px 8px 0;
  color: var(--item_left_text_color);
}

.md-renderer :deep(blockquote p) {
  margin: 0.25rem 0;
  color: var(--item_left_text_color);
}

.md-renderer :deep(img) {
  max-width: 100%;
  border-radius: 14px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  border: 1px solid var(--card_stroke_color);
  margin: 1rem 0;
}

.md-renderer :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.4rem 0;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--card_stroke_color);
}

.md-renderer :deep(th),
.md-renderer :deep(td) {
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid var(--card_stroke_color);
  text-align: left;
}

.md-renderer :deep(th) {
  background: var(--item_hover_color);
  font-weight: 600;
  color: var(--main_text_color);
}

.md-renderer :deep(tr:last-child td) {
  border-bottom: none;
}

.md-renderer :deep(hr) {
  border: none;
  border-top: 1px dashed var(--card_stroke_color);
  margin: 2rem 0;
}

.md-renderer :deep(mark) {
  background-color: rgba(56, 189, 248, 0.2);
  color: var(--accent_strong);
  padding: 0.1em 0.3em;
  border-radius: 5px;
  font-weight: 600;
}

.md-renderer :deep(a) {
  color: var(--accent_strong);
  text-decoration: none;
}

.md-renderer :deep(a:hover) {
  text-decoration: underline;
}

.md-renderer :deep(.katex-block) {
  overflow-x: auto;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  background: var(--item_hover_color);
  border: 1px solid var(--card_stroke_color);
  margin: 1rem 0;
  text-align: center;
}

.md-renderer :deep(.katex-inline) {
  display: inline-block;
  vertical-align: middle;
}
</style>
