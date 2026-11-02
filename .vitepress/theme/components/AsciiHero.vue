<script setup lang="ts">
/**
 * AsciiHero —— 首页首屏：Swift 标志的 3D ASCII 打印
 * ---------------------------------------------------------------------------
 * 渲染管线移植自 github.com/edoardolunardi/ascii-logo（Codrops），几何体换成本站
 * 的 Swift 徽章（ascii/swift-mark.js）。本组件承担原 <ascii-logo> 自定义元素的职责：
 * 测量、拖拽环绕、帧循环、亮/暗主题跟随。
 *
 * SSR 安全：所有 window / WebGL 访问都在 onMounted 内；SSR 只输出一个空 section。
 * WebGL 不可用时首屏折叠为普通高度，下方内容自然上移，不留空白。
 */
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Color, LinearSRGBColorSpace } from 'three'
import { loadGlyphAtlas } from '../ascii/glyph-atlas'
import { AsciiLogoRenderer } from '../ascii/renderer'

const props = withDefaults(defineProps<{ active?: boolean }>(), { active: true })

/** Frame-rate independent exponential lerp. */
const damp = (current: number, target: number, tau: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-dt / tau))

/** Slack, so the frame threshold never lands on the display's beat. */
const FRAME_SLACK_MS = 8

const CONFIG = {
  cellW: 6,
  lineRatio: 1.6,
  maxDpr: 2,
  maxCells: 4600,
  frameHz: 60,
  floatSpeed: 2,
  floatIntensity: 1.4,
  rotationIntensity: 1,
  /** Radians of orbit per CSS pixel dragged, and the clock the camera follows the drag on. */
  dragScale: 0.007,
  orbitTau: 70,
  /** Short of the pole, where the camera's up vector would flip. */
  maxElevation: 0.85
}

/** A little under the mark's centre, so the badge reads as solid rather than flat on. */
const REST_ELEVATION = -0.22
const RESIZE_SETTLE_MS = 250
const CELL_ASPECT = 1 / CONFIG.lineRatio

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
/** WebGL 初始化失败：折叠首屏，让下面的刊头直接顶上 */
const failed = ref(false)

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** Read back through a 1x1 canvas rather than parsed: the cascade can hand down any
 * computed form, and only the browser reliably knows what it resolved to. */
function inkOf(element: HTMLElement): Color {
  const probe = document.createElement('canvas')
  probe.width = 1
  probe.height = 1
  const ctx = probe.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Color(1, 1, 1)

  ctx.fillStyle = getComputedStyle(element).color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return new Color().setRGB(r / 255, g / 255, b / 255, LinearSRGBColorSpace)
}

const isDark = () => document.documentElement.classList.contains('dark')

let dispose = () => {}
let snapshot = () => null as ReturnType<AsciiLogoRenderer['captureCells']> | null
defineExpose({ snapshot: () => snapshot() })
onBeforeUnmount(() => dispose())

onMounted(async () => {
  const root = rootRef.value
  const canvas = canvasRef.value
  if (!root || !canvas) return

  let renderer: AsciiLogoRenderer | null = null
  let resizeObserver: ResizeObserver | null = null
  let visibilityObserver: IntersectionObserver | null = null
  let themeObserver: MutationObserver | null = null
  let settle = 0

  let width = 0
  let height = 0
  let dpr = 1
  let cellW = 0
  let cellH = 0

  let raf = 0
  let last = 0
  let elapsed = Math.PI
  let visible = false
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reduced = prefersReducedMotion()
  const onMotionChange = () => { reduced = motionQuery.matches; applyMotion(); draw() }

  let azimuth = 0
  let elevation = REST_ELEVATION
  let aimAzimuth = 0
  let aimElevation = REST_ELEVATION
  let pointer = -1
  let pointerX = 0
  let pointerY = 0

  function measure() {
    const rect = root!.getBoundingClientRect()
    width = Math.max(rect.width, 1)
    height = Math.max(rect.height, 1)
    dpr = Math.min(CONFIG.maxDpr, window.devicePixelRatio || 1)

    // Always off the base cell, never off the last result, or resizes would compound.
    const raw = (width / CONFIG.cellW) * (height / (CONFIG.cellW * CONFIG.lineRatio))
    const growth = raw > CONFIG.maxCells ? Math.sqrt(raw / CONFIG.maxCells) : 1
    cellW = Math.round(CONFIG.cellW * growth)
    cellH = Math.round(cellW * CONFIG.lineRatio)

    renderer?.resize(width, height, dpr, cellW, cellH)
  }

  function pose() {
    const wave = elapsed / 4
    return {
      azimuth,
      elevation,
      rotateX: (Math.cos(wave) / 8) * CONFIG.rotationIntensity,
      rotateY: (Math.sin(wave) / 8) * CONFIG.rotationIntensity,
      rotateZ: (Math.sin(wave) / 20) * CONFIG.rotationIntensity,
      bob: (Math.sin(elapsed / 1.5) / 10) * CONFIG.floatIntensity
    }
  }

  function draw() {
    renderer?.render(pose())
  }

  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function play() {
    if (raf !== 0) return
    last = 0
    raf = requestAnimationFrame(onFrame)
  }

  function applyMotion() {
    if (!renderer || !visible || !props.active) {
      stop()
      return
    }
    // Reduced motion holds the frame, but a drag is the visitor's own doing, so it still runs.
    if (reduced && pointer === -1) {
      stop()
      return
    }
    play()
  }

  function onFrame(now: number) {
    raf = requestAnimationFrame(onFrame)
    if (last === 0) last = now
    const dt = now - last
    if (dt < 1000 / CONFIG.frameHz - FRAME_SLACK_MS) return
    last = now

    // Capped so a backgrounded tab does not jump the float forward on return.
    const step = Math.min(48, dt)
    if (!reduced) elapsed += (step / 1000) * CONFIG.floatSpeed

    azimuth = damp(azimuth, aimAzimuth, CONFIG.orbitTau, step)
    elevation = damp(elevation, aimElevation, CONFIG.orbitTau, step)
    draw()

    if (reduced && pointer === -1 && Math.abs(azimuth - aimAzimuth) < 0.001) stop()
  }

  function onPointerDown(event: PointerEvent) {
    if ((event.target as Element).closest('a')) return
    if (pointer !== -1 || !event.isPrimary) return
    pointer = event.pointerId
    pointerX = event.clientX
    pointerY = event.clientY
    root!.setPointerCapture(event.pointerId)
    root!.classList.add('is-grabbing')
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    applyMotion()
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerId !== pointer) return
    if (event.pointerType === 'touch' && Math.abs(event.clientY - pointerY) > Math.abs(event.clientX - pointerX)) {
      releasePointer()
      return
    }
    // The camera moves against the drag, so the mark turns with it.
    aimAzimuth -= (event.clientX - pointerX) * CONFIG.dragScale
    aimElevation = Math.max(
      -CONFIG.maxElevation,
      Math.min(CONFIG.maxElevation, aimElevation + (event.clientY - pointerY) * CONFIG.dragScale)
    )
    pointerX = event.clientX
    pointerY = event.clientY
  }

  function onPointerUp(event: PointerEvent) {
    if (event.pointerId !== pointer) return
    releasePointer()
  }

  function releasePointer() {
    if (pointer !== -1 && root!.hasPointerCapture(pointer)) root!.releasePointerCapture(pointer)
    pointer = -1
    root!.classList.remove('is-grabbing')
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }

  /** 亮/暗切换：墨色与明暗反转方向都跟页面走 */
  function applyTheme() {
    if (!renderer) return
    renderer.setInk(inkOf(canvas!))
    renderer.setPaper(!isDark())
    // Drawn here rather than left to the loop: under reduced motion there is no loop.
    draw()
  }

  const stopActiveWatch = watch(() => props.active, () => { applyMotion(); if (props.active) draw() })

  dispose = () => {
    stopActiveWatch()
    motionQuery.removeEventListener('change', onMotionChange)
    stop()
    clearTimeout(settle)
    resizeObserver?.disconnect()
    visibilityObserver?.disconnect()
    themeObserver?.disconnect()
    canvas.removeEventListener('webglcontextlost', onContextLost)
    root.removeEventListener('pointerdown', onPointerDown)
    releasePointer()
    renderer?.destroy()
    renderer = null
    snapshot = () => null
  }

  measure()

  try {
    // Face and weight come off the canvas, so the stylesheet stays the one place they are chosen.
    const style = getComputedStyle(canvas)
    const atlas = await loadGlyphAtlas(style.fontFamily, style.fontWeight, CELL_ASPECT)
    if (!root.isConnected) return

    renderer = AsciiLogoRenderer.create(canvas, atlas)
    if (!renderer) {
      failed.value = true
      return
    }

    // A rejected shader surfaces on the first frame, so the whole run-up is guarded and
    // nothing is revealed until it comes back clean.
    applyTheme()
    renderer.resize(width, height, dpr, cellW, cellH)
    renderer.render(pose())
  } catch (error) {
    console.warn(error)
    renderer?.destroy()
    renderer = null
    failed.value = true
    return
  }

  canvas.classList.remove('is-hidden')
  snapshot = () => renderer?.captureCells(width, height, cellW, cellH) ?? null

  // Wired only once there is something to turn, so a page without WebGL never grabs a gesture.
  root.addEventListener('pointerdown', onPointerDown)

  resizeObserver = new ResizeObserver(() => {
    clearTimeout(settle)
    settle = window.setTimeout(() => {
      const rect = root.getBoundingClientRect()
      if (Math.abs(rect.width - width) < 1 && Math.abs(rect.height - height) < 1) return
      measure()
      draw()
    }, RESIZE_SETTLE_MS)
  })
  resizeObserver.observe(root)

  visibilityObserver = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting)
    applyMotion()
  })
  visibilityObserver.observe(root)

  themeObserver = new MutationObserver(applyTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  function onContextLost(event: Event) {
    event.preventDefault()
    stop()
    canvas.classList.add('is-hidden')
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  motionQuery.addEventListener('change', onMotionChange)
  applyMotion()

})
</script>

<template>
  <section
    ref="rootRef"
    class="mag-ascii-hero mag-no-reveal"
    :class="{ 'is-failed': failed }"
    aria-label="Swift 标志，以 ASCII 字符打印的可拖拽立体"
  >
    <canvas ref="canvasRef" class="mag-ascii-hero__canvas is-hidden" />
    <a class="mag-ascii-hero__hint" href="#club-title" aria-label="浏览社团内容"><i class="ti ti-arrow-down" aria-hidden="true" /></a>
  </section>
</template>

<style scoped>
.mag-ascii-hero {
  position: relative;
  z-index: 1;
  /* 首屏即全部：logo 独占一屏，其余内容滚动后才出现 */
  height: calc(100vh - var(--vp-nav-height, 64px));
  height: calc(100svh - var(--vp-nav-height, 64px));
  cursor: grab;
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-user-select: none;
  color: var(--mag-text);
  font-family: var(--mag-font-mono);
  font-weight: 400;
}

.mag-ascii-hero.is-grabbing {
  cursor: grabbing;
}

.mag-ascii-hero.is-failed {
  display: none;
}

.mag-ascii-hero__canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.6s var(--mag-ease);
}

.mag-ascii-hero__canvas.is-hidden {
  opacity: 0;
}

.mag-ascii-hero__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(1.2rem, 4vh, 2.4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9em;
  margin: 0;
  color: var(--mag-text-tertiary);
  font-size: var(--mag-fs-micro);
  letter-spacing: var(--mag-tracking-eyebrow);
  text-transform: uppercase;
  pointer-events: auto;
}

.mag-ascii-hero__drag {
  color: var(--mag-text-secondary);
}

.mag-ascii-hero__chevron {
  animation: mag-ascii-bob 1.8s var(--mag-ease) infinite;
}

@keyframes mag-ascii-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mag-ascii-hero__chevron {
    animation: none;
  }
}
</style>
