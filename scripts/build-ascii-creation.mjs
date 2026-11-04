import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

// Source-space regions separate fire, cloth and water from the rigid artwork.
// Their coordinates refer to the full source image, before automatic cropping.
const subjects = [
 { name: 'hands', file: 'hands-source.png', desktop: 160, mobile: 80 },
 { name: 'prometheus', file: 'prometheus-source.png', desktop: 90, mobile: 60, flameBase: .36,
   flame: [[.55,0],[.87,0],[.87,.39],[.738,.366],[.69,.347],[.625,.33],[.55,.33]] },
 { name: 'argo', file: 'argo-source.png', desktop: 112, mobile: 72,
   sail: [[.237,.293],[.758,.293],[.79,.385],[.796,.49],[.74,.613],[.71,.625],[.64,.59],[.5,.566],[.4,.581],[.23,.627],[.279,.51],[.278,.41]], mast: .495, water: .815 }
]
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
try {
 const page = await browser.newPage()
 for (const subject of subjects) {
  const bytes = await fs.readFile('docs/public/ascii-creation/' + subject.file)
  for (const mobile of [false, true]) {
   const name = subject.name + (mobile ? '-mobile' : '')
   const cols = mobile ? subject.mobile : subject.desktop
   const result = await page.evaluate(async ({ src, cols, subject }) => {
    const image = new Image(); image.src = src; await image.decode()
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let x0 = canvas.width, y0 = canvas.height, x1 = 0, y1 = 0
    for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) {
     if (pixels[(y * canvas.width + x) * 4] < 215) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    }
    const pad = 12
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(canvas.width, x1 + pad); y1 = Math.min(canvas.height, y1 + pad)
    const rows = Math.ceil((y1 - y0) / (x1 - x0) * cols * .6)
    canvas.width = cols; canvas.height = rows
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, cols, rows); ctx.drawImage(image, x0, y0, x1 - x0, y1 - y0, 0, 0, cols, rows)
    const small = ctx.getImageData(0, 0, cols, rows).data
    const ramp = ' .:-=+*#%@', lines = [], parts = []
    const sail = new Path2D()
    subject.sail?.forEach(([x, y], i) => i ? sail.lineTo(x, y) : sail.moveTo(x, y)); sail.closePath()
    const flame = new Path2D()
    subject.flame?.forEach(([x, y], i) => i ? flame.lineTo(x, y) : flame.moveTo(x, y)); flame.closePath()
    for (let y = 0; y < rows; y++) {
     let line = '', part = ''
     for (let x = 0; x < cols; x++) {
      const value = small[(y * cols + x) * 4], density = value > 233 ? 0 : Math.pow((255 - value) / 255, subject.name === 'hands' ? 1 : .7)
      const glyph = ramp[Math.min(9, Math.ceil(density * 9))]
      const sx = (x0 + (x + .5) * (x1 - x0) / cols) / image.width
      const sy = (y0 + (y + .5) * (y1 - y0) / rows) / image.height
      let region = 0
      if (glyph !== ' ' && subject.name === 'prometheus') region = ctx.isPointInPath(flame, sx, sy) ? 1 : 2
      if (glyph !== ' ' && subject.name === 'argo') region = sy > subject.water ? 3 : ctx.isPointInPath(sail, sx, sy) && Math.abs(sx - subject.mast) > .009 ? 1 : 2
      line += glyph; part += region
     }
     lines.push(line); parts.push(part)
    }
    if (subject.name === 'argo') {
     // Sparse native ASCII swells extend the sea without changing the source
     // engraving. Blank rows keep the four layers light at phone sizes too.
     const patterns = ['..__--~~--__..', '--__..~~..__--', '..--~~__~~--..', '__..--~~--..__']
     for (let layer = 0; layer < 4; layer++) {
      const pattern = patterns[layer]
      const inset = Math.round(cols * (.03 + layer * .045))
      let line = ''
      for (let col = 0; col < cols; col++) {
       const gap = (col + layer * 9) % 29 > 22
       line += col < inset || col >= cols - inset || gap ? ' ' : pattern[(col + layer * 4) % pattern.length]
      }
      lines.push(' '.repeat(cols), line)
      parts.push('0'.repeat(cols), Array.from(line, char => char === ' ' ? '0' : '3').join(''))
     }
    }
    const bounds = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }
    if (subject.name === 'hands') return { cols, rows, lines, bounds }
    const ux = x => (x * image.width - x0) / (x1 - x0)
    return { cols, rows: lines.length, lines, bounds, parts, features: {
     flameBase: ((subject.flameBase ?? .43) * image.height - y0) / (y1 - y0),
     mast: ux(subject.mast ?? .5), sailLeft: ux(subject.sail ? Math.min(...subject.sail.map(p => p[0])) : .3), sailRight: ux(subject.sail ? Math.max(...subject.sail.map(p => p[0])) : .8)
    } }
   }, { src: 'data:image/png;base64,' + bytes.toString('base64'), cols, subject })
   await fs.writeFile('.vitepress/theme/ascii/creation/' + name + '.json', JSON.stringify(result))
   console.log(name, result.cols, result.rows, result.lines.join('').replaceAll(' ', '').length)
  }
 }
} finally { await browser.close() }
