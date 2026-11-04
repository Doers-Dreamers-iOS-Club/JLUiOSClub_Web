import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4174'
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
const route = '/resources/ai-programming/'
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function settled(state) {
  await page.waitForFunction(state => {
    const root = document.querySelector('.course-journal')
    return root?.dataset.coursePage === state && !root.dataset.coverTransition
  }, { timeout: 6000 }, state)
}
async function turning() { await page.waitForFunction(() => !!document.querySelector('.course-journal')?.dataset.coverTransition) }
async function current() { return page.$eval('.course-journal', element => element.dataset.coursePage) }
async function open() { await page.click('.journal-cover__next'); await settled('content') }
try {
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(base + route, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-cover-entrance="playing"]')
  assert.equal(await page.$$eval('.journal-glyph', e => e.length), 12)
  assert(await page.$$eval('.journal-glyph', e => e.some(n => getComputedStyle(n).transform !== 'none')))
  await page.waitForFunction(() => !document.querySelector('.course-journal').dataset.coverEntrance)
  assert.equal(await page.$eval('.journal-cover', e => e.getBoundingClientRect().bottom), 1000)
  assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), 1000)
  assert.equal(await page.$eval('.journal-body', e => e.inert), true)
  assert.deepEqual(await page.$$eval('.art-stage', e => e.map(n => n.dataset.motionState)), ['waiting', 'waiting', 'waiting'])
  assert(await page.$$eval('.journal-glyph', e => e.every(n => !n.style.transform && !n.style.color)))
  console.log('PASS full-screen cover, staggered glyph entrance, clean final typography and no SVG autoplay behind cover')

  // A single uninterrupted gesture may keep scrolling as soon as the content is visible.
  await page.mouse.move(40, 500)
  await page.mouse.wheel({ deltaY: 80 }); await turning()
  while (await page.$eval('.course-journal', e => !!e.dataset.coverTransition)) {
    await page.mouse.wheel({ deltaY: 80 }); await wait(25)
  }
  await page.mouse.wheel({ deltaY: 120 }); await wait(100)
  assert.equal(await current(), 'content')
  assert(await page.evaluate(() => scrollY) > 50)
  assert(await page.$$eval('.art-stage', e => e.some(n => n.dataset.motionState !== 'complete')), 'Scroll must work before the SVG finishes')
  assert.equal(await page.$eval('.VPNav', e => e.getBoundingClientRect().top), 0)
  console.log('PASS gutter input and immediate scrolling during the same gesture, without waiting for SVG completion')

  await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' })); await wait(80)
  await page.mouse.wheel({ deltaY: -100 }); await wait(150)
  assert.equal(await current(), 'content', 'Do not return before the article reaches the real top')
  assert(await page.evaluate(() => scrollY) > 200)
  await page.mouse.wheel({ deltaY: -600 }); await settled('cover')
  assert.equal(await page.evaluate(() => scrollY), 0)
  await open()
  await page.evaluate(() => scrollTo({ top: 30, behavior: 'instant' })); await wait(60)
  await page.mouse.move(1400, 500)
  for (let i = 0; i < 24 && await current() === 'content'; i++) { await page.mouse.wheel({ deltaY: -2 }); await wait(25) }
  await settled('cover')
  console.log('PASS large and slow upward gestures in both margins: return only when native scroll reaches zero')

  await open(); await page.mouse.move(40, 500); await page.mouse.wheel({ deltaY: -24 }); await settled('cover')
  await open(); await page.keyboard.press('PageUp'); await settled('cover')
  await page.keyboard.press('PageDown'); await settled('content')
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'course-content')
  console.log('PASS immediate direction reversal and keyboard page changes')

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('.journal-cover', e => Math.round(e.getBoundingClientRect().bottom)), 844)
  const client = await page.createCDPSession()
  async function swipe(from, to) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: from }] })
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: (from + to) / 2 }] }); await wait(40)
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: to }] })
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  }
  await swipe(620, 440); await settled('content')
  await page.evaluate(() => scrollTo({ top: 120, behavior: 'instant' })); await wait(100)
  await swipe(250, 600); await settled('cover')
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  console.log('PASS mobile full-screen layout and real touch return at the article top')

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); await open()
  assert.equal(await page.evaluate(() => scrollY), 0)
  assert.equal(await page.$eval('.journal-cover', e => e.style.transform), '')
  assert(await page.$$eval('.journal-glyph', e => e.every(n => !n.style.transform && !n.style.color)))
  await page.setViewport({ width: 844, height: 390, isMobile: false, hasTouch: false })
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await page.mouse.move(400, 250); await page.mouse.wheel({ deltaY: 160 }); await wait(200)
  assert(await page.evaluate(() => scrollY) > 0)
  assert.equal(await current(), undefined)
  console.log('PASS reduced-motion state changes and short-screen native fallback')

  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.goto(base + route + '#course-content', { waitUntil: 'networkidle0' }); await settled('content')
  assert.equal(await page.evaluate(() => scrollY), 0)
  await page.click('.journal-chapter'); await page.waitForSelector('.ai-course-article')
  await page.goBack(); await settled('content')
  await page.goto(base + route + 'chapters/01', { waitUntil: 'networkidle0' }); await page.click('.reading-tools a:first-child')
  await page.waitForSelector('[data-cover-entrance="playing"]')
  await settled('cover')
  await page.waitForFunction(() => !document.querySelector('.course-journal').dataset.coverEntrance)
  console.log('PASS content deep link, history restoration and fresh cover entrance from another page')

  const nojs = await browser.newPage(); await nojs.setViewport({ width: 1440, height: 1000 })
  await nojs.setJavaScriptEnabled(false); await nojs.goto(base + route, { waitUntil: 'networkidle0' }); await nojs.bringToFront()
  await nojs.click('.journal-cover__next')
  // Poll from Node: in-page rAF polling is unreliable with script execution disabled.
  for (let i = 0; i < 25 && !(await nojs.evaluate(() => scrollY > 500)); i++) await wait(100)
  assert(await nojs.evaluate(() => location.hash === '#course-content' && scrollY > 500))
  assert.deepEqual(errors, [])
  console.log('PASS no-JavaScript anchor fallback and no runtime errors')
} finally { await browser.close() }
