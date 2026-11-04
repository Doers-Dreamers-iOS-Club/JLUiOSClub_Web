import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4174'
const routes = ['/activities/260209-winter-swift/', '/resources/ai-programming/', '/activities/']
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const errors = []
const resources = page => page.evaluate(() => performance.getEntriesByType('resource').map(entry => ({ name: entry.name, bytes: entry.decodedBodySize })))
try {
  for (const route of routes) {
    const page = await browser.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base + route, { waitUntil: 'networkidle0' })
    await page.waitForFunction(() => document.querySelector('[data-course-page="cover"]') && !document.querySelector('[data-cover-entrance]'))
    const initial = await resources(page)
    assert(!initial.some(r => /\/(?:Mermaid|ClubHome|AsciiHero|AsciiNarrative|ScrollTrigger)\./.test(r.name)), 'A cover must not fetch diagram, homepage or scrolling runtimes')
    const jsBytes = initial.filter(r => /\.js($|\?)/.test(r.name)).reduce((sum, r) => sum + r.bytes, 0)
    assert(jsBytes < 400000, `Cover JavaScript budget exceeded: ${jsBytes}`)
    await page.click('.journal-cover__next')
    await page.waitForFunction(() => document.querySelector('[data-course-page="content"]') && !document.querySelector('[data-cover-transition]'))
    await page.waitForFunction(() => performance.getEntriesByType('resource').some(r => /\/ScrollTrigger\./.test(r.name)))
    await page.waitForSelector('.journal-chapter[style]')
    await page.waitForSelector(route.includes('/resources/') ? '[data-motion-state="complete"]' : '[data-art-state="complete"]')
    console.log('PASS', route, { initialJsBytes: jsBytes, deferredContentMotion: true })
    await page.close()
  }
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(base + '/resources/ai-programming/#course-content', { waitUntil: 'networkidle0' })
  assert(!(await resources(page)).some(r => /\/ScrollTrigger\./.test(r.name)), 'Reduced motion should not download the scrolling runtime')
  assert.equal(await page.$eval('.journal-chapter', el => getComputedStyle(el).opacity), '1')
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.waitForSelector('.journal-chapter[style]')
  // The preload change must preserve real diagram rendering after SPA navigation.
  await page.$eval('a[href="/join-us/"]', el => el.click())
  await page.waitForSelector('.mermaid-container svg', { timeout: 30000 })
  assert.deepEqual(errors, [])
  console.log('PASS reduced-motion loading, live preference change and lazy Mermaid after navigation')
} finally { await browser.close() }
