import katex from 'katex'
import 'katex/dist/katex.min.css'
import MarkdownIt from 'markdown-it'

/**
 * 轻量 KaTeX 插件：支持 $...$ 行内公式与 $$...$$ 块级公式。
 * 不额外引入 markdown-it-katex，避免其与新版本 markdown-it 的兼容问题。
 */

const DOLLAR = 0x24
const BACKSLASH = 0x5c
const NEWLINE = 0x0a

interface InlineState {
  src: string
  pos: number
  posMax: number
  push: (type: string, tag: string, nesting: 0 | 1 | -1) => {
    content: string
    markup: string
  }
}

interface BlockState {
  src: string
  bMarks: number[]
  eMarks: number[]
  tShift: number[]
  sCount: number[]
  blkIndent: number
  line: number
  push: (type: string, tag: string, nesting: 0 | 1 | -1) => {
    content: string
    markup: string
    block?: boolean
    map?: [number, number] | null
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderMath(source: string, displayMode: boolean): string {
  try {
    return katex.renderToString(source, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      output: 'html',
    })
  } catch {
    return `<code class="math-error">${escapeHtml(source)}</code>`
  }
}

function isEscaped(src: string, pos: number): boolean {
  let count = 0
  let i = pos - 1
  while (i >= 0 && src.charCodeAt(i) === BACKSLASH) {
    count += 1
    i -= 1
  }
  return count % 2 === 1
}

function mathInline(state: InlineState, silent: boolean): boolean {
  if (state.src.charCodeAt(state.pos) !== DOLLAR) return false
  if (state.pos + 1 >= state.posMax) return false

  const start = state.pos + 1
  if (/\s/.test(state.src[start])) return false

  let pos = start
  let found = false

  while (pos < state.posMax) {
    const code = state.src.charCodeAt(pos)
    if (code === NEWLINE) return false
    if (code === DOLLAR && !isEscaped(state.src, pos)) {
      found = true
      break
    }
    pos += 1
  }

  if (!found || pos === start) return false
  if (/\s/.test(state.src[pos - 1])) return false

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, pos)
  }

  state.pos = pos + 1
  return true
}

function mathBlock(
  state: BlockState,
  startLine: number,
  endLine: number,
  silent: boolean,
): boolean {
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]

  if (state.sCount[startLine] - state.blkIndent >= 4) return false
  if (pos + 2 > max) return false
  if (
    state.src.charCodeAt(pos) !== DOLLAR ||
    state.src.charCodeAt(pos + 1) !== DOLLAR
  ) {
    return false
  }

  pos += 2
  const firstLine = state.src.slice(pos, max)

  let content = ''
  let lastLine = startLine
  let found = false

  if (firstLine.trim().endsWith('$$')) {
    content = firstLine.trim().slice(0, -2)
    found = true
  } else {
    content = firstLine
    for (let next = startLine + 1; next < endLine; next += 1) {
      const lineStart = state.bMarks[next] + state.tShift[next]
      const lineEnd = state.eMarks[next]
      const line = state.src.slice(lineStart, lineEnd)
      content += `\n${line}`
      if (line.trim().endsWith('$$')) {
        content = content.slice(0, content.lastIndexOf('$$'))
        found = true
        lastLine = next
        break
      }
    }
  }

  if (!found) return false
  if (silent) return true

  const token = state.push('math_block', 'math', 0)
  token.block = true
  token.markup = '$$'
  token.content = content.trim()
  token.map = [startLine, lastLine + 1]

  state.line = lastLine + 1
  return true
}

export function mathPlugin(md: InstanceType<typeof MarkdownIt>): void {
  md.inline.ruler.after('escape', 'math_inline', mathInline)
  md.block.ruler.after('blockquote', 'math_block', mathBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })

  md.renderer.rules.math_inline = (tokens, idx) =>
    renderMath(tokens[idx].content, false)

  md.renderer.rules.math_block = (tokens, idx) =>
    `<div class="math-block">${renderMath(tokens[idx].content, true)}</div>\n`
}
