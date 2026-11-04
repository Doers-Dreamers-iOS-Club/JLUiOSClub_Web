import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4174'
const routes = ['/activities/260209-winter-swift/', '/activities/', '/resources/ai-programming/']
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  for (const width of [1440, 390]) {
    for (const route of routes) {
      const page = await browser.newPage()
      page.on('pageerror', error => errors.push(error.message))
      await page.setViewport({ width, height: width === 390 ? 844 : 1000, isMobile: width === 390, hasTouch: width === 390 })
      const held = []
      let delayScrollPlugin = true
      await page.setRequestInterception(true)
      page.on('request', request => {
        if (delayScrollPlugin && /\/ScrollTrigger\./.test(request.url())) held.push(request)
        else request.continue().catch(() => {})
      })
      await page.goto(base + route, { waitUntil: 'networkidle0' })
      await page.waitForFunction(() => document.querySelector('[data-course-page="cover"]') && !document.querySelector('[data-cover-entrance]'))
      await page.evaluate(() => {
        window.__contentFrames = []
        window.__recordContent = true
        const root = document.querySelector('.activity-journal,.course-journal')
        const targets = [...root.querySelectorAll('.journal-section__head,.journal-chapter')]
        const path = root.querySelector('[data-art-draw],.art-sketch')
        const sample = () => {
          if (root.dataset.coursePage === 'content') {
            window.__contentFrames.push({
              transition: root.dataset.coverTransition || '', prepared: !!path.style.strokeDasharray,
              scrollY, boxes: targets.map(target => {
                const rect = target.getBoundingClientRect()
                return { x: rect.x, y: rect.y, height: rect.height, opacity: Number(getComputedStyle(target).opacity) }
              })
            })
          }
          if (window.__recordContent) requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })
      await page.click('.journal-cover__next')
      await page.waitForFunction(() => document.querySelector('[data-course-page="content"]') && !document.querySelector('[data-cover-transition]'))
      delayScrollPlugin = false
      await Promise.all(held.splice(0).map(request => request.continue()))
      await page.waitForFunction(() => window.__contentFrames.filter(frame => !frame.transition).length >= 75)
      const frames = await page.evaluate(() => { window.__recordContent = false; return window.__contentFrames })
      const start = frames[0]
      const visible = start.boxes.map((box, index) => box.y < innerHeightFor(width) && box.y + box.height > 64 ? index : -1).filter(index => index >= 0)
      for (const index of visible) {
        const origin = start.boxes[index]
        assert(frames.every(frame => Math.abs(frame.boxes[index].y - origin.y) < .5 && Math.abs(frame.boxes[index].x - origin.x) < .5), `${route} ${width}: visible content jumped when scrolling motion initialized`)
        assert(frames.every(frame => frame.boxes[index].opacity === 1), `${route} ${width}: visible content faded after the page was already shown`)
      }
      assert(frames.filter(frame => frame.transition).every(frame => frame.prepared), `${route} ${width}: SVG setup must finish before the incoming page is painted`)
      assert(frames.every(frame => frame.scrollY === 0), 'Settling must not nudge native scroll')
      console.log('PASS', route, width, 'stable visible content and SVG prepared before the first transition frame')
      await page.close()
    }
  }
  assert.deepEqual(errors, [])
} finally { await browser.close() }
function innerHeightFor(width) { return width === 390 ? 844 : 1000 }
