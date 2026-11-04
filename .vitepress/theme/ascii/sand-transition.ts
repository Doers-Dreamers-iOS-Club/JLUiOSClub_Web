import type { Glyph } from './myth-motion'

const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const noise = (i: number) => { const n = Math.sin(i * 127.1 + 31.7) * 43758.5453; return n - Math.floor(n) }
const GRAINS = ['.', ':', ',', "'", ';']

/** A reversible erosion field: hands peel right-to-left and accumulate left-to-right. */
export function sandField(hands: Glyph[], support: Glyph[], width: number, reverse: boolean) {
  if (!hands.length || !support.length) return null
  const source = [...hands].sort((a, b) => a.x - b.x || a.y - b.y)
  const target = [...support].sort((a, b) => a.x - b.x || a.y - b.y)
  const count = Math.max(source.length, target.length)
  const routes = Array.from({ length: count }, (_, i) => {
    const a = source[i % source.length], b = target[i % target.length]
    const n = noise(i), u = clamp(a.x / Math.max(1, width)), v = a.v ?? .5
    // The erosion front has small contour-shaped ripples, not a straight clipping edge.
    const release = clamp(.035 + (1 - u) * .62 + n * .025 + Math.sin(v * 13 + u * 8) * .012)
    const duration = (.975 - release) * (.93 + n * .055)
    const drift = Math.min(width * .30, Math.max(width * .07, Math.abs(a.x - b.x) * .42))
    const fall = Math.min(100, width * .09) * (.65 + .35 * n)
    return {
      a, b, n, u, v, release, duration,
      sourceAlpha: i < source.length ? a.alpha : 0,
      targetAlpha: i < target.length ? b.alpha : 0,
      grain: GRAINS[i % GRAINS.length],
      c1: { x: a.x - drift, y: a.y + fall },
      c2: { x: b.x + drift * .65, y: b.y + fall * .65 }
    }
  })
  const position = (route: typeof routes[number], local: number) => {
    const t = smooth(local), s = 1 - t
    const dune = Math.sin(Math.PI * local) ** 2
    // Low, coherent ripples travel along the stream; no random per-frame flicker.
    return {
      x: s ** 3 * route.a.x + 3 * s * s * t * route.c1.x + 3 * s * t * t * route.c2.x + t ** 3 * route.b.x
        + Math.sin(local * 9 + route.u * 7) * dune * Math.min(14, width * .018),
      y: s ** 3 * route.a.y + 3 * s * s * t * route.c1.y + 3 * s * t * t * route.c2.y + t ** 3 * route.b.y
        + Math.sin(local * 14 + route.u * 12 + route.v * 3) * dune * Math.min(11, width * .016)
    }
  }
  function sample(t: number): Glyph[] {
    if (t <= 0) return hands
    if (t >= 1) return support
    const result: Glyph[] = []
    for (const route of routes) {
      const { a, b, n, release, duration, sourceAlpha, targetAlpha, grain } = route
      const local = clamp((t - release) / duration)
      if (local === 0) {
        if (sourceAlpha) result.push({ ...a, alpha: sourceAlpha })
        continue
      }
      if (local === 1) {
        if (targetAlpha) result.push({ ...b, alpha: targetAlpha })
        continue
      }
      const { x, y } = position(route, local)
      const sand = smooth(local / .18) * (1 - smooth((local - .79) / .21))
      // Original glyphs physically leave their positions; only spare grains dissolve at landing.
      const alpha = mix(
        mix(sourceAlpha, .62 + n * .25, smooth(local / .18)),
        targetAlpha, smooth((local - .78) / .22)
      )
      const size = mix(a.size, b.size, smooth(local)) * (1 - sand * .48)
      result.push({ ...b, x, y, size, char: local < .09 ? a.char : local > .92 ? b.char : grain, alpha })
      if (sand > .05) {
        const tail = position(route, clamp(local + (reverse ? .035 : -.035)))
        result.push({ x: tail.x, y: tail.y, size: Math.max(3, size * .72), char: '.', alpha: alpha * sand * .18 })
      }
    }
    return result
  }
  return sample
}
