import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4173'
const output = 'output/course-articles'
await fs.mkdir(output, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => {
  if (response.url().startsWith(base) && response.status() >= 400) errors.push(response.url())
})
const course = '/resources/ai-programming/'
const go = path => page.goto(base + path, { waitUntil: 'networkidle0' })
const typography = () => page.$eval('.mag-article h1', element => {
  const style = getComputedStyle(element)
  return [style.fontFamily, style.fontSize, style.lineHeight, style.fontWeight]
})
try {
  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await go('/activities/261025-idea-workshop/')
  const activityType = await typography()
  assert.equal(await page.$eval('.mag-article__masthead a', el => el.textContent), '社团活动 · 现场手记')
  assert.equal(await page.$$eval('.magazine-sidebar [aria-current="page"]', els => els.length), 1)
  await page.screenshot({ path: `${output}/activity-desktop.png` })

  for (const chapter of ['01', '02', '03', '04', '05', '06', '07', 'api-setup']) {
    await go(course + 'chapters/' + chapter)
    assert.equal(await page.$$eval('h1', els => els.length), 1)
    assert.deepEqual(await typography(), activityType, chapter + ': shared editorial typography')
    assert.equal(await page.$eval('.mag-article__masthead a', el => el.textContent), 'AI 编程入门 · 从想法到作品')
    assert.equal(await page.$$eval('.magazine-sidebar [aria-current="page"]', els => els.length), 1)
    assert.equal(await page.$eval('.contents-entry[aria-current="page"]', el => el.getAttribute('href')), course + 'chapters/' + chapter)
    assert.equal(await page.$$eval('.contents-entry', els => els.some(el => /^(\d+)\s*\1\s*·/.test(el.textContent))), false)
    assert.equal(await page.$eval('.mag-article__footer nav > a', el => el.getAttribute('href')), course + '#course-content')
    for (const width of [1440, 960, 375, 320]) {
      await page.setViewport({ width, height: 1000 })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${chapter}: overflow at ${width}`)
    }
    await page.setViewport({ width: 1440, height: 1000 })
  }

  await go(course + 'chapters/07')
  await page.$$eval('.mag-article__body img', images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
  assert.equal(await page.$$eval('.mag-article__body img', images => images.length), 14)
  assert.equal(await page.$$eval('.mag-article__body img', images => images.every(image => image.naturalWidth > 0 && image.alt && image.width > 0)), true)
  assert.equal(await page.$$eval('.mag-article__body a[href^="#"]', links => links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))), true)
  const download = await page.$eval('a[download]', el => el.getAttribute('href'))
  const response = await fetch(base + download)
  assert.equal(response.status, 200)
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await fs.readFile('docs/public' + download))
  await page.screenshot({ path: `${output}/chapter-07-desktop.png` })
  await page.$eval('#muzzles', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await page.screenshot({ path: `${output}/chapter-07-process.png` })
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await page.click('.article-sidebar-toggle')
  assert.equal(await page.$eval('.VPSidebar', el => el.inert), true)
  assert.equal(await page.$eval('.article-sidebar-toggle', el => el.getAttribute('aria-expanded')), 'false')
  await page.keyboard.press('Enter')
  assert.equal(await page.$eval('.VPSidebar', el => el.inert), false)
  await page.click(`.contents-entry[href="${course}chapters/06"]`)
  await page.waitForFunction(() => document.querySelector('.contents-entry[aria-current="page"]')?.getAttribute('href')?.endsWith('/06'))
  await page.screenshot({ path: `${output}/chapter-06-desktop.png` })

  await page.setViewport({ width: 375, height: 844 })
  await go(course + 'chapters/07')
  await page.screenshot({ path: `${output}/chapter-07-mobile.png` })
  await page.click('.VPLocalNav .menu')
  await page.waitForSelector('.VPSidebar.open')
  await page.screenshot({ path: `${output}/course-sidebar-mobile.png` })
  await page.click(`.contents-entry[href="${course}chapters/06"]`)
  await page.waitForFunction(() => document.querySelector('.contents-entry[aria-current="page"]')?.getAttribute('href')?.endsWith('/06'))
  assert.equal(await page.$('.VPSidebar.open'), null)
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await go(course + 'chapters/07')
  await page.screenshot({ path: `${output}/chapter-07-dark.png` })
  await page.setJavaScriptEnabled(false)
  await go(course + 'chapters/07')
  assert.equal(await page.$$eval('.mag-article__body img', images => images.length), 14)
  assert.equal(await page.$$eval('.magazine-sidebar [aria-current="page"]', els => els.length), 1)
  assert(await page.$('#dock'))
  assert.deepEqual(errors, [])
  console.log('PASS: eight course articles share activity typography; desktop/mobile sidebar, active routes, 14 screenshots, source ZIP, anchors, 320–1440px layouts, dark mode and SSR')
} finally {
  await browser.close()
}
