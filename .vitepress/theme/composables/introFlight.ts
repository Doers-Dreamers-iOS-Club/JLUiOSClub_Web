import type { IntroGlyph } from './introAscii'

/** One canvas, deterministic curved paths, and no per-frame DOM measurements. */
export function introFlight(layer: HTMLElement, sources: IntroGlyph[], targets: IntroGlyph[], color: string, font: string) {
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
  const origin = [...sources].sort((a, b) => a.y - b.y || a.x - b.x)
  const destination = [...targets].sort((a, b) => a.y - b.y || a.x - b.x)
  const particles = destination.map((target, i) => {
    const sourceIndex = Math.min(origin.length - 1, Math.floor(i / destination.length * origin.length))
    const source = origin[sourceIndex]
    const copies = Math.ceil((sourceIndex + 1) * destination.length / origin.length) - Math.ceil(sourceIndex * destination.length / origin.length)
    return { source, target, copies: Math.max(1, copies), delay: sourceIndex / origin.length * .22, bend: Math.sin(i * 2.399) * Math.min(innerWidth * .14, 160) }
  })
  function paint(progress: number) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    for (const { source, target, copies, delay, bend } of particles) {
      const t = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)))
      const ease = t * t * (3 - 2 * t)
      const arch = Math.sin(Math.PI * t)
      const x = source.x + (target.x - source.x) * ease + bend * arch
      const y = source.y + (target.y - source.y) * ease - Math.min(innerHeight * .24, 180) * arch
      const size = source.size + (target.size - source.size) * ease
      ctx.font = `400 ${size.toFixed(1)}px ${font}`
      ctx.globalAlpha = (1 / copies) * (1 - ease) + target.alpha * ease
      ctx.fillText(t < .55 ? source.char : target.char, x, y)
    }
    ctx.globalAlpha = 1
    canvas.dataset.progress = progress.toFixed(3)
  }
  return { canvas, paint }
}
