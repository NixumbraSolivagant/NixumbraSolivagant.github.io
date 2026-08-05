# Personal Web

基于 Vue 3、Vite、Three.js 构建的个人网站，包含首页、博客、关于页和动画展示页。

## 本地开发

```bash
npm ci
npm run dev
```

## 生产构建

```bash
npm run build
npm run preview
```

生产构建会自动生成：

- `dist/media-manifest.json`：背景媒体清单
- `dist/404.html`：GitHub Pages 的 SPA 路由回退页

## GitHub Pages

推送到 `master` 后，`.github/workflows/gh-pages.yml` 会构建并发布到 `gh-pages`。Snake 工作流更新 SVG 后也会自动触发重新部署，避免源码分支与线上页面不一致。
