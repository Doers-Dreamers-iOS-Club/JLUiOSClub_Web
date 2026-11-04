import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
const base = process.argv[2] || 'http://localhost:4174'
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.evaluateOnNewDocument(() => {
      window.__handoff = []
      const record = now => {
        const home = document.querySelector('.club-home')
        const hero = document.querySelector('.mag-ascii-hero')
        const canvas = hero?.querySelector('canvas')
        const flight = document.querySelector('.club-intro__flight')
        if (home && hero && canvas?.dataset.motionTime) {
          window.__handoff.push({ now, intro: home.classList.contains('is-intro'), motion: Number(canvas.dataset.motionTime), opacity: Number(getComputedStyle(hero).opacity), moving: Number(flight?.dataset.moving || 0), narrative: !!document.querySelector('.ascii-narrative') })
        }
        if (window.__handoff.length < 480) requestAnimationFrame(record)
      }
      requestAnimationFrame(record)
    })
    await page.goto(base, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.club-intro')
    await page.waitForFunction(() => window.__handoff.filter(frame => !frame.intro).length > 20)
    const frames = await page.evaluate(() => window.__handoff)
    const overlap = frames.filter(f => f.intro && f.opacity > .01)
    assert(new Set(overlap.map(f => f.motion)).size >= 4, 'WebGL must already animate during assembly handoff')
    assert(overlap.some(f => f.moving > 0), 'Logo motion must overlap the last flying characters')
    assert(overlap.every(f => f.narrative), 'Narrative initialization must finish before handoff')
    const firstPost = frames.findIndex(f => !f.intro)
    assert(firstPost > 0)
    const before = frames[firstPost - 1], after = frames[firstPost]
    assert(after.motion >= before.motion && after.motion - before.motion < .11, 'Motion phase must not reset at intro teardown')
    const boundary = frames.slice(Math.max(0, firstPost - 8), firstPost + 12)
    const gaps = boundary.slice(1).map((f, i) => f.now - boundary[i].now)
    assert.deepEqual(errors, [])
    console.log(JSON.stringify({ width, movingHandoffFrames: overlap.length, boundaryMaxFrameMs: Math.round(Math.max(...gaps)), continuousPhase: true }))
    await page.close()
  }
  const delayed = await browser.newPage()
  await delayed.setRequestInterception(true)
  delayed.on('request', request => {
    if (/AsciiHero.*\.js/.test(request.url())) setTimeout(() => request.continue(), 2500)
    else request.continue()
  })
  await delayed.goto(base, { waitUntil: 'domcontentloaded' })
  await delayed.waitForSelector('.club-intro__flight', { timeout: 12000 })
  await delayed.waitForFunction(() => !document.querySelector('.club-home').classList.contains('is-intro'))
  console.log('PASS delayed WebGL extends the paused timeline and completes assembly')
  await delayed.close()

} finally { await browser.close() }
