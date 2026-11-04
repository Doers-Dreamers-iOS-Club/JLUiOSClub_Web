import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4174'
const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
try {
  const page = await browser.newPage()
  // Block external JavaScript completely: HTML/CSS must still show the animated slogan.
  await page.setRequestInterception(true)
  page.on('request', request => request.resourceType() === 'script' ? request.abort() : request.continue())
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#club-boot', { visible: true, timeout: 2000 })
  assert((await page.$eval('#club-boot', el => el.textContent)).includes('I dwell in Possibility'))
  await page.screenshot({ path: '/private/tmp/club-boot-without-bundle.png' })
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.documentElement.classList.contains('club-booting'))
  await page.close()

  const live = await browser.newPage()
  const errors = []
  live.on('pageerror', error => errors.push(error.message))
  await live.goto(base, { waitUntil: 'networkidle0' })
  await live.waitForFunction(() => document.querySelector('.club-home') && !document.querySelector('.club-home').classList.contains('is-intro'))
  await live.waitForSelector('.ascii-narrative')
  const resources = await live.evaluate(() => performance.getEntriesByType('resource').map(r => ({ name: r.name, bytes: r.decodedBodySize, start: r.startTime })))
  await fs.writeFile('/private/tmp/club-load-after.json', JSON.stringify(resources, null, 2))
  assert(!resources.some(r => /mermaid|Diagram|PromptWorkshop|RecallQuiz/i.test(r.name)), 'Home must not fetch diagram or course runtimes')
  const jsBytes = resources.filter(r => /\.js($|\?)/.test(r.name)).reduce((sum, r) => sum + r.bytes, 0)
  assert(jsBytes < 1800000, `Homepage JavaScript unexpectedly large: ${jsBytes}`)
  const hero = resources.find(r => /AsciiHero.*\.js/.test(r.name))
  assert(hero && hero.start > 650, 'WebGL should load after the lightweight first phase')
  await live.goto(base + '/join-us/', { waitUntil: 'networkidle0' })
  await live.waitForSelector('.mermaid-container svg', { timeout: 30000 })
  await live.goto(base + '/resources/ai-programming/', { waitUntil: 'networkidle0' })
  assert(await live.$('h1'))
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ jsBytes, requests: resources.length, webglRequestMs: Math.round(hero.start), htmlFirstCover: true, lazyMermaidRendered: true }))
} finally { await browser.close() }
