import type { L, Locale } from './types'

export interface Post {
  slug: string
  date: string
  tags: string[]
  cover: string
  title: L
  summary: L
  body: Record<Locale, string>
  readingMinutes: Record<Locale, number>
  hasEnglish: boolean
}

interface RawFrontmatter {
  [key: string]: string
}

const rawFiles = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const EN_MARKER = /<!--\s*en\s*-->/i

function stripQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontmatter(raw: string): { data: RawFrontmatter; body: string } {
  const match = FRONTMATTER.exec(raw)
  if (!match) return { data: {}, body: raw.trim() }

  const data: RawFrontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf(':')
    if (index === -1) continue
    const key = trimmed.slice(0, index).trim()
    const value = stripQuotes(trimmed.slice(index + 1))
    if (key) data[key] = value
  }

  return { data, body: raw.slice(match[0].length).trim() }
}

function countReadingMinutes(text: string): number {
  const plain = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')

  const cjk = (plain.match(/[\u3400-\u9fff\u3040-\u30ff]/g) ?? []).length
  const latin = plain
    .replace(/[\u3400-\u9fff\u3040-\u30ff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(cjk / 350 + latin / 200))
}

function toPost(path: string, raw: string): Post {
  const { data, body } = parseFrontmatter(raw)
  const [zhRaw, enRaw] = body.split(EN_MARKER)
  const zh = (zhRaw ?? '').trim()
  const en = (enRaw ?? '').trim()

  const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path

  return {
    slug,
    date: data.date ?? '',
    tags: (data.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    cover: data.cover ?? 'violet',
    title: { zh: data['title.zh'] ?? slug, en: data['title.en'] ?? data['title.zh'] ?? slug },
    summary: { zh: data['summary.zh'] ?? '', en: data['summary.en'] ?? data['summary.zh'] ?? '' },
    body: { zh, en: en || zh },
    readingMinutes: {
      zh: countReadingMinutes(zh),
      en: countReadingMinutes(en || zh),
    },
    hasEnglish: en.length > 0,
  }
}

export const posts: Post[] = Object.entries(rawFiles)
  .map(([path, raw]) => toPost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return {}
  return {
    prev: posts[index + 1],
    next: posts[index - 1],
  }
}

export function getRelatedPosts(post: Post, limit = 2): Post[] {
  return posts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score: item.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.item.date < b.item.date ? 1 : -1))
    .slice(0, limit)
    .map(({ item }) => item)
}

export const allTags: string[] = Array.from(
  new Set(posts.flatMap((post) => post.tags)),
).sort()

export const latestPosts = posts.slice(0, 3)
