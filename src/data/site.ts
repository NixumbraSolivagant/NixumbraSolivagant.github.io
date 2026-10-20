import type {
  ExperienceItem,
  L,
  Project,
  SkillGroup,
  SocialLink,
  Stat,
} from '@/lib/types'

/**
 * 站点内容都集中在这里 —— 想改名字、简介、项目、经历、链接，
 * 基本只需要动这个文件。
 */
export const profile = {
  name: { zh: '林知语', en: 'Zhiyu Lin' } as L,
  shortName: { zh: '知语', en: 'Zhiyu' } as L,
  initials: 'ZL',
  role: {
    zh: '前端工程师 · Creative Developer',
    en: 'Front-end Engineer · Creative Developer',
  } as L,
  location: { zh: '上海，中国', en: 'Shanghai, China' } as L,
  email: 'hi@zhiyulin.design',
  availability: { zh: '可接新项目', en: 'Open to new projects' } as L,
  bio: {
    zh: [
      '我在 2019 年开始写前端，从静态页面做到设计系统，再到现在更关心「动效如何服务于理解」。技术会过时，但把复杂事物讲清楚的欲望不会。',
      '工作之外，我会做一些小工具和视觉实验，也把它们的过程写下来。我相信好的界面是克制的：少一点装饰，多一点节奏；少一点说明，多一点暗示。',
    ],
    en: [
      'I started writing front-end code in 2019 — from static pages to design systems, and now I care most about how motion can serve understanding. Tools go stale; the urge to make complex things clear does not.',
      'Outside work I build small tools and visual experiments, and write down the process. I believe good interfaces are restrained: less decoration, more rhythm; fewer explanations, more hints.',
    ],
  } as Record<'zh' | 'en', string[]>,
  now: {
    zh: '正在打磨个人知识库，写一个离线优先的笔记工具，并坚持每周记录一次做东西的过程。',
    en: 'Polishing a personal knowledge base, building an offline-first note tool, and keeping a weekly log of what I make.',
  } as L,
} as const

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github', handle: '@zhiyulin' },
  { label: 'X', href: 'https://x.com/', icon: 'x', handle: '@zhiyulin' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin', handle: 'in/zhiyulin' },
  { label: 'Email', href: 'mailto:hi@zhiyulin.design', icon: 'mail', handle: 'hi@zhiyulin.design' },
]

export const stats: Stat[] = [
  { value: '6+', label: { zh: '年经验', en: 'years of craft' } },
  { value: '30+', label: { zh: '个上线项目', en: 'shipped projects' } },
  { value: '12', label: { zh: '篇文章', en: 'written posts' } },
]

export const projects: Project[] = [
  {
    slug: 'aurora-ui',
    name: 'Aurora UI',
    tagline: {
      zh: '一套为数据产品而生的暗色设计系统',
      en: 'A dark design system built for data products',
    },
    description: {
      zh: '从零搭建的设计令牌与组件体系，覆盖 40+ 组件、深浅主题与无障碍规范。我在其中负责架构、动效规范与文档站点，也负责说服团队：一致性不是限制，而是速度。',
      en: 'A token and component system built from scratch: 40+ components, light and dark themes, accessibility baked in. I owned the architecture, the motion guidelines and the docs site — and the argument that consistency is speed, not a constraint.',
    },
    tags: ['Design System', 'Vue 3', 'TypeScript'],
    year: '2025',
    role: { zh: '架构与实现', en: 'Architecture & build' },
    status: 'live',
    cover: 'orbit',
    accent: { from: '#7c3aed', to: '#22d3ee', tint: '#a78bfa' },
    highlights: {
      zh: [
        '设计令牌与 40+ 组件的组件库，覆盖表单、数据展示与反馈',
        '统一的动效与焦点规范，减少了约 30% 的界面返工',
        '基于 Vite 的文档站，支持实时主题切换与代码示例',
      ],
      en: [
        'Design tokens and a 40+ component library covering forms, data display and feedback',
        'Shared motion and focus guidelines that cut interface rework by roughly 30%',
        'A Vite-powered docs site with live theme switching and runnable examples',
      ],
    },
    metrics: [
      { value: '40+', label: { zh: '组件', en: 'components' } },
      { value: '12', label: { zh: '个团队在用', en: 'teams onboard' } },
      { value: '3 周', label: { zh: '首版上线', en: 'to first release' } },
    ],
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    tagline: {
      zh: '让数据变化「看得见」的实时指标看板',
      en: 'A real-time dashboard that makes change visible',
    },
    description: {
      zh: '为运营团队做的实时监控面板。与其堆满图表，不如用克制的动效解释数值为何变化：数字滚动、趋势对比、异常高亮。首屏加载压到 1.2 秒以内。',
      en: 'A real-time monitoring panel for an operations team. Instead of piling up charts, restrained motion explains why a number changed: rolling digits, trend comparison, anomaly highlights. First paint under 1.2 seconds.',
    },
    tags: ['Dashboard', 'Motion', 'WebSocket'],
    year: '2024',
    role: { zh: '前端负责', en: 'Front-end lead' },
    status: 'live',
    cover: 'chart',
    accent: { from: '#0891b2', to: '#6366f1', tint: '#67e8f9' },
    highlights: {
      zh: [
        'WebSocket 增量更新，数字与趋势线平滑过渡而非跳变',
        '关键指标的分层信息架构：一眼看到异常，再逐层下钻',
        '筛选器完全可用键盘操作，满足无障碍要求',
      ],
      en: [
        'Incremental WebSocket updates with smooth transitions instead of jumping numbers',
        'Layered hierarchy for key metrics: spot anomalies first, drill down second',
        'Fully keyboard-operable filters that meet accessibility requirements',
      ],
    },
    metrics: [
      { value: '1.2s', label: { zh: '首屏', en: 'first paint' } },
      { value: '200+', label: { zh: '并发连接', en: 'live connections' } },
      { value: '99.9%', label: { zh: '可用性', en: 'uptime' } },
    ],
  },
  {
    slug: 'lumen',
    name: 'Lumen',
    tagline: {
      zh: '离线优先的 Markdown 笔记应用',
      en: 'An offline-first Markdown notebook',
    },
    description: {
      zh: '一个可以在飞机上安静写作的笔记工具：本地优先存储、双向链接、全文检索，所有数据都留在自己的设备上。我把「同步」做成了可选项，而不是前提。',
      en: 'A notebook for writing quietly on a plane: local-first storage, bi-directional links, full-text search — all data stays on your device. Sync is an option, not a prerequisite.',
    },
    tags: ['PWA', 'IndexedDB', 'Vue 3'],
    year: '2024',
    role: { zh: '独立开发', en: 'Solo build' },
    status: 'wip',
    cover: 'notes',
    accent: { from: '#db2777', to: '#8b5cf6', tint: '#f9a8d4' },
    highlights: {
      zh: [
        'IndexedDB 本地存储与可选的增量同步',
        '双向链接与关系图谱，笔记之间自然长出结构',
        '10 万条笔记的全文检索耗时低于 50ms',
      ],
      en: [
        'IndexedDB local storage with optional incremental sync',
        'Bi-directional links and a relationship graph, so structure grows out of the notes',
        'Full-text search across 100k notes in under 50ms',
      ],
    },
    metrics: [
      { value: '100%', label: { zh: '离线可用', en: 'offline' } },
      { value: '<50ms', label: { zh: '检索', en: 'search' } },
      { value: 'PWA', label: { zh: '安装即用', en: 'installable' } },
    ],
  },
  {
    slug: 'gradient-lab',
    name: 'Gradient Lab',
    tagline: {
      zh: '玻璃与渐变的可视化实验场',
      en: 'A playground for glass and gradients',
    },
    description: {
      zh: '一个用来调玻璃质感的小工具：实时调节模糊、噪点、边框光与渐变角度，一键导出 CSS。它也是本站视觉语言的来源——你现在看到的界面，就是在这里调出来的。',
      en: 'A small tool for tuning glass surfaces: adjust blur, grain, border light and gradient angle in real time, then export the CSS. It is also where this site’s visual language came from — the interface you are reading was tuned here.',
    },
    tags: ['Tool', 'Canvas', 'CSS'],
    year: '2025',
    role: { zh: '设计与开发', en: 'Design & code' },
    status: 'live',
    cover: 'gradient',
    accent: { from: '#f59e0b', to: '#f472b6', tint: '#fcd34d' },
    highlights: {
      zh: [
        '实时参数调节，所见即所得地导出 CSS 变量',
        '噪点与高光参数可复现，方便在团队里共享质感',
        '本站设计系统的原型，也是动效实验的第一站',
      ],
      en: [
        'Real-time parameter tuning with what-you-see-is-what-you-export CSS variables',
        'Reproducible grain and highlight values so a team can share the same feel',
        'The prototype for this site’s design system, and my first stop for motion experiments',
      ],
    },
    metrics: [
      { value: '20+', label: { zh: '可调参数', en: 'parameters' } },
      { value: '0', label: { zh: '运行时依赖', en: 'runtime deps' } },
      { value: 'MIT', label: { zh: '开源', en: 'open source' } },
    ],
    repo: 'https://github.com/',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: { zh: '工程', en: 'Engineering' },
    items: ['TypeScript', 'Vue 3', 'Vite', 'Node.js', 'Testing', 'CI/CD'],
  },
  {
    title: { zh: '界面', en: 'Interface' },
    items: ['Design Systems', 'Motion', 'Accessibility', 'Tailwind CSS', 'Figma'],
  },
  {
    title: { zh: '探索', en: 'Exploration' },
    items: ['WebGL / Three.js', 'GSAP', 'Canvas', 'Prototyping'],
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '2023 — 至今',
    org: { zh: '数据产品公司', en: 'Data product company' },
    role: { zh: '高级前端工程师', en: 'Senior Front-end Engineer' },
    desc: {
      zh: '负责设计系统与核心看板的架构。推动团队从「每个人写自己的组件」转向共享令牌与规范，并把动效纳入评审流程。',
      en: 'Led architecture for the design system and the core dashboards. Moved the team from everyone writing their own components to shared tokens and guidelines, and brought motion into code review.',
    },
    tags: ['Design System', 'Vue 3', 'Architecture'],
  },
  {
    period: '2021 — 2023',
    org: { zh: '设计咨询工作室', en: 'Design studio' },
    role: { zh: '前端工程师', en: 'Front-end Engineer' },
    desc: {
      zh: '为品牌与产品做高保真交互实现，常跟设计师从第一张草图坐到上线。学会了在「效果」和「性能」之间谈条件。',
      en: 'Built high-fidelity interactions for brands and products, often sitting with designers from the first sketch to launch. Learned to negotiate between ambition and performance.',
    },
    tags: ['Interaction', 'Animation', 'WebGL'],
  },
  {
    period: '2019 — 2021',
    org: { zh: '自由职业', en: 'Independent' },
    role: { zh: '独立开发者', en: 'Indie developer' },
    desc: {
      zh: '接小产品、做视觉实验，学会自己定义问题、自己收尾。现在仍在延续的习惯，大多来自那两年。',
      en: 'Small products, visual experiments, and learning to define the problem and finish it myself. Most habits I still keep come from those two years.',
    },
    tags: ['Freelance', 'Product', 'JavaScript'],
  },
]

/** 首页滚动条上的技术标签 */
export const marqueeTags = [
  'TypeScript',
  'Vue 3',
  'Motion',
  'Design Systems',
  'WebGL',
  'Vite',
  'Accessibility',
  'CSS',
  'Three.js',
  'Figma',
  'Node.js',
  'Performance',
]
