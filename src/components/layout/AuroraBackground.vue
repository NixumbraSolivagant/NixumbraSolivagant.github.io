<template>
  <div class="aurora" aria-hidden="true">
    <div class="orb orb-a" />
    <div class="orb orb-b" />
    <div class="orb orb-c" />
    <div class="orb orb-d" />
    <div class="aurora-grid" />
    <div class="aurora-grain grain" />
    <div class="aurora-vignette" />
  </div>
</template>

<style scoped>
.aurora {
  position: fixed;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  pointer-events: none;
  contain: strict;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(90px);
  will-change: transform;
  opacity: 0.55;
}

.orb-a {
  width: 52vw;
  height: 52vw;
  left: -14vw;
  top: -18vw;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(124, 58, 237, 0.55),
    rgba(79, 70, 229, 0.22) 48%,
    transparent 70%
  );
  animation: drift-a 28s ease-in-out infinite;
}

.orb-b {
  width: 46vw;
  height: 46vw;
  right: -16vw;
  top: -8vw;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(34, 211, 238, 0.32),
    rgba(14, 116, 144, 0.12) 55%,
    transparent 72%
  );
  animation: drift-b 34s ease-in-out infinite;
}

.orb-c {
  width: 40vw;
  height: 40vw;
  left: 24vw;
  top: 42vh;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(244, 114, 182, 0.24),
    rgba(190, 24, 93, 0.08) 55%,
    transparent 72%
  );
  animation: drift-a 40s ease-in-out infinite reverse;
}

.orb-d {
  width: 34vw;
  height: 34vw;
  right: 6vw;
  bottom: -14vw;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(99, 102, 241, 0.24),
    transparent 70%
  );
  animation: drift-b 46s ease-in-out infinite reverse;
}

.aurora-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 72px 72px;
  -webkit-mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 10%, transparent 75%);
  mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 10%, transparent 75%);
  opacity: 0.7;
}

.aurora-grain {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  mix-blend-mode: overlay;
}

.aurora-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(130% 100% at 50% 0%, transparent 35%, rgba(4, 5, 10, 0.75) 100%);
}

@media (max-width: 767px) {
  .orb {
    filter: blur(64px);
    opacity: 0.42;
  }
  .orb-a {
    width: 90vw;
    height: 90vw;
    left: -30vw;
    top: -20vw;
  }
  .orb-b {
    width: 80vw;
    height: 80vw;
    right: -30vw;
  }
  .orb-c {
    width: 70vw;
    height: 70vw;
    left: 10vw;
  }
  .orb-d {
    display: none;
  }
}
</style>
