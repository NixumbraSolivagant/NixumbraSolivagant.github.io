---
date: 2026-01-27
tags: motion, vue, performance
cover: cyan
title.zh: 用 Motion 做「有重量」的滚动动效
title.en: Scroll motion with weight, using Motion
summary.zh: 滚动动效最容易做坏的地方，是让用户觉得页面在抢方向盘。这篇讲三个我一直在用的原则和对应实现。
summary.en: The fastest way to ruin scroll motion is to make the page fight the user for the steering wheel. Three principles and how I implement them.
---

滚动动效很容易做坏。最常见的失败不是「不够炫」，而是页面开始抢方向盘：你往下滚，它偏要慢慢飘；你想停，它还在惯性滑行；你回头看一眼内容，它已经开始表演。

我把自己的做法收敛成三个原则：**跟随、惯性、克制**。下面结合 Motion 的 `inView` 和 `scroll` 讲讲具体实现。

## 原则一：入场要「跟随」滚动，而不是被滚动触发

很多实现是「滚到某个位置 → 元素突然开始动画」。问题在于，用户滚动的速度和动画的节奏是脱节的。

更好的做法是把动画绑定到滚动进度上：滚到多少，就播放到多少。这样元素始终跟着手指走，用户不会觉得自己在和页面博弈。

```ts
import { scroll, animate } from 'motion'

// 元素进入视口到离开视口的整个区间，0 → 1 映射到 0% → 100%
scroll(
  animate('.hero-visual', { y: [0, -80], rotate: [0, 2] }),
  { target: '.hero', offset: ['start end', 'end start'] },
)
```

`scroll()` 的好处是它内部用 `ScrollTimeline`（不支持时降级到 rAF），并自动帮你算好区间，不需要手写 `getBoundingClientRect`。

## 原则二：动效要有「质量」

统一用 `ease-out` 会让所有东西看起来一样重。我的习惯是按元素体量分配：

- 小元素（图标、标签）：`0.18s`，`ease-out`，几乎无位移；
- 卡片、图片：`0.5–0.8s`，`cubic-bezier(0.22, 1, 0.36, 1)`，位移 `16–32px`；
- 整屏区块：`0.9–1.2s`，位移更大但透明度变化更缓。

体量越大，越要「慢而稳」；体量越小，越要「快而准」。这就是所谓的重量感。

```ts
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

animate(el, { opacity: [0, 1], y: [24, 0] }, {
  duration: 0.8,
  easing: EASE_OUT_EXPO,
  delay: 0.06 * index,
})
```

`delay` 的间隔不要超过 `0.08s`。超过之后，最后几个元素会显得「姗姗来迟」，列表看起来像卡住了。

## 原则三：只动 transform 和 opacity

这条是老生常谈，但还是值得重复：`top`、`left`、`width`、`height`、`box-shadow` 的动画都会触发重排或重绘。

我允许自己动的属性只有四个：`transform`、`opacity`、`filter`（谨慎）、以及 `clip-path`（谨慎）。投影的变化用伪元素配合 `opacity` 来实现，而不是直接动 `box-shadow`。

还有一个容易忽略的点：给动画元素加上 `will-change: transform`，但**动画结束后要移除**，否则会一直占着合成层。

## 什么时候干脆不动

- 用户在 `prefers-reduced-motion: reduce` 下：全部降级为直接显示；
- 滚动方向频繁反转时：暂停视差，避免晕动感；
- 移动端低端设备：减少同时动画的元素数量。

最后一点比技巧重要：**动效的价值在于帮助理解，而不是证明你会做动效**。如果一个动画删掉之后，用户依然能顺畅完成任务，那它大概率可以删掉。

<!--en-->

Scroll motion is easy to ruin. The most common failure is not “not flashy enough” — it is the page fighting the user for the steering wheel. You scroll down, it drifts slowly. You stop, it keeps gliding. You look back at something, and it is already performing.

I boil my approach down to three principles: **follow, weight, restraint**. Here is how they map onto Motion’s `inView` and `scroll`.

## Principle one: entrances should follow the scroll, not be triggered by it

A lot of implementations wait for “scroll to position X, then play the animation”. The problem is that the user’s scroll speed and the animation’s rhythm are disconnected.

Better: bind the animation to scroll progress. However far you have scrolled is how far the animation has played. The element moves with your finger, and you never feel like you are negotiating with the page.

```ts
import { scroll, animate } from 'motion'

scroll(
  animate('.hero-visual', { y: [0, -80], rotate: [0, 2] }),
  { target: '.hero', offset: ['start end', 'end start'] },
)
```

`scroll()` uses `ScrollTimeline` under the hood (falling back to rAF) and computes the range for you, so no manual `getBoundingClientRect`.

## Principle two: motion should have mass

Using `ease-out` everywhere makes everything feel equally heavy. I allocate by the size of the thing:

- small elements (icons, tags): `0.18s`, `ease-out`, almost no travel;
- cards and images: `0.5–0.8s`, `cubic-bezier(0.22, 1, 0.36, 1)`, `16–32px`;
- full sections: `0.9–1.2s`, more travel but a softer opacity curve.

The bigger the object, the slower and steadier it should be. The smaller, the quicker and more precise. That is where the sense of weight comes from.

```ts
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

animate(el, { opacity: [0, 1], y: [24, 0] }, {
  duration: 0.8,
  easing: EASE_OUT_EXPO,
  delay: 0.06 * index,
})
```

Keep stagger intervals under `0.08s`. Beyond that, the last few items feel late and the list looks stuck.

## Principle three: only animate transform and opacity

A cliché, but worth repeating: animating `top`, `left`, `width`, `height` or `box-shadow` causes layout or paint work.

I allow myself four properties: `transform`, `opacity`, `filter` (carefully) and `clip-path` (carefully). Shadow changes go through a pseudo-element’s `opacity` instead of animating `box-shadow`.

One easy miss: add `will-change: transform` to animated elements, but **remove it when the animation ends**, or you keep a compositor layer alive forever.

## When not to animate at all

- `prefers-reduced-motion: reduce`: show everything immediately;
- frequent scroll direction changes: pause parallax to avoid motion sickness;
- low-end mobile: animate fewer elements at the same time.

The last point matters more than any technique: **motion is there to help understanding, not to prove you can do motion**. If a user can still finish the task smoothly after you delete an animation, it probably should be deleted.
