import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4174'
const out = '/private/tmp/club-artwork-first-frame'
await fs.mkdir(out, { recursive: true })
const routes = [
  { path: '/activities/260209-winter-swift/', hash: '#activity-content', root: '.swift-artwork', state: 'artState', hidden: '[data-art-finish]' },
  { path: '/activities/', hash: '#activity-content', root: '.activities-artwork', state: 'artState', hidden: '[data-art-finish]' },
  { path: '/resources/ai-programming/', hash: '#course-content', root: '.art-stage', state: 'motionState', hidden: '.art-sketch' }
]
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  for (const [index, route] of routes.entries()) {
    let page = await browser.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base + route.path, { waitUntil: 'networkidle0' })
    await page.waitForFunction(() => document.querySelector('[data-course-page="cover"]'))
    await page.evaluate(route => {
      window.__artFrames = []
      window.__stopFrames = false
      const sample = () => {
        const root = document.querySelector(route.root)
        const journal = root.closest('.activity-journal,.course-journal')
        if (journal.dataset.coursePage === 'content') {
          window.__artFrames.push({ state: root.dataset[route.state], opacity: Number(getComputedStyle(root.querySelector(route.hidden)).opacity), transition: journal.dataset.coverTransition })
        }
        if (!window.__stopFrames) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    }, route)
    await page.mouse.move(40, 500)
    await page.mouse.wheel({ deltaY: 100 })
    await page.waitForFunction(route => document.querySelector(route.root)?.dataset[route.state] === 'complete', { timeout: 10000 }, route)
    const frames = await page.evaluate(() => { window.__stopFrames = true; return window.__artFrames })
    const waiting = frames.filter(frame => frame.state === 'waiting')
    assert(waiting.length > 3, 'Sample the visible incoming panel before playback')
    assert(waiting.every(frame => frame.opacity === 0), `${route.path}: completed details flashed before animation: ${JSON.stringify(waiting.slice(0, 5))}`)
    assert(frames.some(frame => frame.state === 'playing'), 'Animation must play after the initial state')
    await page.screenshot({ path: `${out}/${index}-complete.png` })
    await page.close()
    page = await browser.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewport({ width: 1440, height: 1000 })
    // A deep link must also start correctly while its JS chunks are in flight.
    let holdScripts = true
    const held = []
    await page.setRequestInterception(true)
    page.on('request', request => {
      if (holdScripts && request.resourceType() === 'script') held.push(request)
      else request.continue().catch(() => {})
    })
    const navigation = page.goto(base + route.path + route.hash, { waitUntil: 'networkidle0' })
    navigation.catch(() => {})
    await page.waitForSelector(route.root)
    await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--mag-accent').trim())
    assert.equal(await page.$eval(route.root, (root, route) => Number(getComputedStyle(root.querySelector(route.hidden)).opacity), route), 0, 'SSR must show the starting pose before the animation bundle arrives')
    await (await page.$(route.root)).screenshot({ path: `${out}/${index}-before-hydration.png` })
    holdScripts = false
    await Promise.all(held.splice(0).map(request => request.continue()))
    await navigation
    await page.waitForFunction(route => document.querySelector(route.root)?.dataset[route.state] === 'complete', { timeout: 10000 }, route)
    assert.equal(await page.$eval(route.root, (root, route) => Number(getComputedStyle(root.querySelector(route.hidden)).opacity), route), 1)

    if (route.state === 'motionState') {
      await page.setViewport({ width: 390, height: 500, isMobile: true, hasTouch: true })
      await page.goto(base + route.path, { waitUntil: 'networkidle0' })
      assert.equal(await page.$eval('.art-code text', el => Number(getComputedStyle(el).opacity)), .1, 'Offscreen code starts faint, not complete')
      assert.equal(await page.$eval('.art-snake', el => Number(getComputedStyle(el).opacity)), 0, 'Offscreen snake stays undrawn')
      await page.$eval('.art-stage:last-child', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.waitForFunction(() => document.querySelector('.art-stage:last-child').dataset.motionState === 'complete')
      assert.equal(await page.$eval('.art-snake', el => Number.parseFloat(getComputedStyle(el).strokeDashoffset)), 0)
    }
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto(base + route.path + route.hash, { waitUntil: 'networkidle0' })
    assert.equal(await page.$eval(route.root, (root, route) => Number(getComputedStyle(root.querySelector(route.hidden)).opacity), route), 1, 'Reduced motion keeps the complete artwork')
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await (await page.$(route.root)).screenshot({ path: `${out}/${index}-mobile-dark.png` })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await page.setJavaScriptEnabled(false)
    await page.goto(base + route.path + route.hash, { waitUntil: 'networkidle0' })
    assert.equal(await page.$eval(route.root, (root, route) => Number(getComputedStyle(root.querySelector(route.hidden)).opacity), route), 1, 'No-JavaScript fallback keeps the complete artwork')
    await page.close()
    // Test the narrow first paint in a separate document; changing mobile
    // emulation during a pending navigation would itself trigger a reload.
    page = await browser.newPage()
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
    await page.setRequestInterception(true)
    page.on('request', request => request.resourceType() === 'script' ? request.abort() : request.continue())
    await page.goto(base + route.path + route.hash, { waitUntil: 'networkidle0' })
    assert.equal(await page.$eval(route.root, (root, route) => Number(getComputedStyle(root.querySelector(route.hidden)).opacity), route), 0)
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await (await page.$(route.root)).screenshot({ path: `${out}/${index}-mobile-before-hydration.png` })
    await page.close()
    console.log('PASS', route.path, 'cover transition, delayed hydration, deep link, mobile first paint, reduced motion and no-JS')
  }
  assert.deepEqual(errors, [])
} finally { await browser.close() }
