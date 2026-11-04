// Canvas-only interaction, adapted from the StyleKit line study. The existing
// scene poses remain responsible for the hands, flame and ship silhouettes.
type Glyph = { x: number; y: number; alpha: number; size: number; char?: string }
type Bounds = { x: number; y: number; width: number; height: number }
type Region = { x: number; y: number; tx: number; ty: number; alpha: number; score: number; nextScan?: number; switching?: boolean; acquired?: number; vx?: number; vy?: number; wanderSeed?: number }
const COLS = 80, ROWS = 48, SIDE = 7
const SCAN_INTERVAL = .65, TRACKING_RATE = 2, REGION_FADE_RATE = 5
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const lattice = Float32Array.from({ length: 4096 }, (_, i) => {
  const n = Math.sin(i * 127.1 + 7319) * 43758.5453
  return (n - Math.floor(n)) * 2 - 1
})
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const sx = x - ix, sy = y - iy
  const fx = sx * sx * (3 - 2 * sx), fy = sy * sy * (3 - 2 * sy)
  const at = (x: number, y: number) => lattice[(y & 63) * 64 + (x & 63)]
  return (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy)
    + (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy
}

export class AsciiInteraction {
  private offsets = new Float32Array(0)
  private field = new Float32Array(COLS * ROWS)
  private integral = new Float32Array((COLS + 1) * (ROWS + 1))
  private regions: Region[] = []
  private bounds: Bounds = { x: 0, y: 0, width: 1, height: 1 }
  private pointer = { x: -1000, y: -1000, pulse: 0, active: false }
  private mix = 0
  private scanAge = 1
  private maxOffset = 0
  private densityScan = false
  private scanTime = 0
  private scanRound = 0
  private visited: { x: number; y: number }[] = []

  reset(count: number, bounds: Bounds, densityScan = false) {
    this.offsets = new Float32Array(count * 4)
    this.bounds = { ...bounds }
    this.regions = []
    this.mix = 0
    this.scanAge = 1
    this.maxOffset = 0
    this.densityScan = densityScan
    this.scanTime = 0
    this.scanRound = 0
    this.visited = []
    this.leave()
  }

  move(x: number, y: number) {
    if (!this.pointer.active || Math.hypot(x - this.pointer.x, y - this.pointer.y) > 1.5) this.pointer.pulse = 1
    Object.assign(this.pointer, { x, y, active: true })
  }

  leave() { this.pointer.active = false; this.pointer.pulse = 0 }

  advance<T extends Glyph>(points: T[], time: number, dt: number): T[] {
    const { bounds: b, pointer: pointer, offsets: s } = this
    this.mix += ((pointer.active ? 1 : 0) - this.mix) * (1 - Math.exp(-dt * 9))
    this.scanAge += dt
    if (pointer.active) this.scanTime += dt
    const scan = this.mix > .005 && this.scanAge >= SCAN_INTERVAL
    if (scan) this.field.fill(0)
    const radius = Math.max(45, Math.min(b.width, b.height) * .32)
    const steps = Math.max(1, Math.ceil(dt * 120)), step = dt / steps
    this.maxOffset = 0
    for (let i = 0; i < points.length; i++) {
      const p = points[i], j = i * 4
      const px = p.x - pointer.x, py = p.y - pointer.y
      const distance = Math.max(.1, Math.hypot(px, py))
      const influence = Math.max(0, 1 - distance / radius)
      const force = influence * influence * pointer.pulse * Math.min(25, radius * .2)
      const tx = px / distance * force, ty = py / distance * force * .58
      for (let n = 0; n < steps; n++) {
        s[j + 2] += ((tx - s[j]) * 145 - s[j + 2] * 19) * step
        s[j + 3] += ((ty - s[j + 1]) * 145 - s[j + 3] * 19) * step
        s[j] += s[j + 2] * step
        s[j + 1] += s[j + 3] * step
      }
      this.maxOffset = Math.max(this.maxOffset, Math.hypot(s[j], s[j + 1]))
      const flow = noise((p.x - b.x) / b.width * 12, (p.y - b.y) / b.height * 9 - time * .22)
      p.alpha *= .84 + flow * .16
      p.x += s[j]; p.y += s[j + 1]
      if (scan && p.alpha > .04) {
        const weight = this.densityScan && p.char ? .25 + .75 * Math.max(0, '.:-=+*#%@'.indexOf(p.char)) / 8 : 1
        const gx = (p.x - b.x) / b.width * (COLS - 1), gy = (p.y - b.y) / b.height * (ROWS - 1)
        const x = Math.floor(gx), y = Math.floor(gy), fx = gx - x, fy = gy - y
        // Sample the displayed, displaced glyphs, without reading canvas pixels.
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
          if (x + dx < 0 || x + dx >= COLS || y + dy < 0 || y + dy >= ROWS) continue
          this.field[(y + dy) * COLS + x + dx] += p.alpha * weight * (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy)
        }
      }
    }
    pointer.pulse *= Math.exp(-dt * 5.5)
    if (scan) { this.detect(); this.scanAge = 0 }
    const follow = 1 - Math.exp(-dt * TRACKING_RATE)
    for (const r of this.regions) {
      if (this.densityScan) {
        // Acquire -> wander -> pause -> release -> jump. Distant
        // re-acquisitions stay hidden; local movement remains visible.
        const releasing = !!r.switching
        r.alpha += ((releasing ? 0 : 1) - r.alpha) * (1 - Math.exp(-dt * (releasing ? 16 : 9)))
        if (releasing && r.alpha < .04) {
          r.x = r.tx; r.y = r.ty; r.switching = false
          r.acquired = this.scanTime; r.vx = 0; r.vy = 0
        } else if (!releasing && pointer.active) {
          // Each window has an independent, smoothly changing random heading.
          // Keep speed in artwork pixels so tall and wide scenes feel alike.
          const seed = r.wanderSeed ?? 0, t = this.scanTime * .45
          const angle = ((seed % 1) + noise(t, seed) * .65) * Math.PI * 2
          const speed = Math.min(b.width, b.height) * (.05 + noise(t + 19, seed + 7) * .01)
          const blend = 1 - Math.exp(-dt * 3)
          r.vx = (r.vx ?? 0) + (Math.cos(angle) * speed / b.width * (COLS - 1) - (r.vx ?? 0)) * blend
          r.vy = (r.vy ?? 0) + (Math.sin(angle) * speed / b.height * (ROWS - 1) - (r.vy ?? 0)) * blend
          const ramp = clamp((this.scanTime - (r.acquired ?? 0) - .4) / .35)
            * clamp(((r.nextScan ?? this.scanTime) - this.scanTime - .4) / .35)
          const ease = ramp * ramp * (3 - 2 * ramp)
          const x = Math.max(1, Math.min(COLS - SIDE - 1, r.x + (r.vx ?? 0) * dt * ease))
          const y = Math.max(1, Math.min(ROWS - SIDE - 1, r.y + (r.vy ?? 0) * dt * ease))
          const occupied = this.regions.some(other => other !== r && Math.hypot(other.x - x, other.y - y) < SIDE)
          if (!occupied && this.densityAt(x, y) >= Math.max(.025, r.score * .25)) {
            r.x = r.tx = x; r.y = r.ty = y
          }
        }
        continue
      }
      const far = Math.hypot(r.tx - r.x, r.ty - r.y) > SIDE * 1.5
      r.alpha += ((far ? 0 : 1) - r.alpha) * (1 - Math.exp(-dt * REGION_FADE_RATE))
      if (far) {
        if (r.alpha < .04) { r.x = r.tx; r.y = r.ty }
      } else { r.x += (r.tx - r.x) * follow; r.y += (r.ty - r.y) * follow }
    }
    return points
  }

  private densityAt(x: number, y: number) {
    const ix = Math.round(x), iy = Math.round(y), stride = COLS + 1, sums = this.integral
    return (sums[(iy + SIDE) * stride + ix + SIDE] - sums[iy * stride + ix + SIDE]
      - sums[(iy + SIDE) * stride + ix] + sums[iy * stride + ix]) / (SIDE * SIDE)
  }

  private detect() {
    const stride = COLS + 1, sums = this.integral
    sums.fill(0)
    for (let y = 1; y <= ROWS; y++) {
      let row = 0
      for (let x = 1; x <= COLS; x++) {
        row += Math.min(1, this.field[(y - 1) * COLS + x - 1])
        sums[y * stride + x] = sums[(y - 1) * stride + x] + row
      }
    }
    const candidates: { x: number; y: number; score: number }[] = []
    for (let y = 1; y < ROWS - SIDE; y++) for (let x = 1; x < COLS - SIDE; x++) {
      const signal = (sums[(y + SIDE) * stride + x + SIDE] - sums[y * stride + x + SIDE]
        - sums[(y + SIDE) * stride + x] + sums[y * stride + x]) / (SIDE * SIDE)
      if (signal < .025) continue
      const nearest = this.regions.reduce((d, r) => Math.min(d, (x - r.tx) ** 2 + (y - r.ty) ** 2), Infinity)
      // Favor the current feature so small texture changes do not retarget it.
      candidates.push({ x, y, score: signal + (this.densityScan ? 0 : .06 * Math.exp(-nearest / 128)) })
    }
    if (this.densityScan) {
      const peak = candidates.reduce((m, c) => Math.max(m, c.score), .025)
      for (let i = 0; i < 3; i++) {
        const current = this.regions[i]
        if (current && (current.switching || this.scanTime < (current.nextScan ?? 0))) continue
        let best: typeof candidates[number] | undefined, rank = -Infinity
        for (const minimumJump of [SIDE * 1.5, SIDE]) {
          for (const c of candidates) {
            if (c.score < peak * .35) continue
            if (current && Math.hypot(c.x - current.x, c.y - current.y) < minimumJump) continue
            if (this.regions.some((r, j) => j !== i && Math.hypot(r.tx - c.x, r.ty - c.y) < SIDE * 1.4)) continue
            const disturbance = noise(c.x * .17 + this.scanRound * 2.9 + i * 11, c.y * .17 + this.scanRound * 3.7)
            const recentlySeen = this.visited.reduce((m, r) => Math.max(m, Math.exp(-((r.x - c.x) ** 2 + (r.y - c.y) ** 2) / 100)), 0)
            // Density stays dominant. Spatially coherent noise changes the
            // winning dense patch on each acquisition, without scanning air.
            const score = c.score / peak * .7 + disturbance * .35 - recentlySeen * .26
            if (score > rank) { rank = score; best = c }
          }
          if (best) break
        }
        if (!best) { if (current) current.nextScan = this.scanTime + .8; continue }
        this.scanRound++
        this.visited.push({ x: best.x, y: best.y })
        if (this.visited.length > 8) this.visited.shift()
        const hold = 2.1 + (noise(this.scanRound * 3.1, i * 7) + 1) * .6 + i * .15
        this.regions[i] = current
          ? { ...current, tx: best.x, ty: best.y, score: best.score, switching: true, wanderSeed: Math.random() * 4096, nextScan: this.scanTime + hold + .6 }
          : { ...best, tx: best.x, ty: best.y, alpha: 0, acquired: this.scanTime, wanderSeed: Math.random() * 4096, nextScan: this.scanTime + hold }
      }
      return
    }
    candidates.sort((a, b) => b.score - a.score)
    const selected: typeof candidates = []
    for (const c of candidates) {
      if (selected.every(r => Math.hypot(r.x - c.x, r.y - c.y) >= SIDE * 1.8)) selected.push(c)
      if (selected.length === 3) break
    }
    const remaining = new Set(this.regions)
    this.regions = selected.map(c => {
      const match = [...remaining].sort((a, b) => Math.hypot(a.tx - c.x, a.ty - c.y) - Math.hypot(b.tx - c.x, b.ty - c.y))[0]
      if (match) { remaining.delete(match); match.tx = c.x; match.ty = c.y; match.score = c.score; return match }
      return { ...c, tx: c.x, ty: c.y, alpha: 0 }
    })
  }

  paint(ctx: CanvasRenderingContext2D, color: string) {
    if (this.mix < .005) return
    const b = this.bounds, cw = b.width / (COLS - 1), ch = b.height / (ROWS - 1)
    const boxes = this.regions.map(r => ({ x: b.x + r.x * cw, y: b.y + r.y * ch, w: SIDE * cw, h: SIDE * ch, alpha: r.alpha }))
    ctx.save()
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = .75
    for (let i = 1; i < boxes.length; i++) {
      const a = boxes[i - 1], z = boxes[i]
      ctx.globalAlpha = this.mix * Math.min(a.alpha, z.alpha) * .4
      ctx.beginPath(); ctx.moveTo(a.x + a.w / 2, a.y + a.h / 2); ctx.lineTo(z.x + z.w / 2, z.y + z.h / 2); ctx.stroke()
    }
    boxes.forEach((r, i) => {
      const alpha = clamp(this.mix * r.alpha)
      ctx.globalAlpha = alpha * .04; ctx.fillRect(r.x, r.y, r.w, r.h)
      ctx.globalAlpha = alpha * .75; ctx.lineWidth = .75; ctx.strokeRect(r.x, r.y, r.w, r.h)
      const corner = Math.min(6, r.w / 4, r.h / 4)
      ctx.lineWidth = 1.5; ctx.beginPath()
      for (const [x, y, sx, sy] of [[r.x, r.y, 1, 1], [r.x + r.w, r.y, -1, 1], [r.x, r.y + r.h, 1, -1], [r.x + r.w, r.y + r.h, -1, -1]]) {
        ctx.moveTo(x + corner * sx, y); ctx.lineTo(x, y); ctx.lineTo(x, y + corner * sy)
      }
      ctx.stroke()
      ctx.font = '9px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'
      ctx.fillText(`x:${this.regions[i].x.toFixed(1)} y:${this.regions[i].y.toFixed(1)}`, r.x, r.y - 5)
      ctx.beginPath(); ctx.arc(r.x + r.w / 2, r.y + r.h / 2, 1.5, 0, Math.PI * 2); ctx.fill()
    })
    ctx.restore()
  }

  inspect() { return { scan: this.mix.toFixed(3), regions: this.mix > .01 ? this.regions.length : 0, displacement: this.maxOffset.toFixed(3) } }
}
