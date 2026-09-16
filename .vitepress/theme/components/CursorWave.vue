<script setup lang="ts">
/**
 * CursorWave —— 首页全屏背景：跟随光标的网格波纹
 * ---------------------------------------------------------------------------
 * 对标 React Bits Pro 的 Cursor Wave（付费组件，无法直接引用），这里用原生
 * canvas 2D 复刻：稀疏网格排布短线段，线段朝光标方向偏转、随距离衰减；
 * 点击产生一圈向外扩散的涟漪，经过之处线段被「点亮」并顺势扭转。
 *
 * 刻意取舍：
 *  - 固定定位铺满视口，垫在所有首页内容之下（z-index 0，内容层 z-index 1）；
 *  - pointer-events: none，事件挂在 window 上，不挡任何交互；
 *  - 线段状态用预分配 TypedArray 式对象数组，每帧只做 math + stroke；
 *  - 滚出首页（组件卸载）、切后台、减弱动效时停止 rAF。
 *
 * SSR 安全：仅首页 layout 挂载，所有 window / canvas 访问都在 onMounted 内。
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

/* 网格与波纹参数：间距越小越密，半径越大光标影响越广 */
const GAP = 34
const SEG_LEN = 7
const INFLUENCE_RADIUS = 220
const RIPPLE_SPEED = 520 // px/s
const RIPPLE_WIDTH = 110
const RIPPLE_LIFE = 1.6 // s

interface Cell {
  x: number
  y: number
  /** 当前角度与目标角度，插值逼近 */
  angle: number
  target: number
  /** 0..1 激活度：长度与不透明度都随它走 */
  energy: number
}

interface Ripple {
  x: number
  y: number
  start: number
}

let ctx: CanvasRenderingContext2D | null = null
let cells: Cell[] = []
let ripples: Ripple[] = []
let raf = 0
let width = 0
let height = 0
let dpr = 1
let running = false
let last = 0
let time = 0

let pointerX = -9999
let pointerY = -9999

let ink = { r: 28, g: 26, b: 23 }
let accent = { r: 0, g: 113, b: 227 }

let themeObserver: MutationObserver | null = null

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/** 从 CSS 令牌读取网格颜色，自动跟随亮/暗主题 */
function readColors(): void {
  const el = canvasRef.value
  if (!el) return
  const styles = getComputedStyle(el)
  const parse = (name: string, fallback: { r: number; g: number; b: number }) => {
    const raw = styles.getPropertyValue(name).trim()
    const m = raw.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
    return m ? { r: +m[1], g: +m[2], b: +m[3] } : fallback
  }
  ink = parse('--mag-wave-ink', { r: 28, g: 26, b: 23 })
  accent = parse('--mag-wave-accent', { r: 0, g: 113, b: 227 })
}

function seed(): void {
  cells = []
  const cols = Math.ceil(width / GAP) + 1
  const rows = Math.ceil(height / GAP) + 1
  const offsetX = (width - (cols - 1) * GAP) / 2
  const offsetY = (height - (rows - 1) * GAP) / 2
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        x: offsetX + col * GAP,
        y: offsetY + row * GAP,
        angle: 0,
        target: 0,
        energy: 0
      })
    }
  }
}

function resize(): void {
  const el = canvasRef.value
  if (!el || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  seed()
}

function step(dt: number): void {
  time += dt
  const now = time

  for (const c of cells) {
    // 闲置微波：随位置与时间缓慢摆动，网格不至于死寂
    let target = Math.sin(time * 0.35 + c.x * 0.008 + c.y * 0.006) * 0.35
    let energy = 0

    // 光标靠近：朝光标扭转，越近越亮越长
    const dx = pointerX - c.x
    const dy = pointerY - c.y
    const dist = Math.hypot(dx, dy)
    if (dist < INFLUENCE_RADIUS) {
      const t = 1 - dist / INFLUENCE_RADIUS
      target = Math.atan2(dy, dx)
      energy = Math.max(energy, t * t)
    }

    // 点击涟漪：环带经过处给一次脉冲，并把线段扭向切线方向
    for (const r of ripples) {
      const age = now - r.start
      if (age < 0 || age > RIPPLE_LIFE) continue
      const radius = age * RIPPLE_SPEED
      const rdx = c.x - r.x
      const rdy = c.y - r.y
      const rd = Math.hypot(rdx, rdy)
      const band = 1 - Math.min(Math.abs(rd - radius) / RIPPLE_WIDTH, 1)
      if (band > 0) {
        const fade = 1 - age / RIPPLE_LIFE
        const pulse = band * band * fade
        energy = Math.max(energy, pulse)
        target = Math.atan2(rdy, rdx) + Math.PI / 2
      }
    }

    c.target = target
    // 帧率无关的指数逼近，扭转与点亮都带一点惰性
    const k = 1 - Math.exp(-dt / 90)
    const k2 = 1 - Math.exp(-dt / 140)
    c.angle += (c.target - c.angle) * k
    c.energy += (energy - c.energy) * k2
  }

  // 清掉寿终的涟漪，避免数组无限增长
  ripples = ripples.filter((r) => now - r.start <= RIPPLE_LIFE)
}

function draw(): void {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  ctx.lineCap = 'round'

  for (const c of cells) {
    const e = c.energy
    const len = SEG_LEN + e * 10
    const dx = (Math.cos(c.angle) * len) / 2
    const dy = (Math.sin(c.angle) * len) / 2

    // 基态用墨色低透明度，激活后混入强调色
    const mix = Math.min(e * 1.2, 1)
    const r = Math.round(ink.r + (accent.r - ink.r) * mix)
    const g = Math.round(ink.g + (accent.g - ink.g) * mix)
    const b = Math.round(ink.b + (accent.b - ink.b) * mix)

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 + e * 0.55})`
    ctx.lineWidth = 1.2 + e * 0.8
    ctx.beginPath()
    ctx.moveTo(c.x - dx, c.y - dy)
    ctx.lineTo(c.x + dx, c.y + dy)
    ctx.stroke()
  }
}

function loop(now: number): void {
  raf = requestAnimationFrame(loop)
  if (last === 0) last = now
  const dt = Math.min(48, now - last)
  last = now
  step(dt)
  draw()
}

function start(): void {
  if (running || document.hidden || reducedMotion()) return
  running = true
  last = 0
  raf = requestAnimationFrame(loop)
}

function stop(): void {
  running = false
  cancelAnimationFrame(raf)
}

function onPointerMove(e: PointerEvent): void {
  pointerX = e.clientX
  pointerY = e.clientY
}

function onPointerDown(e: PointerEvent): void {
  if (!e.isPrimary) return
  ripples.push({ x: e.clientX, y: e.clientY, start: time })
}

function onVisibility(): void {
  document.hidden ? stop() : start()
}

function onResize(): void {
  resize()
  if (reducedMotion()) draw()
}

onMounted(() => {
  const el = canvasRef.value
  if (!el) return
  ctx = el.getContext('2d')
  if (!ctx) return

  readColors()
  resize()

  // 减弱动效：只画一帧静态网格，不跟手也不起波
  if (reducedMotion()) {
    draw()
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    start()
  }

  window.addEventListener('resize', onResize, { passive: true })

  // 亮/暗切换时重读颜色，静态帧也要补一笔
  themeObserver = new MutationObserver(() => {
    readColors()
    if (!running) draw()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
  themeObserver?.disconnect()
  ctx = null
  cells = []
  ripples = []
})
</script>

<template>
  <canvas ref="canvasRef" class="mag-cursor-wave" aria-hidden="true" />
</template>

<style scoped>
.mag-cursor-wave {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
}
</style>
