<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="hobby-modal-overlay" @click.self="close">
        <div class="hobby-modal">
          <button class="modal-close" @click="close">
            <svg viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
              <path d="M195.2 195.2a69.333333 69.333333 0 0 1 98.133333 0L512 412.866667l218.666667-218.666667a69.333333 69.333333 0 0 1 98.133333 98.133333L610.133333 512l218.666667 218.666667a69.333333 69.333333 0 0 1-98.133333 98.133333L512 610.133333l-218.666667 218.666667a69.333333 69.333333 0 0 1-98.133333-98.133333L413.866667 512 195.2 293.333333a69.333333 69.333333 0 0 1 0-98.133333z"/>
            </svg>
          </button>

          <div class="modal-hero">
            <img
              v-if="currentImage"
              :src="currentImage"
              :alt="hobby.title"
              class="hero-image"
            />
          </div>

          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">{{ hobby.title }}</h2>
              <p class="modal-subtitle">{{ hobby.subtitle }}</p>
            </div>

            <p class="modal-description">{{ hobby.description }}</p>

            <div v-if="hobby.images && hobby.images.length > 1" class="modal-gallery">
              <img
                v-for="(img, index) in hobby.images"
                :key="index"
                :src="img"
                :alt="`${hobby.title} ${index + 1}`"
                class="gallery-thumb"
                :class="{ active: currentImage === img }"
                @click="currentImage = img"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  hobby: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const currentImage = ref('')

watch(
  () => props.hobby,
  (newHobby) => {
    if (newHobby && newHobby.images && newHobby.images.length > 0) {
      currentImage.value = newHobby.images[0]
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.hobby.images) {
      currentImage.value = props.hobby.images[0]
    }
  }
)

const close = () => {
  emit('update:modelValue', false)
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.hobby-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.hobby-modal {
  background: var(--item_bg_color);
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.modal-hero {
  width: 100%;
  min-height: 300px;
  max-height: 500px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  background: var(--item_hover_color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--item_hover_color);
}

.modal-content {
  padding: 24px;
}

.modal-header {
  margin-bottom: 16px;
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--main_text_color);
  margin: 0 0 4px;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: var(--item_left_text_color);
  opacity: 0.7;
  margin: 0;
}

.modal-description {
  font-size: 0.95rem;
  color: var(--item_left_text_color);
  line-height: 1.7;
  margin: 0 0 20px;
}

.modal-gallery {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.gallery-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  opacity: 0.6;
}

.gallery-thumb:hover {
  opacity: 1;
}

.gallery-thumb.active {
  border-color: var(--accent);
  opacity: 1;
}

@media (max-width: 640px) {
  .modal-hero {
    min-height: 200px;
    max-height: 300px;
  }

  .modal-content {
    padding: 16px;
  }

  .gallery-thumb {
    width: 60px;
    height: 60px;
  }
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .hobby-modal,
.modal-leave-to .hobby-modal {
  transform: scale(0.95) translateY(20px);
}
</style>
