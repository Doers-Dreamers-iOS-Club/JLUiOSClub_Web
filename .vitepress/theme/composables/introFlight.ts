import type { IntroGlyph } from './introAscii'

export const INK_DRAIN_SECONDS = 1.25
export const INK_TRANSFER_SECONDS = 3.15
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
export const inkLevel = (seconds: number) => (1 - Math.cos(Math.PI * clamp(seconds / INK_DRAIN_SECONDS))) / 2
const noise = (i: number) => { const n = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return n - Math.floor(n) }

/** The descending ink boundary releases each glyph into its own smooth flight. */
export function introFlight(layer: HTMLElement, sources: IntroGlyph[], targets: IntroGlyph[], color: string, font: string, inkTop: number, inkHeight: number) {
  if (!sources.length || !targets.length) return null
  const canvas = document.createElement('canvas')
  canvas.className = 'club-intro__flight'
  canvas.dataset.sourcePoints = String(sources.length)
  canvas.dataset.targetPoints = String(targets.length)
  const dpr = Math.min(devicePixelRatio || 1, 2)
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
  layer.append(canvas)
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Preserve horizontal neighbourhoods so the stream forms ribbons, not crisscrossing noise.
  const origin = [...sources].sort((a, b) => a.x - b.x || a.y - b.y)
  const destination = [...targets].sort((a, b) => a.x - b.x || a.y - b.y)
  const center = destination.reduce((sum, p) => sum + p.x, 0) / destination.length
  const diagonal = Math.hypot(innerWidth, innerHeight)
  const particles = destination.map((target, i) => {
    const sourceIndex = Math.min(origin.length - 1, Math.floor(i / destination.length * origin.length))
    const source = origin[sourceIndex]
    const copies = Math.ceil((sourceIndex + 1) * destination.length / origin.length) - Math.ceil(sourceIndex * destination.length / origin.length)
    const row = clamp((source.y - inkTop) / inkHeight)
    // Inverse of the SAME easing used for the ink level; no independent release clock.
    const birth = Math.acos(1 - 2 * row) / Math.PI * INK_DRAIN_SECONDS
    const release = birth + .035 + noise(sourceIndex) * .045
    const duration = 1.15 + noise(i + 23) * .35 + Math.hypot(target.x - source.x, target.y - source.y) / diagonal * .25
    const lift = Math.min(140, Math.max(45, Math.abs(target.y - source.y) * .35))
    const drift = (source.x - center) * .07 + (noise(sourceIndex + 41) - .5) * 22
    return {
      source, target, copies: Math.max(1, copies), birth, release, duration,
      c1: { x: source.x + drift, y: source.y - lift },
      c2: { x: target.x + (source.x - target.x) * .12, y: target.y + lift * .55 }
    }
  })
  function paint(seconds: number) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    let moving = 0, settled = 0, visible = 0, lastSize = -1
    for (const { source, target, copies, birth, release, duration, c1, c2 } of particles) {
      if (seconds < birth) continue
      const t = clamp((seconds - release) / duration)
      // Quintic timing gives zero velocity AND acceleration at both ends.
      const u = smooth(t), v = 1 - u
      const x = v ** 3 * source.x + 3 * v * v * u * c1.x + 3 * v * u * u * c2.x + u ** 3 * target.x
      const y = v ** 3 * source.y + 3 * v * v * u * c1.y + 3 * v * u * u * c2.y + u ** 3 * target.y
      const size = Math.round((source.size + (target.size - source.size) * u) * 2) / 2
      if (size !== lastSize) { ctx.font = `400 ${size}px ${font}`; lastSize = size }
      const alpha = smooth(clamp((seconds - birth) / .055)) * ((1 - u) / copies + target.alpha * u)
      const morph = smooth(clamp((t - .35) / .5))
      if (source.char === target.char) {
        ctx.globalAlpha = alpha
        ctx.fillText(target.char, x, y)
      } else {
        ctx.globalAlpha = alpha * (1 - morph)
        if (ctx.globalAlpha > .005) ctx.fillText(source.char, x, y)
        ctx.globalAlpha = alpha * morph
        if (ctx.globalAlpha > .005) ctx.fillText(target.char, x, y)
      }
      visible++
      if (t > 0 && t < 1) moving++
      if (t === 1) settled++
    }
    ctx.globalAlpha = 1
    Object.assign(canvas.dataset, { progress: (seconds / INK_TRANSFER_SECONDS).toFixed(3), water: inkLevel(seconds).toFixed(3), moving: String(moving), settled: String(settled), visible: String(visible) })
  }
  return { canvas, paint }
}
