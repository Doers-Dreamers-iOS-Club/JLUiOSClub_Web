import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4173'
const out = '/private/tmp/club-intro-qa'
await fs.mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const done = () => page.waitForFunction(() => document.querySelector('.club-home') && !document.querySelector('.club-home').classList.contains('is-intro'))
try {
  for (const [name, width, height, dark] of [['desktop',1440,900,false], ['mobile',390,844,false], ['dark',1440,900,true]]) {
    await page.setViewport({ width, height })
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }])
    await page.goto(base, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.club-intro')
    await wait(300)
    await page.screenshot({ path: `${out}/${name}-slogan.png` })
    await wait(2050)
    assert(await page.$('.club-intro canvas'), 'ASCII fill texture exists during transition')
    await page.screenshot({ path: `${out}/${name}-fill.png` })
    await done()
    await page.waitForSelector('.mag-ascii-hero__canvas:not(.is-hidden)')
    await page.screenshot({ path: `${out}/${name}-final.png` })
    assert.equal(await page.$('.club-intro'), null)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.click('.club-pager [aria-label="学习"]')
    await page.waitForFunction(() => document.querySelector('.club-pager [aria-current]').getAttribute('aria-label') === '学习')
  }
  await page.goto(base, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.club-intro')
  await page.keyboard.press('Escape'); await done()
  await page.goto(base, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.club-intro')
  await page.setViewport({ width: 800, height: 700 }); await done()
  await page.goto(base, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.club-intro')
  await page.evaluate(() => location.hash = 'activities'); await done()
  await page.waitForFunction(() => document.querySelector('.club-pager [aria-current]').getAttribute('aria-label') === '活动')
  await page.goto(base + '/#community', { waitUntil: 'networkidle0' }); await done()
  assert.equal(await page.$('.club-intro'), null)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(base, { waitUntil: 'networkidle0' }); await done()
  assert.equal(await page.$('.club-intro'), null)
  await page.setJavaScriptEnabled(false)
  await page.goto(base, { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('.club-opening__poem', el => getComputedStyle(el).visibility), 'visible')
  assert.deepEqual(errors, [])
  console.log(`Intro checks passed; screenshots: ${out}`)
} finally { await browser.close() }
