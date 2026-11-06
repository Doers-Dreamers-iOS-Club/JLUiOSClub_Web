<script setup lang="ts">
/**
 * MagCarousel —— 轻量轮播（取代 el-carousel）
 * scroll-snap 横向滚动 + 左右箭头 + 圆点指示 + 可选自动播放。
 * 插槽里直接放 <img>（站内相对路径图片照旧交给 Vite 打包）。
 *
 * 注意：medium-zoom 的选择器不含本组件内的图（.mag-carousel img 被排除），
 * 轮播图不需要点击放大。
 */
import { onMounted, ref, watchEffect } from 'vue'
import { usePlaybackVisibility } from '../composables/usePlaybackVisibility'

const props = withDefaults(
  defineProps<{
    /** 自动播放间隔（ms），不传则不自动播放 */
    autoplay?: number
  }>(),
  { autoplay: 0 }
)

const track = ref<HTMLElement | null>(null)
const current = ref(0)
const count = ref(0)

const hovered = ref(false)
const focused = ref(false)
const { available, reduced } = usePlaybackVisibility(track, .3)

function scrollTo(i: number) {
  const el = track.value
  if (!el || !count.value) return
  const index = ((i % count.value) + count.value) % count.value
  el.scrollTo({ left: index * el.clientWidth, behavior: reduced.value ? 'instant' : 'smooth' })
  current.value = index
}

function onScroll() {
  const el = track.value
  if (!el) return
  current.value = Math.round(el.scrollLeft / el.clientWidth)
}

function onFocusOut(event: FocusEvent) {
  focused.value = (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)
}

onMounted(() => { count.value = track.value!.children.length })
watchEffect(onCleanup => {
  if (!available.value || hovered.value || focused.value || !props.autoplay || count.value < 2) return
  const timer = setInterval(() => scrollTo(current.value + 1), props.autoplay)
  onCleanup(() => clearInterval(timer))
})
</script>

<template>
  <div
    class="mag-carousel mag-no-reveal"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="onFocusOut"
  >
    <div ref="track" class="mag-carousel__track" @scroll.passive="onScroll">
      <slot />
    </div>

    <template v-if="count > 1">
      <button
        type="button"
        class="mag-carousel__arrow mag-carousel__arrow--prev"
        aria-label="上一张"
        @click="scrollTo(current - 1)"
      >
        ‹
      </button>
      <button
        type="button"
        class="mag-carousel__arrow mag-carousel__arrow--next"
        aria-label="下一张"
        @click="scrollTo(current + 1)"
      >
        ›
      </button>

      <div class="mag-carousel__dots">
        <button
          v-for="i in count"
          :key="i"
          type="button"
          class="mag-carousel__dot"
          :class="{ 'mag-carousel__dot--active': current === i - 1 }"
          :aria-label="`第 ${i} 张`"
          @click="scrollTo(i - 1)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.mag-carousel {
  position: relative;
  margin: var(--mag-space-lg) 0;
  overflow: hidden;
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-sm);
  background: var(--mag-surface-sunken);
}

.mag-carousel__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  aspect-ratio: 16 / 9;
}

.mag-carousel__track::-webkit-scrollbar {
  display: none;
}

.mag-carousel__track :deep(img) {
  flex: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
  scroll-snap-align: center;
}

.mag-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid var(--mag-hairline);
  border-radius: 50%;
  background: var(--mag-surface-raised);
  color: var(--mag-text);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity var(--mag-duration-fast) var(--mag-ease),
    border-color var(--mag-duration-fast) var(--mag-ease);
}

.mag-carousel:hover .mag-carousel__arrow {
  opacity: 1;
}

.mag-carousel__arrow:hover {
  border-color: var(--mag-accent);
  color: var(--mag-accent);
}

.mag-carousel__arrow--prev {
  left: var(--mag-space-sm);
}

.mag-carousel__arrow--next {
  right: var(--mag-space-sm);
}

.mag-carousel__dots {
  position: absolute;
  bottom: var(--mag-space-xs);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
}

.mag-carousel__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--mag-hairline-strong);
  cursor: pointer;
  transition: background var(--mag-duration-fast) var(--mag-ease);
}

.mag-carousel__dot--active {
  background: var(--mag-accent);
}
</style>
