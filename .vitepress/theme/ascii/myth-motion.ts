import { sandField } from './sand-transition'

export type Glyph = {
  x: number; y: number; char: string; size: number; alpha: number
  u?: number; v?: number; part?: number
}
type Position = { x: number; y: number }
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const random = (i: number) => { const n = Math.sin(i * 127.1 + 31.7) * 43758.5453; return n - Math.floor(n) }
const center = (points: Glyph[]): Position => ({
  x: points.reduce((sum, p) => sum + p.x, 0) / Math.max(1, points.length),
  y: points.reduce((sum, p) => sum + p.y, 0) / Math.max(1, points.length)
})
function travel(a: Position, b: Glyph, control: Position, t: number, alpha: number): Glyph {
  const u = 1 - t
  return { ...b, x: u * u * a.x + 2 * u * t * control.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * control.y + t * t * b.y, alpha }
}

// Semantic paths are prepared once. These same paths play backwards when the
// reader returns to a previous page, rather than generating a second scatter.
export function mythTransition(previous: number, next: number, from: Glyph[], to: Glyph[], width: number) {
  const low = Math.min(previous, next), high = Math.max(previous, next)
  if (high - low !== 1 || low < 1) return null
  const reverse = next < previous
  const source = reverse ? to : from, destination = reverse ? from : to
  const flames = (low === 1 ? destination : source).filter(p => p.part === 1)
  if (!flames.length) return null
  const fire = center(flames)
  let sample: (t: number) => Glyph[]
  const kind = low === 1 ? 'hands-sand' : 'fire-to-sail'

  if (low === 1) {
    const sand = sandField(source, destination.filter(p => p.part !== 1), width, reverse)
    if (!sand) return null
    const leftHand = source.filter(p => p.x < width / 2)
    const rightHand = source.filter(p => p.x >= width / 2)
    const left = leftHand.reduce((a, p) => p.x > a.x ? p : a, leftHand[0] || source[0])
    const right = rightHand.reduce((a, p) => p.x < a.x ? p : a, rightHand[0] || source[source.length - 1])
    const spark = { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 }
    // Keep the original destination indices: spark seeds and timing stay unchanged.
    const routes = destination.map((p, i) => {
      const n = random(i)
      return { p, n, seed: i % 20 === 0, start: { x: spark.x + (n - .5) * 9, y: spark.y + (random(i + 9) - .5) * 7 },
        control: { x: mix(spark.x, fire.x, .55) + (n - .5) * 45, y: Math.max(12, Math.min(spark.y, fire.y) - 65 - n * 32) } }
    }).filter(({ p }) => p.part === 1)
    sample = t => {
      if (t <= 0) return source
      if (t >= 1) return destination
      const arriving = routes.map(({ p, n, seed, start, control }) => {
        const progress = smooth((t - .04 - n * .15) / .64)
        const visibility = seed ? smooth((t - .02 - n * .1) / .08) : smooth((t - .28 - n * .18) / .16)
        return travel(start, p, control, progress, p.alpha * visibility * (.35 + .65 * progress))
      })
      return [...sand(t), ...arriving]
    }
  } else {
    const sails = destination.filter(p => p.part === 1)
    const sail = center(sails.length ? sails : destination)
    const crest = { x: mix(fire.x, sail.x, .45), y: Math.max(16, Math.min(fire.y, sail.y) - 55) }
    const timber = source.filter(p => p.part !== 1)
    const routes = destination.map((p, i) => {
      const n = random(i)
      const a = p.part === 1 ? flames[i % flames.length] : timber[i % timber.length] || source[i % source.length]
      return { p, a, n }
    })
    sample = t => {
      if (t <= 0) return source
      if (t >= 1) return destination
      const old = source.map(p => ({ ...p, alpha: p.alpha * (1 - smooth(t / (p.part === 1 ? .18 : .4))) }))
      const arriving = routes.map(({ p, a, n }) => {
        if (p.part === 1) {
          const launch = smooth((t - n * .07) / .33)
          const unfurl = smooth((t - .25 - n * .09) / .6)
          const plume = { x: crest.x + (n - .5) * 18, y: crest.y + (random(iSeed(p)) - .5) * 22 }
          const lifted = { x: mix(a.x, plume.x, launch), y: mix(a.y, plume.y, launch) }
          return { ...p, x: mix(lifted.x, p.x, unfurl), y: mix(lifted.y, p.y, unfurl),
            alpha: p.alpha * smooth(t / .1), size: mix(a.size, p.size, unfurl) }
        }
        const progress = smooth((t - .12 - n * .14) / .72)
        return travel(a, p, { x: mix(a.x, p.x, .7), y: Math.min(a.y, p.y) - 30 - n * 35 }, progress,
          p.alpha * smooth((t - .08 - n * .12) / .15))
      })
      return [...old, ...arriving]
    }
  }
  return { kind, frame: (progress: number) => sample(reverse ? 1 - progress : progress) }
}
const iSeed = (p: Glyph) => p.x * .7 + p.y * .3

const TONES = '.:-=+*#%@'
export function shadeGlyph(p: Glyph, light: number, depth = 2): Glyph {
  const index = TONES.indexOf(p.char)
  const illumination = Math.max(-1, Math.min(1, light))
  // A fixed threshold per cell avoids white-noise flicker. Only a moving
  // light/shadow boundary can change that cell's glyph weight.
  const threshold = random((p.u ?? p.x) * 317 + (p.v ?? p.y) * 571)
  const tone = Math.max(0, Math.min(TONES.length - 1, Math.floor(index - illumination * depth + threshold)))
  return { ...p, char: index < 0 ? p.char : TONES[tone], alpha: p.alpha * (.88 - illumination * .12) }
}

export function torchLight(p: Glyph, time: number, flameBase: number): Glyph {
  const u = p.u ?? .5, v = p.v ?? .5
  const reach = .3 + .7 * Math.exp(-Math.hypot((u - .8) * .7, (v - flameBase) * 1.2) * 2.4)
  const pulse = Math.sin(time * 2.1) * .48 + Math.sin(time * 3.7 + .6) * .2 + Math.sin(time * .85) * .22
  const reflected = Math.sin(u * 12 + v * 8 - time * 1.2) * .25
  return shadeGlyph(p, pulse * reach + reflected - .12, 2.3)
}

export function flamePose(p: Glyph, time: number, i: number, height: number, base = .42): Glyph {
  // Flame base stays attached to the torch; its tips curl and flicker upwards.
  const lift = clamp((base - (p.v ?? 0)) / base)
  const wave = Math.sin((p.v ?? 0) * 26 + time * 3.4) + .4 * Math.sin((p.u ?? 0) * 32 - time * 5.1)
  const flow = Math.sin((p.v ?? 0) * 39 + time * 5.5 + (p.u ?? 0) * 7)
  return shadeGlyph({ ...p, x: p.x + wave * lift * height * .021,
    y: p.y - (.5 + .5 * Math.sin(time * 3.7 + (p.u ?? 0) * 15)) * lift * height * .018,
  }, flow * .82 + Math.sin((p.u ?? 0) * 19 - time * 2.5) * .18, 2.8)
}
