<template>
  <div ref="containerRef" class="md-renderer markdown-body" v-html="renderedHtml"></div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import MarkdownItMark from 'markdown-it-mark'
import hljs from 'highlight.js'
import katex from 'katex'

const props = defineProps({
  source: {
    type: String,
    default: '',
  },
})

const containerRef = ref(null)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    }
    return hljs.highlightAuto(code).value
  },
})
md.use(MarkdownItMark)

function preprocess(source) {
  if (!source) return ''
  return source
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
      try {
        return `<div class="katex-block">${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`
      } catch {
        return `$$${formula}$$`
      }
    })
    .replace(/\$([^\n$]+?)\$/g, (_, formula) => {
      try {
        return `<span class="katex-inline">${katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })}</span>`
      } catch {
        return `$${formula}$`
      }
    })
}

const renderedHtml = computed(() => md.render(preprocess(props.source || '')))

const emit = defineEmits(['rendered'])

watch(renderedHtml, () => {
  emit('rendered', containerRef.value)
})
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
}

.md-renderer :deep(h1) { font-size: 1.8rem; }
.md-renderer :deep(h2) { font-size: 1.45rem; }
.md-renderer :deep(h3) { font-size: 1.2rem; }

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

.md-renderer :deep(pre::-webkit-scrollbar) {
  height: 8px;
}

.md-renderer :deep(pre::-webkit-scrollbar-thumb) {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 999px;
}

.md-renderer :deep(blockquote) {
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 4px solid var(--accent);
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