export type IntroGlyph = { x: number; y: number; char: string; size: number; alpha: number }
export type IntroSnapshot = { points: IntroGlyph[]; width: number; height: number }
/** The texture and particle sources share exactly the same glyph grid. */
export function introAscii(word: HTMLElement) {
  const box = word.getBoundingClientRect()
  const padding = 50
  const canvas = document.createElement('canvas')
  const mask = document.createElement('canvas')
  const width = Math.ceil(box.width + padding * 2)
  const height = Math.ceil(box.height + padding * 2)
  canvas.width = mask.width = width * 2
  canvas.height = mask.height = height * 2
  const ctx = canvas.getContext('2d')
  const ink = mask.getContext('2d')
  if (!ctx || !ink) return null
  ctx.scale(2, 2)
  ink.scale(2, 2)
  const walker = document.createTreeWalker(word, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const style = getComputedStyle(node.parentElement!)
    ink.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    ink.fillStyle = '#fff'
    for (let i = 0; i < (node.textContent?.length || 0); i++) {
      const range = document.createRange()
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const rect = range.getBoundingClientRect()
      const char = node.textContent![i]
      const metrics = ink.measureText(char)
      const ascent = metrics.fontBoundingBoxAscent
      const descent = metrics.fontBoundingBoxDescent
      ink.fillText(char, rect.left - box.left + padding,
        rect.top - box.top + padding + (rect.height - ascent - descent) / 2 + ascent)
    }
  }
  ctx.fillStyle = getComputedStyle(word).color
  ctx.font = '9px monospace'
  const chars = '.:+*01<>/{}'
  const points: IntroGlyph[] = []
  const pixels = ink.getImageData(0, 0, mask.width, mask.height).data
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 6) {
      const char = chars[(x * 7 + y * 13 + Math.floor(x / 6) * Math.floor(y / 10)) % chars.length]
      ctx.fillText(char, x, y)
      const cx = Math.min(mask.width - 1, (x + 3) * 2)
      const cy = Math.max(0, Math.min(mask.height - 1, (y - 3) * 2))
      if (pixels[(cy * mask.width + cx) * 4 + 3] > 80) points.push({ x: box.left + x + 3 - padding, y: box.top + y - 3 - padding, char, size: 9, alpha: 1 })
    }
  }
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(mask, 0, 0, width, height)
  Object.assign(canvas.style, { position: 'absolute', left: `${-padding}px`, top: `${-padding}px`, width: `${width}px`, height: `${height}px`, opacity: '0', pointerEvents: 'none' })
  canvas.setAttribute('aria-hidden', 'true')
  return { canvas, points }
}
