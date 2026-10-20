import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import markdown from 'highlight.js/lib/languages/markdown'
import type { TocItem } from './types'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('markdown', markdown)

const ALIASES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  sh: 'bash',
  shell: 'bash',
  html: 'xml',
  vue: 'xml',
  md: 'markdown',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 保留中日韩字符的 slug，避免中文标题生成空锚点 */
function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_+=[\]{}|\\:;"'<>,.?/·—–]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'section'
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight(code: string, lang: string): string {
    const language = ALIASES[lang] ?? (hljs.getLanguage(lang) ? lang : '')
    if (language) {
      try {
        const highlighted = hljs.highlight(code, {
          language,
          ignoreIllegals: true,
        }).value
        return `<pre class="hljs"><code>${highlighted}</code></pre>`
      } catch {
        /* 回落到纯文本 */
      }
    }
    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`
  },
})

md.use(anchor, {
  slugify,
  permalink: anchor.permalink.ariaHidden({ symbol: '#', placement: 'after' }),
})

// 站外链接在新标签页打开
type RenderRule = NonNullable<(typeof md.renderer.rules)['link_open']>

const defaultLinkOpen: RenderRule =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = String(tokens[idx].attrGet('href') ?? '')
  if (/^https?:\/\//.test(href)) {
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noreferrer noopener')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

export function renderMarkdown(source: string): RenderedMarkdown {
  const env: Record<string, unknown> = {}
  const tokens = md.parse(source, env)

  const toc: TocItem[] = []
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (token.type !== 'heading_open') continue
    if (token.tag !== 'h2' && token.tag !== 'h3') continue
    const id = token.attrGet('id')
    const inline = tokens[i + 1]
    if (id === null || !inline) continue
    toc.push({
      id: String(id),
      text: inline.content,
      level: token.tag === 'h2' ? 2 : 3,
    })
  }

  return {
    html: md.renderer.render(tokens, md.options, env),
    toc,
  }
}
