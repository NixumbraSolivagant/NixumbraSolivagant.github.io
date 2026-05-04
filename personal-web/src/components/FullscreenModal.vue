<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fs-modal-overlay" @click.self="close">
        <div class="fs-modal-box" :style="{ width: width, maxWidth: maxWidth }">
          <div class="fs-modal-header">
            <div class="fs-modal-title">
              <span>{{ title }}</span>
              <span class="fs-modal-desc">{{ description }}</span>
            </div>
            <button class="fs-modal-close" @click="close" aria-label="关闭">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="fs-modal-content" ref="contentRef">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  width: { type: String, default: '90vw' },
  maxWidth: { type: String, default: '1200px' },
})

const emit = defineEmits(['close'])
const contentRef = ref(null)

const close = () => {
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.fs-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.fs-modal-box {
  background: var(--item_bg_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 90vw;
  max-width: 1200px;
}

.fs-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--card_stroke_color);
  flex-shrink: 0;
}

.fs-modal-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--main_text_color);
}

.fs-modal-desc {
  font-size: 0.82rem;
  font-weight: 400;
  opacity: 0.6;
  color: var(--item_left_text_color);
}

.fs-modal-close {
  background: var(--item_hover_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 10px;
  color: var(--item_left_text_color);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.fs-modal-close:hover {
  background: var(--accent);
  color: var(--main_text_color);
  border-color: transparent;
}

.fs-modal-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

.fs-modal-content :deep(canvas),
.fs-modal-content :deep(svg) {
  width: 100% !important;
  height: auto !important;
  display: block;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .fs-modal-box,
.modal-fade-leave-active .fs-modal-box {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .fs-modal-box {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

.modal-fade-leave-to .fs-modal-box {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

@media (max-width: 640px) {
  .fs-modal-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .fs-modal-box {
    border-radius: 20px 20px 0 0;
    max-height: 85vh;
    width: 100%;
  }
}
</style>
