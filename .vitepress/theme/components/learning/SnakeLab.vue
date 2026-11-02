<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const panel = ref<HTMLElement | null>(null)
const speed = ref('normal')
const position = ref(0)
const running = ref(false)
const reducedMotion = ref(false)
const intervals: Record<string, number> = { slow: 360, normal: 200, fast: 100 }
const path = [
  ...Array.from({ length: 12 }, (_, x) => [x, 0]),
  ...Array.from({ length: 6 }, (_, y) => [11, y + 1]),
  ...Array.from({ length: 11 }, (_, x) => [10 - x, 6]),
  ...Array.from({ length: 5 }, (_, y) => [0, 5 - y]),
]
const segments = computed(() => Array.from({ length: 5 }, (_, i) => path[(position.value - i + path.length) % path.length]))
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined
let motion: MediaQueryList | undefined
let visible = true

function pause() {
  if (timer !== undefined) clearInterval(timer)
  timer = undefined
  running.value = false
}
function advance() { position.value = (position.value + 1) % path.length }
function start() {
  pause()
  if (reducedMotion.value || document.hidden || !visible) return
  running.value = true
  timer = setInterval(advance, intervals[speed.value])
}
function step() { pause(); advance() }
function reset() { pause(); position.value = 0 }
function onVisibility() { if (document.hidden) pause() }
function onMotion() { reducedMotion.value = motion?.matches ?? false; if (reducedMotion.value) pause() }
watch(speed, () => { if (running.value) start() })
onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  onMotion()
  motion.addEventListener('change', onMotion)
  document.addEventListener('visibilitychange', onVisibility)
  if ('IntersectionObserver' in window && panel.value) {
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) pause() })
    observer.observe(panel.value)
  }
})
onBeforeUnmount(() => {
  pause()
  observer?.disconnect()
  motion?.removeEventListener('change', onMotion)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <section ref="panel" class="snake-lab mag-no-reveal" aria-label="贪吃蛇计时实验">
    <div class="snake-lab__heading"><strong>让速度变得可见</strong><span>INTERACTIVE / 01</span></div>
    <p class="snake-lab__intro">计时与暂停示意，不是完整游戏。蛇沿固定轨道移动，每次计时只前进一步。这里的三档速度用于比较间隔，课程项目仍以“轻松、标准”两档需求为准。</p>
    <svg class="snake-lab__board" viewBox="0 0 360 220" role="img" aria-label="五节蛇沿矩形轨道移动，使用下方按钮调整速度或单步观察">
      <path class="snake-lab__track" d="M 26 26 H 334 V 194 H 26 Z" />
      <text x="180" y="101" text-anchor="middle" class="snake-lab__label">每 {{ intervals[speed] }} ms</text>
      <text x="180" y="126" text-anchor="middle" class="snake-lab__sublabel">移动一格</text>
      <rect v-for="(segment, index) in segments" :key="index" :x="14 + segment[0] * 28" :y="14 + segment[1] * 28" width="24" height="24" rx="6" class="snake-lab__segment" :opacity="1 - index * 0.14" />
      <circle :cx="26 + segments[0][0] * 28" :cy="26 + segments[0][1] * 28" r="3" class="snake-lab__eye" />
    </svg>
    <div class="snake-lab__controls">
      <label>速度 <select v-model="speed"><option value="slow">慢速 · 360 ms</option><option value="normal">正常 · 200 ms</option><option value="fast">快速 · 100 ms</option></select></label>
      <button type="button" :disabled="reducedMotion" :aria-pressed="running" @click="running ? pause() : start()">{{ running ? '暂停' : '开始' }}</button>
      <button type="button" @click="step">单步</button>
      <button type="button" @click="reset">重置</button>
    </div>
    <p class="snake-lab__status" role="status">{{ reducedMotion ? '已启用减少动态效果：请用「单步」观察。' : running ? '正在运行。切换速度后，新的间隔立即生效。' : '已暂停。可以单步观察，或点击开始。' }}</p>
  </section>
</template>

<style scoped>
.snake-lab { margin: var(--mag-space-xl) 0; padding: var(--mag-space-lg); border: var(--mag-rule); border-radius: var(--mag-radius-lg); background: var(--mag-surface); color: var(--mag-text); }
.snake-lab__heading { display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--mag-space-xs); }
.snake-lab__heading span { font: var(--mag-fs-micro) var(--mag-font-mono); color: var(--mag-text-secondary); }
.snake-lab__intro, .snake-lab__status { font-size: var(--mag-fs-small); color: var(--mag-text-secondary); line-height: 1.7; }
.snake-lab__board { display: block; width: 100%; max-width: 480px; margin: var(--mag-space-md) auto; background: var(--mag-surface-sunken); border-radius: var(--mag-radius-md); }
.snake-lab__track { fill: none; stroke: var(--mag-hairline-strong); stroke-width: 2; stroke-dasharray: 3 6; }
.snake-lab__segment { fill: var(--mag-accent); }
.snake-lab__eye { fill: var(--mag-surface); }
.snake-lab__label { fill: var(--mag-text); font: 19px var(--mag-font-mono); }
.snake-lab__sublabel { fill: var(--mag-text-secondary); font: 13px var(--mag-font-display); }
.snake-lab__controls, .snake-lab__controls label { display: flex; align-items: center; flex-wrap: wrap; gap: var(--mag-space-xs); }
.snake-lab button, .snake-lab select { min-height: 44px; padding: 8px 12px; border: var(--mag-rule-strong); border-radius: var(--mag-radius-sm); background: var(--mag-surface); color: var(--mag-text); font: inherit; cursor: pointer; }
.snake-lab button:hover, .snake-lab button[aria-pressed="true"] { border-color: var(--mag-accent); background: var(--mag-accent-soft); }
.snake-lab button:disabled { opacity: .55; cursor: default; }
.snake-lab button:focus-visible, .snake-lab select:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.snake-lab__status { min-height: 3em; margin-bottom: 0; }
@media (max-width: 480px) { .snake-lab { padding: var(--mag-space-md); } }
</style>
