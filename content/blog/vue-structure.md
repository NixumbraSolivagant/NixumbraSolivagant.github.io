---
date: 2025-12-09
tags: vue, engineering, architecture
cover: amber
title.zh: Vue 3 项目里，我会怎样组织一个可扩展的前端
title.en: How I structure a Vue 3 front end that can grow
summary.zh: 可扩展不是把所有东西抽象成 hook，而是让「改一个地方」的代价保持很低。分享我这几年稳定下来的分层方式。
summary.en: Extensibility is not turning everything into a hook. It is keeping the cost of “change one thing” low. Here is the layering I have settled on.
---

每次接手一个中型 Vue 项目，我最先看的不是组件写得好不好，而是目录结构有没有「意图」。因为可扩展性不是把所有东西抽象成 composable，而是让**改一个地方**的代价保持很低。

下面是我这几年稳定下来的一套分层，没有银弹，但足够耐用。

## 按职责分，而不是按文件类型分

新手常见的结构是按文件类型分：`components/`、`utils/`、`hooks/`。项目小的时候没问题，一旦有五十个组件，`components/` 就会变成一个垃圾场——你不知道哪些是布局、哪些是业务、哪些是纯展示。

我倾向于按**职责**分层：

```text
src/
├── components/      # 可复用的展示单元（无业务知识）
│   ├── ui/          # 按钮、卡片、标签……纯展示
│   ├── layout/      # 页头、页脚、背景等全局结构
│   └── blog/        # 业务相关的展示组合
├── composables/     # 有状态、可复用的行为
├── data/            # 站点内容（项目、经历、社交链接）
├── lib/             # 无副作用的纯函数与类型
├── i18n/            # 文案字典
├── pages/           # 路由级页面
└── router/          # 路由定义
```

关键不是这个具体形状，而是**依赖方向单一**：`pages → components → lib`，反过来永远不允许。`lib` 里不允许 import 任何 Vue 组件。

## 内容和界面必须分开

这条是我踩坑最多的地方。早期我会把「项目名称、简介、标签」直接写在组件模板里，结果改一次文案要翻五个文件。

现在的做法是：所有站点内容放进 `data/`，并且**内容自带双语字段**：

```ts
export const profile = {
  name: { zh: '林知语', en: 'Zhiyu Lin' },
  role: { zh: '前端工程师', en: 'Front-end Engineer' },
}
```

界面只负责「怎么展示」，不负责「展示什么」。这样换文案、加语言、接 CMS，都只动一处。

更进一步，博客正文直接是 `content/` 下的 Markdown 文件，通过 `import.meta.glob` 在构建时读入——发布新文章就是加一个文件，不需要改任何组件代码。

## composable 的边界：行为，不是结构

我见过两种极端：一种把所有逻辑塞进组件，另一种把每个 `ref` 都抽成 composable。前者难复用，后者难阅读。

我的判断标准是：**这段逻辑是否被两个以上组件使用，或者它是否包含副作用（DOM、存储、订阅）**。满足其一才值得抽出来。

比如：

- `useLocale()`：多处使用，且读写 localStorage —— 抽；
- `useReveal()`：绑定 IntersectionObserver —— 抽；
- 一个只用来算 `fullName` 的 `computed` —— 留在组件里。

composable 应该返回**行为**，而不是强行返回一堆状态让调用方拼装。

## 路由即页面契约

页面组件只从路由参数里拿输入，不依赖全局单例。这样每个页面都可以被单独测试，也可以在需要时换成服务端渲染。

```ts
const routes = [
  { path: '/', component: () => import('@/pages/HomePage.vue') },
  { path: '/blog/:slug', component: () => import('@/pages/PostPage.vue') },
]
```

懒加载路由还有个额外好处：博客的 Markdown 渲染器和语法高亮不会进入首页包体。

## 三条我一直在守的规则

1. **单一数据源**：同一个信息只允许有一个出处，其他地方都是派生。
2. **边界明确**：展示组件不知道路由，数据层不知道 DOM。
3. **可删除**：如果一个抽象不能在不改调用方的情况下被删除，它就不是抽象，是耦合。

结构本身不会让项目变好，但它会让「变好」这件事变得便宜。

<!--en-->

Whenever I inherit a mid-sized Vue project, the first thing I look at is not component quality but whether the folder structure has *intent*. Extensibility is not turning everything into a composable — it is keeping the cost of changing one thing low.

Here is the layering I have settled on. No silver bullet, but it lasts.

## Split by responsibility, not by file type

The usual beginner structure splits by file type: `components/`, `utils/`, `hooks/`. Fine when small; at fifty components, `components/` becomes a junk drawer — you cannot tell layout from business logic from pure presentation.

I layer by **responsibility**:

```text
src/
├── components/      # reusable presentation units (no business knowledge)
│   ├── ui/          # button, card, tag — pure display
│   ├── layout/      # header, footer, background — global structure
│   └── blog/        # business-aware presentation
├── composables/     # stateful, reusable behaviour
├── data/            # site content (projects, experience, socials)
├── lib/             # pure functions and types, no side effects
├── i18n/            # message dictionaries
├── pages/           # route-level pages
└── router/          # route definitions
```

What matters is not the exact shape but the **single direction of dependency**: `pages → components → lib`, never the reverse. Nothing in `lib` may import a Vue component.

## Separate content from interface

This is where I have been burned most. Early on I wrote project names, blurbs and tags straight into templates; changing one sentence meant opening five files.

Now all site content lives in `data/`, and **content carries its own bilingual fields**:

```ts
export const profile = {
  name: { zh: '林知语', en: 'Zhiyu Lin' },
  role: { zh: '前端工程师', en: 'Front-end Engineer' },
}
```

Components decide *how* to show, never *what* to show. Changing copy, adding a language or plugging in a CMS all touch one place.

Going further, blog posts are Markdown files under `content/`, loaded at build time with `import.meta.glob`. Publishing is adding a file — no component changes.

## Composables: behaviour, not structure

I have seen both extremes: all logic stuffed into components, or every `ref` extracted into a composable. The first is hard to reuse, the second is hard to read.

My test: **is this logic used by two or more components, or does it own a side effect (DOM, storage, subscription)?** Either one justifies extraction.

So:

- `useLocale()` — used widely, touches localStorage: extract;
- `useReveal()` — binds an IntersectionObserver: extract;
- a `computed` that only derives a full name: leave it in the component.

A composable should return **behaviour**, not a bag of state for the caller to assemble.

## Routes are the page contract

Page components take input from route params only, never from global singletons. That keeps each page independently testable and swappable for SSR later.

```ts
const routes = [
  { path: '/', component: () => import('@/pages/HomePage.vue') },
  { path: '/blog/:slug', component: () => import('@/pages/PostPage.vue') },
]
```

Lazy routes have a second benefit: the Markdown renderer and syntax highlighter stay out of the home page bundle.

## Three rules I keep

1. **Single source of truth**: one origin per piece of information; everything else derives.
2. **Clear boundaries**: presentation components know nothing about routing; the data layer knows nothing about the DOM.
3. **Deletable**: if an abstraction cannot be removed without touching its callers, it is not an abstraction — it is coupling.

Structure alone does not make a project good, but it makes getting better cheap.
