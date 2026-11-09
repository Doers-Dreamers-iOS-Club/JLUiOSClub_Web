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
  if (!response.url().startsWith(base)) return
  if (response.status() >= 400) errors.push(response.url())
  if (response.status() !== 304 && new URL(response.url()).pathname.endsWith('.css') && !response.headers()['content-type']?.includes('text/css')) errors.push('Invalid CSS response: ' + response.url())
})
const course = '/resources/ai-programming/'
const go = path => page.goto(base + path, { waitUntil: 'networkidle0' })
const typography = () => page.$eval('.mag-article h1', element => {
  const style = getComputedStyle(element)
  return [style.fontFamily, style.fontSize, style.lineHeight, style.fontWeight]
})
async function checkReadingLayout() {
  const layout = await page.evaluate(() => {
    const rect = selector => document.querySelector(selector).getBoundingClientRect()
    const header = rect('.mag-article__header')
    const body = rect('.mag-article__body')
    const outline = rect('.mag-article__outline-panel')
    return {
      centeredHeader: Math.abs((header.left + header.right) / 2 - innerWidth / 2) < 1,
      originalWidth: header.width <= 1080 && header.left >= 48,
      centeredBody: Math.abs((body.left + body.right) / 2 - innerWidth / 2) < 1,
      besideBody: body.right < outline.left,
    }
  })
  assert.deepEqual(layout, { centeredHeader: true, originalWidth: true, centeredBody: true, besideBody: true })
}
const visibleOutline = () => page.waitForSelector('.mag-article__outline-panel[data-state="visible"]', { visible: true })
const hideOutline = () => page.waitForSelector('.mag-article__outline-panel', { hidden: true })
try {
  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await go('/activities/261025-idea-workshop/')
  assert.deepEqual(errors, [], 'Preview must serve the latest built styles')
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
    await page.waitForSelector('.mag-article__outline', { hidden: true })
    for (const width of [1440, 960, 375, 320]) {
      await page.setViewport({ width, height: 1000 })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${chapter}: overflow at ${width}`)
    }
    await page.setViewport({ width: 1440, height: 1000 })
    await page.click('.article-sidebar-toggle')
    await hideOutline()
    await checkReadingLayout()
    await page.$eval('.mag-article__body', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await visibleOutline()
    await checkReadingLayout()
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await hideOutline()
    await page.click('.article-sidebar-toggle')
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
  await hideOutline()
  await page.screenshot({ path: `${output}/chapter-07-centered-header.png` })
  await page.$eval('.mag-article__body', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await visibleOutline()
  await checkReadingLayout()
  assert.equal(await page.$eval('.mag-article__outline ul', el => getComputedStyle(el).listStyleType), 'none')
  assert.equal(await page.$eval('.mag-article__body img', el => getComputedStyle(el).borderRadius), '2px', 'Shared article styles retain precedence over Markdown defaults')
  assert.equal(await page.$$eval('.VPDocAsideOutline a', links => links.length > 0 && links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))), true)
  await page.screenshot({ path: `${output}/chapter-07-outline.png` })
  await page.click('.VPDocAsideOutline a[href="#muzzles"]')
  await page.waitForFunction(() => location.hash === '#muzzles' && document.querySelector('.VPDocAsideOutline a[href="#muzzles"]')?.classList.contains('active'))
  assert.equal(await page.$eval('.mag-article__outline-panel', el => {
    const top = el.getBoundingClientRect().top
    const nav = document.querySelector('.VPNav').getBoundingClientRect().bottom
    return top >= nav && top <= nav + 33
  }), true, 'Outline stays beside the body while scrolling')
  await page.screenshot({ path: `${output}/chapter-07-outline-active.png` })
  for (const width of [1280, 1024, 960]) {
    await page.setViewport({ width, height: 1000 })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Collapsed sidebar: overflow at ${width}`)
    await page.waitForSelector(width >= 1280 ? '.mag-article__outline-panel' : '.VPLocalNav .VPLocalNavOutlineDropdown', { visible: true })
    if (width < 1280) {
      await page.click('.VPLocalNavOutlineDropdown > button')
      await page.waitForSelector('.VPLocalNavOutlineDropdown .items', { visible: true })
      assert(await page.$('.VPLocalNavOutlineDropdown a[href="#dock"]'))
      await page.keyboard.press('Escape')
      await page.waitForSelector('.VPLocalNavOutlineDropdown .items', { hidden: true })
    }
  }
  await page.setViewport({ width: 1440, height: 1000 })
  await page.focus('.article-sidebar-toggle')
  await page.keyboard.press('Enter')
  assert.equal(await page.$eval('.VPSidebar', el => el.inert), false)
  await page.waitForSelector('.mag-article__outline', { hidden: true })
  await page.setViewport({ width: 1024, height: 1000 })
  await page.waitForSelector('.VPLocalNav', { hidden: true })
  await page.setViewport({ width: 1440, height: 1000 })
  await page.click(`.contents-entry[href="${course}chapters/06"]`)
  await page.waitForFunction(() => document.querySelector('.contents-entry[aria-current="page"]')?.getAttribute('href')?.endsWith('/06'))
  await page.screenshot({ path: `${output}/chapter-06-desktop.png` })

  // Both scrolling into the body and collapsing an already-scrolled sidebar animate.
  await go(course + 'chapters/07')
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.click('.article-sidebar-toggle')
  await page.waitForFunction(() => !document.querySelector('.mag-article').style.transform)
  await hideOutline()
  await page.$eval('#muzzles', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  const checkEntrance = async () => {
    await page.waitForSelector('.mag-article__outline-panel[data-state="entering"]')
    assert.equal(await page.$eval('.mag-article__outline-panel', el => {
      const style = getComputedStyle(el)
      return Number(style.opacity) < 1 && new DOMMatrixReadOnly(style.transform).m41 > 0
    }), true, 'Outline fades and slides into view')
    await visibleOutline()
  }
  await checkEntrance()
  await page.click('.article-sidebar-toggle')
  await hideOutline()
  await page.waitForFunction(() => !document.querySelector('.mag-article').style.transform)
  await page.click('.article-sidebar-toggle')
  await checkEntrance()
  await page.waitForFunction(() => !document.querySelector('.mag-article').style.transform)
  await checkReadingLayout()
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await hideOutline()
  assert.equal(await page.$eval('.mag-article__outline-panel', el => el.inert), true)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.$eval('#muzzles', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await visibleOutline()
  assert.equal(await page.$eval('.mag-article__outline-panel', el => getComputedStyle(el).opacity), '1')

  await page.setViewport({ width: 375, height: 844 })
  await go(course + 'chapters/07')
  await page.screenshot({ path: `${output}/chapter-07-mobile.png` })
  await page.click('.VPLocalNav .menu')
  await page.waitForSelector('.VPSidebar.open')
  await page.waitForSelector('.VPLocalNavOutlineDropdown', { hidden: true })
  await page.screenshot({ path: `${output}/course-sidebar-mobile.png` })
  await page.click(`.contents-entry[href="${course}chapters/06"]`)
  await page.waitForFunction(() => document.querySelector('.contents-entry[aria-current="page"]')?.getAttribute('href')?.endsWith('/06'))
  assert.equal(await page.$('.VPSidebar.open'), null)
  await page.waitForSelector('.VPLocalNavOutlineDropdown', { visible: true })
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await go(course + 'chapters/07')
  await page.screenshot({ path: `${output}/chapter-07-dark.png` })
  await page.setJavaScriptEnabled(false)
  await go(course + 'chapters/07')
  assert.equal(await page.$$eval('.mag-article__body img', images => images.length), 14)
  assert.equal(await page.$$eval('.magazine-sidebar [aria-current="page"]', els => els.length), 1)
  assert(await page.$('#dock'))
  assert.deepEqual(errors, [])
  console.log('PASS: eight centered headers with original margins; scroll and sidebar-triggered outline entrances, reduced motion, sticky navigation, anchors, responsive layouts, media, downloads and SSR')
} finally {
  await browser.close()
}
