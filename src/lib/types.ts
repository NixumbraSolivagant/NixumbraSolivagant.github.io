export type Locale = 'zh' | 'en'

/** 一段双语文本 */
export type L = Record<Locale, string>

/** 一组双语条目 */
export type LList = Record<Locale, string[]>

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export type ProjectStatus = 'live' | 'wip' | 'archive'

export interface SocialLink {
  label: string
  href: string
  icon: 'github' | 'x' | 'linkedin' | 'mail' | 'rss'
  handle?: string
}

export interface Stat {
  value: string
  label: L
}

export interface ProjectMetric {
  value: string
  label: L
}

export type CoverVariant = 'orbit' | 'chart' | 'notes' | 'gradient'

export interface Project {
  slug: string
  name: string
  tagline: L
  description: L
  tags: string[]
  year: string
  role: L
  status: ProjectStatus
  cover: CoverVariant
  accent: { from: string; to: string; tint: string }
  highlights: LList
  metrics: ProjectMetric[]
  href?: string
  repo?: string
}

export interface SkillGroup {
  title: L
  items: string[]
}

export interface ExperienceItem {
  period: string
  org: L
  role: L
  desc: L
  tags: string[]
}
