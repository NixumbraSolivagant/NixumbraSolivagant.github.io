# 个人网站 · Personal Site

一个暗色渐变玻璃拟态风格的个人网站：主页 / 作品集 / 博客（Markdown）/ 关于，中英双语切换，带滚动入场、磁吸按钮、3D 倾斜卡片、光标光晕等动效。

- **技术栈**：Vue 3 + TypeScript + Vite + Tailwind CSS v4 + Motion（原 Framer Motion 的 DOM 版）+ Lenis
- **内容**：博客是 `content/blog/*.md`，改文案只需要动 `src/data/site.ts` 和 `src/i18n/messages/*`
- **部署**：纯静态产物（`dist/`），可放 GitHub Pages / Vercel / Netlify / 任意静态托管

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
```

其他命令：

```bash
npm run build      # 类型检查 + 生产构建，输出到 dist/
npm run preview    # 本地预览生产构建
npm run typecheck  # 只做类型检查
```

> 依赖体积约 200MB（含 Vue、Vite、Tailwind、lucide 图标）。如果磁盘紧张，`node_modules` 可以随时删掉重装。

## 目录结构

```text
content/blog/            # 博客 Markdown 正文（中英双语）
public/                  # 静态资源（favicon 等）
src/
├── components/
│   ├── layout/          # 页头、页脚、极光背景、光标光晕、滚动进度
│   ├── ui/              # Reveal / Magnetic / TiltCard / GlassCard 等基础件
│   ├── project/         # 作品卡片、封面插画、案例弹窗
│   └── blog/            # 文章卡片、目录、Markdown 渲染容器
├── composables/         # useLocale / useSeo / useLenis / useReducedMotion
├── data/site.ts         # ★ 个人信息、项目、技能、经历、社交链接
├── i18n/messages/       # ★ 界面文案的 zh / en 字典
├── lib/                 # 类型、博客解析、Markdown 渲染、日期、配色
├── pages/               # 路由页面
├── router/              # 路由表
└── styles/index.css     # ★ 设计令牌 + 玻璃质感 + 排版 + 动效
```

## 改成你自己的

| 想改什么 | 改哪里 |
| --- | --- |
| 名字、角色、邮箱、社交链接 | `src/data/site.ts` → `profile` / `socials` |
| 首页标题、简介、按钮文案 | `src/i18n/messages/zh.ts`、`en.ts` → `home` |
| 项目作品 | `src/data/site.ts` → `projects` |
| 技能与经历 | `src/data/site.ts` → `skillGroups` / `experience` |
| 博客文章 | `content/blog/*.md` |
| 配色、玻璃质感、圆角、字体 | `src/styles/index.css` → `@theme` 与 `.glass` |
| 网站标题、SEO 描述、favicon | `index.html`、`public/favicon.svg` |
| 邮箱等默认值 | `src/data/site.ts`（头像缩写是 `profile.initials`） |

站点里的示例姓名「林知语 / Zhiyu Lin」、项目与文章都是占位内容，替换成你的即可。

### 博客文章格式

文件名即 URL：`content/blog/hello-world.md` → `/blog/hello-world`。

```md
---
date: 2026-02-18
tags: design, css
cover: violet            # violet / cyan / amber / pink / emerald
title.zh: 中文标题
title.en: English title
summary.zh: 中文摘要
summary.en: English summary
---

中文正文……

<!--en-->

English body. 没有这段时，英文模式会回落到中文并显示提示。
```

- 标题支持 `##` / `###`，会自动生成带锚点的目录（TOC）
- 代码块使用 highlight.js 做语法高亮，支持 js/ts/css/html/json/bash/python/markdown
- 阅读时长按中英文字符数自动估算

## 动效设计

- 入场：`Reveal` 组件基于 `inView` + 位移/透明度，带 3 秒兜底，避免意外不显示
- 悬停：卡片 3D 倾斜（`TiltCard`）、按钮磁吸（`Magnetic`）、指针跟随高光（`spotlight`）
- 滚动：Lenis 平滑滚动 + 顶部进度条，路由切换自动回到顶部
- 降级：`prefers-reduced-motion: reduce` 时关闭位移与平滑滚动，内容直接可见

## 部署

### GitHub Pages

仓库已带 `.github/workflows/deploy.yml`：推送到 `main` 后自动构建并发布。

1. 在仓库 Settings → Pages 中把 Source 设为 **GitHub Actions**
2. **用户页**（`用户名.github.io`）：部署在根路径，工作流默认不设置 `BASE_PATH`，无需改动
3. **项目页**（`https://用户名.github.io/仓库名/`）：在 `.github/workflows/deploy.yml` 里取消 `BASE_PATH` 的注释并填入仓库名

构建时会额外复制 `dist/index.html` 为 `dist/404.html`，让 GitHub Pages 支持前端路由刷新。

### Vercel / Netlify

- 构建命令：`npm run build`
- 输出目录：`dist`
- 不需要设置 `BASE_PATH`

## 说明

- 没有引入任何外部字体或图片请求，离线也能完整显示（字体走系统栈）
- 语言偏好存在 `localStorage` 的 `zhiyu.locale`，首次访问跟随浏览器语言
- 博客内容在构建时通过 `import.meta.glob` 内联，新增文章后需要重新构建
