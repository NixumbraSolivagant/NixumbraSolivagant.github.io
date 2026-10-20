---
date: 2026-02-18
tags: design, css, ui
cover: violet
title.zh: 玻璃拟态：让界面「有厚度」的七个细节
title.en: 'Glassmorphism: seven details that give an interface depth'
summary.zh: 半透明不是把背景调成白色再加个模糊。真正好看的玻璃，藏在明度差、边缘光与层级关系里。
summary.en: Translucency is not white at low opacity plus a blur. Good glass lives in luminance contrast, edge light and layering.
---

玻璃拟态流行过一轮，也被嘲讽过一轮。嘲讽通常是有道理的：把背景调成白色、加一行 `backdrop-filter: blur(20px)`，得到的大多是一块没擦干净的塑料。

但这套视觉语言本身没有问题，问题在于很多人只做了「透明」这一步。真正让玻璃成立的是**明度差、边缘光与层级关系**。下面是我在 Gradient Lab 里反复调出来的七个细节。

## 一、透明度不是关键，明度差才是

玻璃的本质不是「看得见后面」，而是「比后面亮一点点」。如果背景本身很亮，再叠加白色半透明只会糊成一片。

我通常把背景压到 `#04050a` 这个量级，再用 `rgba(255,255,255,0.04~0.08)` 的面板拉开层次。这个差值足够让人感知到「这是一层东西」，又不至于抢走文字的对比度。

## 二、边框要「有方向」

四个边一样亮的边框会显得很假。真实的玻璃受光是有方向的：上边缘最亮，左右次之，下边缘几乎看不见。

所以我会用 `inset 0 1px 0 rgba(255,255,255,0.10)` 单独提亮顶边，而不是给 `border` 一个统一颜色。这个 1px 的高光，往往比模糊半径更能决定「像不像玻璃」。

```css
.glass {
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.075),
    rgba(255, 255, 255, 0.022) 42%,
    rgba(255, 255, 255, 0.045)
  );
  border: 1px solid rgba(255, 255, 255, 0.085);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.10),
    0 24px 60px -32px rgba(0, 0, 0, 0.95);
}
```

## 三、模糊半径与层级成正比

模糊是成本，也是信号。层级越高、越「靠近用户」的面板，模糊可以越大；贴在背景上的装饰性面板，模糊要小。

我的经验值：卡片 `12–18px`，导航栏 `20–24px`，弹窗 `28px` 以上。**但前提是背后真的有东西可模糊**——如果背景是纯色，`backdrop-filter` 只是徒增渲染开销。

## 四、高光是一条线，不是一片

新手常把整个面板加上从上到下的白色渐变，结果面板像蒙了一层雾。高光应该克制在顶部 20% 左右，并且用极低的透明度：

```css
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 26%);
  pointer-events: none;
}
```

这一层要放在内容之下、背景之上，而且**永远不能挡住点击**。

## 五、噪点让玻璃不那么「塑料」

数字渐变的通病是过于干净。叠一层 3%–5% 透明度的噪点，能立刻把质感从「网页」拉到「材质」：

```css
.grain {
  background-image: url("data:image/svg+xml,...feTurbulence...");
  opacity: 0.04;
  mix-blend-mode: overlay;
}
```

噪点必须是静态的（要够密、够细），并且只在暗色背景上使用，否则会在浅色区域显脏。

## 六、边缘要有「溢出感」

玻璃不是贴在表面的贴纸，它应该让人感到它「浮」在背景之上。除了投影，我还会做两件事：

- 让面板略微溢出容器边缘，或者让光晕从面板下方透出来；
- 用 `border-gradient` 做一条从亮到暗的渐变描边，暗示光线擦过边缘。

## 七、动效只做一件事：确认层级

玻璃面板上的动效不需要多。指针靠近时让高光跟着走一点，面板抬起 `2–4px`，就足够表达「它在你手边」。

超过这个量，用户会开始注意动效本身，而不是内容——那就本末倒置了。

> 好的材质是让人忘记材质的存在。玻璃也一样：它应该托住内容，而不是压过内容。

以上参数都可以在 Gradient Lab 里实时调整。如果你也在做暗色产品界面，希望这几条能帮你少走一点弯路。

<!--en-->

Glassmorphism has had its moment and its backlash. The backlash is usually fair: set the background to white, add `backdrop-filter: blur(20px)`, and you mostly get a piece of unwashed plastic.

The language itself is not the problem. The problem is that most people stop at “translucent”. What actually makes glass read as glass is **luminance contrast, edge light, and layering**. These are the seven details I kept tuning in Gradient Lab.

## One: transparency is not the point — luminance contrast is

Glass is not about “seeing through”. It is about being *slightly brighter* than what is behind it. If the background is already bright, adding white translucency just smears everything together.

I usually push the background down to something like `#04050a`, then lift panels with `rgba(255,255,255,0.04–0.08)`. That difference is enough to read as “a separate layer” without stealing contrast from text.

## Two: borders need a direction

A border that is equally bright on all four sides looks fake. Real glass is lit from somewhere: the top edge is brightest, the sides less so, the bottom almost invisible.

So I brighten the top edge with `inset 0 1px 0 rgba(255,255,255,0.10)` instead of giving `border` one uniform colour. That single pixel often matters more than the blur radius.

```css
.glass {
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.075),
    rgba(255, 255, 255, 0.022) 42%,
    rgba(255, 255, 255, 0.045)
  );
  border: 1px solid rgba(255, 255, 255, 0.085);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.10),
    0 24px 60px -32px rgba(0, 0, 0, 0.95);
}
```

## Three: blur radius scales with elevation

Blur is both cost and signal. The closer a panel is to the user, the more blur it can carry. Decorative panels sitting on the background should stay low.

My working numbers: cards `12–18px`, navigation `20–24px`, dialogs `28px+`. **But only if there is actually something behind it to blur** — over a flat colour, `backdrop-filter` is pure rendering cost.

## Four: the highlight is a line, not a wash

A common mistake is a white gradient across the whole panel, which reads as fog. Keep the highlight within the top 20% and at very low opacity:

```css
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 26%);
  pointer-events: none;
}
```

This layer sits above the background and below the content, and it must **never** intercept clicks.

## Five: grain keeps glass from looking plastic

Digital gradients are too clean. A 3–5% grain layer moves the surface from “webpage” to “material”:

```css
.grain {
  background-image: url("data:image/svg+xml,...feTurbulence...");
  opacity: 0.04;
  mix-blend-mode: overlay;
}
```

Keep grain static, dense and fine, and only use it on dark surfaces — on light areas it just looks dirty.

## Six: the edge should feel like it floats

Glass is not a sticker. It should feel like it hovers above the background. Beyond a shadow, I do two things:

- let the panel bleed slightly past its container, or let a glow leak out from underneath;
- use a `border-gradient` from light to dark to imply light grazing the edge.

## Seven: motion does one job — confirm elevation

Motion on a glass panel does not need much. Let the highlight follow the pointer a little; lift the panel `2–4px`. That is enough to say “this is within reach”.

Beyond that, people start watching the animation instead of the content, and you have lost the plot.

> Good material makes you forget the material. Glass is the same: it should carry the content, not compete with it.

All of these parameters are live in Gradient Lab. If you are building dark product interfaces too, I hope a few of these save you some time.
