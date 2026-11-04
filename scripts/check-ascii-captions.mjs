import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4174'
const out = '/private/tmp/club-caption-qa'
await fs.mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(r.url()) })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const settled = () => page.waitForFunction(() => !document.querySelector('.club-home')?.classList.contains('is-changing') && document.querySelector('.ascii-narrative')?.dataset.morphing !== 'true')
const labels = [['start', 'Fiat lux'], ['activities', 'πῦρ ἐγώ σφιν ὤπασα.'], ['community', 'Ἀργὼ πᾶσι μέλουσα']]
try {
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + '/#start', { waitUntil: 'networkidle0' })
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.includes('/eb-garamond/'))), false, 'Caption fonts must not load before interaction')
  for (const dark of [false, true]) {
    for (const [id, text] of labels) {
      await page.mouse.move(5, 5)
      await page.goto(base + '/#' + id, { waitUntil: 'networkidle0' }); await settled()
      await page.evaluate(dark => document.documentElement.classList.toggle('dark', dark), dark)
      const figure = `#${id} .ascii-artwork`, caption = `#${id} .ascii-caption`
      assert.equal(await page.$eval(caption, e => getComputedStyle(e).opacity), '0')
      const before = await page.$eval(figure, e => e.getBoundingClientRect().height)
      await page.hover(figure + ' .ascii-slot')
      await page.waitForFunction(selector => getComputedStyle(document.querySelector(selector)).opacity === '1', {}, caption)
      await page.evaluate(text => document.fonts.load('16px "Club Exhibition Serif"', text), text)
      const result = await page.$eval(caption, e => {
        const box = e.getBoundingClientRect(), art = e.previousElementSibling.getBoundingClientRect(), style = getComputedStyle(e)
        return { text: e.firstElementChild.textContent, gap: box.top - art.bottom, bottom: box.bottom, width: e.scrollWidth, client: e.clientWidth, font: style.fontFamily, size: parseFloat(style.fontSize) }
      })
      assert.equal(result.text, text)
      assert(result.gap >= 8 && result.gap <= 12)
      assert(result.bottom <= 900 && result.width <= result.client && result.size >= 15)
      assert(result.font.includes('Club Exhibition Serif'))
      assert.equal(await page.$eval(figure, e => e.getBoundingClientRect().height), before, 'Hover must not shift the artwork or links')
      await page.screenshot({ path: `${out}/${id}-${dark ? 'dark' : 'light'}.png` })
      await page.mouse.move(5, 5)
      await wait(400)
      assert.equal(await page.$eval(caption, e => getComputedStyle(e).opacity), '0')
      await page.keyboard.press('Tab')
      await page.$eval(figure, e => e.focus())
      await wait(400)
      assert.equal(await page.$eval(caption, e => getComputedStyle(e).opacity), '1', 'Keyboard focus reveals the label')
    }
  }
  for (const width of [390, 320]) {
    await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true })
    for (const [id] of labels) {
      await page.goto(base + '/#' + id, { waitUntil: 'networkidle0' }); await settled()
      const figure = `#${id} .ascii-artwork`, caption = `#${id} .ascii-caption`
      assert.equal(await page.$eval(caption, e => getComputedStyle(e).opacity), '0')
      await page.tap(figure + ' .ascii-slot')
      await wait(500)
      assert.equal(await page.$eval(caption, e => getComputedStyle(e).opacity), '1')
      assert(await page.$eval(caption, e => e.scrollWidth <= e.clientWidth && e.getBoundingClientRect().bottom < innerHeight))
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      await page.screenshot({ path: `${out}/${id}-${width}.png` })
    }
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(base + '/#community', { waitUntil: 'networkidle0' })
  await page.tap('#community .ascii-slot')
  assert.equal(await page.$eval('#community .ascii-caption', e => getComputedStyle(e).transform), 'none')
  assert.deepEqual(errors, [])
  console.log(`PASS hidden/hover/focus/touch, lazy local fonts, Greek text, desktop/mobile/dark layout and reduced motion; ${out}`)
} finally { await browser.close() }
