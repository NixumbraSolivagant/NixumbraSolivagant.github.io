import type {
  ExperienceItem,
  L,
  Project,
  SkillGroup,
  SocialLink,
  Stat,
} from '@/lib/types'

/**
 * 站点内容都集中在这里。
 * 信息取自胡明璋（NIX）本人已有的站点与文章，未添加虚构的经历或数据。
 */
export const profile = {
  name: { zh: '胡明璋', en: 'Mingzhang Hu' } as L,
  shortName: { zh: 'NIX', en: 'NIX' } as L,
  initials: 'N',
  avatar: '/avatar.webp',
  tagline: { zh: 'CS · 天文与机器学习', en: 'CS · Astronomy & ML' } as L,
  role: {
    zh: '计算机专业学生 · 天文与机器学习',
    en: 'CS Student · Astronomy & Machine Learning',
  } as L,
  location: { zh: '江西 · 南昌', en: 'Jiangxi · Nanchang' } as L,
  email: 'Hmzemc333@outlook.com',
  availability: { zh: '在读 · 欢迎交流', en: 'Studying · open to chat' } as L,
  bio: {
    zh: [
      '我是胡明璋，网上常用 NIX 这个名字。一名计算机专业的学生，目前住在江西南昌，对天文和机器学习保持着长期的好奇——一个让我抬头看星星，一个让我低头读数据。',
      '这个网站是我自己写和维护的数字空间：技术长文、前端动效实验，还有一些关于学习的记录。比起堆功能，我更在意它读起来是否清楚、用起来是否顺手。',
    ],
    en: [
      'I am Mingzhang Hu — NIX online. A computer science student based in Nanchang, Jiangxi, with a long-standing curiosity about astronomy and machine learning: one makes me look up at the stars, the other makes me look down at data.',
      'This site is a digital space I build and maintain myself: long-form technical notes, front-end motion experiments, and some records of learning. I care less about piling on features than about whether it reads clearly and feels right to use.',
    ],
  } as Record<'zh' | 'en', string[]>,
  now: {
    zh: '在补数学与机器学习的基础，整理从 MDP 到 GNN 的系列笔记；同时在重写这个网站。',
    en: 'Filling in the maths and machine-learning foundations, writing a series from MDP to GNN — and rewriting this site at the same time.',
  } as L,
} as const

export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/NixumbraSolivagant',
    icon: 'github',
    handle: '@NixumbraSolivagant',
  },
  {
    label: 'Email',
    href: 'mailto:Hmzemc333@outlook.com',
    icon: 'mail',
    handle: 'Hmzemc333@outlook.com',
  },
]

export const stats: Stat[] = [
  { value: '11', label: { zh: '篇技术长文', en: 'long-form posts' } },
  { value: '12', label: { zh: '个动效实验', en: 'motion experiments' } },
  { value: '5', label: { zh: '项业余爱好', en: 'hobbies' } },
]

export const projects: Project[] = [
  {
    slug: 'nix-site',
    name: 'NIX Site',
    tagline: {
      zh: '我的个人数字空间：博客、动效实验与地球可视化',
      en: 'My digital home: notes, motion experiments and a globe',
    },
    description: {
      zh: '从一张单页主页起步的个人网站，现在包含博客、动画实验室、访客地图与中英切换。当前版本用 Vue 3 + Vite 重写：文章在构建时从 Markdown 载入，整站是纯静态产物，部署在 GitHub Pages 上。',
      en: 'A personal site that started as a single page and now holds a blog, an animation lab, a visitor map and a bilingual switcher. This version is a Vue 3 + Vite rewrite: posts load from Markdown at build time, the output is fully static, and it ships on GitHub Pages.',
    },
    tags: ['Vue 3', 'Vite', 'Three.js'],
    year: '2025 — 2026',
    role: { zh: '设计与开发', en: 'Design & build' },
    status: 'live',
    cover: 'orbit',
    accent: { from: '#7c3aed', to: '#22d3ee', tint: '#a78bfa' },
    highlights: {
      zh: [
        'Vue 3 + Vite 静态站点，GitHub Pages 自动部署',
        '11 篇 Markdown 长文的解析、目录与代码高亮',
        '地球可视化，以及 12 个独立动效模块',
      ],
      en: [
        'A static Vue 3 + Vite site deployed to GitHub Pages',
        'Markdown parsing, table of contents and syntax highlighting for 11 long posts',
        'A globe visualisation plus 12 standalone motion modules',
      ],
    },
    metrics: [
      { value: '11', label: { zh: '篇文章', en: 'posts' } },
      { value: '12', label: { zh: '个动效', en: 'animations' } },
      { value: '2', label: { zh: '种语言', en: 'languages' } },
    ],
  },
  {
    slug: 'animation-lab',
    name: 'Animation Lab',
    tagline: {
      zh: '用 Canvas 和 WebGL 做的 12 个视觉实验',
      en: 'Twelve visual experiments in Canvas and WebGL',
    },
    description: {
      zh: '星云粒子、波形隧道、量子魔方、生命游戏……每个动画都是一个独立模块，用 Three.js 或 Canvas 手写，可以从卡片全屏打开。它们也是我练习数学可视化与渲染的地方。',
      en: 'Nebula particles, a waveform tunnel, a quantum cube, the Game of Life — each animation is a standalone module written by hand with Three.js or Canvas, and can be opened full screen from its card. This is where I practise mathematical visualisation and rendering.',
    },
    tags: ['Canvas', 'WebGL', 'Three.js'],
    year: '2026',
    role: { zh: '独立开发', en: 'Solo build' },
    status: 'live',
    cover: 'gradient',
    accent: { from: '#0891b2', to: '#6366f1', tint: '#67e8f9' },
    highlights: {
      zh: [
        '12 个独立动画模块，全部自己实现',
        '粒子系统、参数化曲面与元胞自动机',
        '每个实验都可以从卡片全屏观看',
      ],
      en: [
        '12 standalone modules, all implemented by hand',
        'Particle systems, parametric surfaces and cellular automata',
        'Every experiment opens full screen from its card',
      ],
    },
    metrics: [
      { value: '12', label: { zh: '个模块', en: 'modules' } },
      { value: '2D/3D', label: { zh: '渲染', en: 'rendering' } },
      { value: '∞', label: { zh: '帧', en: 'frames' } },
    ],
  },
  {
    slug: 'ml-notes',
    name: 'ML Notes',
    tagline: {
      zh: '从 MDP 到 GNN 的六篇机器学习长文',
      en: 'Six long-form machine-learning notes, from MDP to GNN',
    },
    description: {
      zh: '一个持续更新的机器学习笔记系列：强化学习、CNN、LSTM、随机森林、XGBoost、图神经网络。每篇都从直觉出发，补上数学推导，再落到 Python 代码。',
      en: 'An ongoing series of machine-learning notes: reinforcement learning, CNN, LSTM, random forests, XGBoost and graph neural networks. Each post starts from intuition, fills in the mathematics, and lands on Python code.',
    },
    tags: ['Python', 'PyTorch', 'Machine Learning'],
    year: '2026',
    role: { zh: '写作与代码', en: 'Writing & code' },
    status: 'live',
    cover: 'chart',
    accent: { from: '#db2777', to: '#8b5cf6', tint: '#f9a8d4' },
    highlights: {
      zh: [
        '6 篇长文，覆盖从 MDP 到 GNN',
        '每篇包含原理、公式推导与实战代码',
        '随博客持续修订',
      ],
      en: [
        'Six long posts covering MDP through GNN',
        'Principles, derivations and working code in every post',
        'Revised continuously alongside the blog',
      ],
    },
    metrics: [
      { value: '6', label: { zh: '篇长文', en: 'long posts' } },
      { value: '公式', label: { zh: '推导', en: 'derivations' } },
      { value: 'Python', label: { zh: '实战', en: 'practice' } },
    ],
  },
  {
    slug: 'math-notes',
    name: 'Math Notes',
    tagline: {
      zh: '微积分与常微分方程的结构化整理',
      en: 'Structured notes on calculus and differential equations',
    },
    description: {
      zh: '为复习和查阅写下的数学笔记：一篇把极限求解拆成 21 种方法，按未定式分类；另一篇按类型整理常微分方程与解法。目标是让公式之间的逻辑关系一眼可见。',
      en: 'Maths notes written for revision and reference: one breaks limit techniques into 21 methods grouped by indeterminate form; the other organises ODEs and their solutions by type. The goal is to make the logical relationships between formulas visible at a glance.',
    },
    tags: ['Math', 'Writing'],
    year: '2026',
    role: { zh: '写作', en: 'Writing' },
    status: 'live',
    cover: 'notes',
    accent: { from: '#f59e0b', to: '#f472b6', tint: '#fcd34d' },
    highlights: {
      zh: [
        '极限 21 种方法，按未定式分类',
        '常微分方程的类型与解法对照',
        '面向查阅，而不是从头讲起',
      ],
      en: [
        '21 limit techniques grouped by indeterminate form',
        'A type-by-type reference for ordinary differential equations',
        'Written for looking things up, not for reading from scratch',
      ],
    },
    metrics: [
      { value: '2', label: { zh: '篇笔记', en: 'notes' } },
      { value: '21', label: { zh: '种方法', en: 'methods' } },
      { value: 'KaTeX', label: { zh: '公式排版', en: 'typesetting' } },
    ],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: { zh: '前端与可视化', en: 'Front-end & Visualisation' },
    items: ['Vue.js', 'JavaScript', 'HTML/CSS', 'Three.js', 'D3.js'],
  },
  {
    title: { zh: '语言与系统', en: 'Languages & Systems' },
    items: ['Python', 'C/C++', 'Linux', 'Git'],
  },
  {
    title: { zh: '工具与实践', en: 'Tools & Practice' },
    items: ['Vite', 'Markdown', 'Canvas', 'WebGL'],
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '2026.10 — 至今',
    org: { zh: 'NIX Site v3', en: 'NIX Site v3' },
    role: { zh: '重写与双语化', en: 'Rewrite & bilingual' },
    desc: {
      zh: '用 Vue 3 + Vite + Motion 重写整站，加入玻璃质感、中英切换和新的 Markdown 博客管线。',
      en: 'Rewrote the whole site with Vue 3 + Vite + Motion, adding a glass aesthetic, a bilingual switcher and a new Markdown blog pipeline.',
    },
    tags: ['Vue 3', 'Motion', 'i18n'],
  },
  {
    period: '2026.05',
    org: { zh: 'NIX Site v2', en: 'NIX Site v2' },
    role: { zh: '全面优化', en: 'Full redesign' },
    desc: {
      zh: '加入博客、动画实验室、访客地图与中英切换，站点从单页变成完整的个人空间。',
      en: 'Added a blog, an animation lab, a visitor map and a language switch, turning a single page into a complete personal space.',
    },
    tags: ['Three.js', 'Markdown', 'i18n'],
  },
  {
    period: '2026.01',
    org: { zh: 'NIX Site v1', en: 'NIX Site v1' },
    role: { zh: '搭建初版', en: 'First version' },
    desc: {
      zh: '从一张单页开始，用 Vue 3 + Vite 搭起个人主页，部署到 GitHub Pages。',
      en: 'Started with a single page, built the personal homepage with Vue 3 + Vite, and deployed it to GitHub Pages.',
    },
    tags: ['Vue 3', 'Vite', 'GitHub Pages'],
  },
  {
    period: '2025.07',
    org: { zh: '第一篇技术笔记', en: 'First technical note' },
    role: { zh: '开始写作', en: 'Started writing' },
    desc: {
      zh: '写下「博客搭建记录」，之后逐步扩展到机器学习与数学的长文系列。',
      en: 'Wrote “Notes on building this blog”, which later grew into long-form series on machine learning and mathematics.',
    },
    tags: ['Markdown', 'Writing'],
  },
]

/** 首页滚动条上的技术标签 */
export const marqueeTags = [
  'Vue.js',
  'JavaScript',
  'Three.js',
  'Python',
  'D3.js',
  'Canvas',
  'WebGL',
  'Machine Learning',
  'Markdown',
  'Git',
  'Linux',
  'C/C++',
]
