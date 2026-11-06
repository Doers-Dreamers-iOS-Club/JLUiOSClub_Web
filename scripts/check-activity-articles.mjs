import assert from 'node:assert/strict'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4175'
const output = '/private/tmp/club-activity-articles'
const root = new URL('../docs/activities/', import.meta.url)
const files = (await readdir(root, { recursive: true })).filter(file => file.endsWith('.md') && file !== 'AGENTS.md').sort()
const articles = []
for (const file of files) {
  const source = await readFile(new URL(file, root), 'utf8')
  if (source.includes('pageClass: mag-article-page')) articles.push({ file, route: '/activities/' + file.replace(/index\.md$|\.md$/g, '') })
}
await mkdir(output, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'warn' && /Failed to resolve component/.test(message.text())) errors.push(message.text()) })
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await browser.defaultBrowserContext().overridePermissions(base, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'])
  for (const { file, route } of articles) {
    const name = file.replaceAll('/', '-').replace('.md', '')
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base + route, { waitUntil: 'networkidle0' })
    assert.equal(await page.$$eval('h1', elements => elements.length), 1, route)
    assert.equal(await page.$$eval('.mag-article', elements => elements.length), 1, route)
    assert.equal(await page.$$eval('.mag-article .mag-card, .mag-article .mag-step, .mag-article .mag-hero', elements => elements.length), 0, route)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, route)
    assert.equal(await page.$$eval('.article-facts', blocks => blocks.some(el => /\*\*[^\n]+\*\*/.test(el.innerText))), false, 'No unparsed fact markup: ' + route)
    const toc = await page.$('.article-contents')
    if (toc) {
      await page.click('.article-contents summary')
      assert.equal(await page.$eval('.article-contents', el => el.open), true)
      assert.equal(await page.$$eval('.article-contents a', links => links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))), true, 'TOC targets: ' + route)
      await page.$eval('.article-contents a', el => el.click())
      await page.waitForFunction(() => location.hash && !document.documentElement.dataset.routeTransition)
      await new Promise(resolve => setTimeout(resolve, 700))
      await page.$eval('.article-contents', el => { el.open = false })
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    }
    const images = await page.$$('.mag-article__body img')
    if (images.length) {
      assert.equal(await page.$eval('.mag-article__body img', el => el.loading), 'eager', route)
      assert.equal(await page.$$eval('.mag-article__body img[decoding="async"]', elements => elements.every(el => el.hasAttribute('width') && el.hasAttribute('height'))), true, route)
      await page.$$eval('.mag-article__body img', images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
    }
    await page.screenshot({ path: `${output}/${name}-desktop.png` })
    if (images.length) {
      await page.$eval('.mag-article__body img', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.screenshot({ path: `${output}/${name}-media.png` })
    }
    for (const width of [390, 320]) {
      await page.setViewport({ width, height: 844 })
      await page.evaluate(width => { document.documentElement.classList.toggle('dark', width === 320); scrollTo({ top: 0, behavior: 'instant' }) }, width)
      await new Promise(resolve => setTimeout(resolve, 350))
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${route} at ${width}px`)
      await page.screenshot({ path: `${output}/${name}-${width}.png` })
      if (width === 320 && images.length) {
        await page.$eval('.mag-article__body img', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
        await page.screenshot({ path: `${output}/${name}-mobile-media.png` })
      }
    }
    await page.evaluate(() => document.documentElement.classList.remove('dark'))
    for (const href of await page.$$eval('.mag-article__footer a', links => links.map(link => link.href))) assert.equal((await fetch(href)).status, 200, href)
    console.log(`PASS ${route}: article layout, media, contents, 390/320px and dark mode`)
  }
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(base + '/activities/240407-maic-and-vision-pro/', { waitUntil: 'networkidle0' })
  await page.$eval('.mag-modal > button', button => button.click())
  await page.waitForSelector('dialog[open]')
  assert.equal(await page.$eval('dialog', el => el.scrollWidth > el.clientWidth + 1), false)
  await page.keyboard.press('Escape')
  assert.equal(await page.$eval('dialog', el => el.open), false)
  await page.goto(base + '/activities/260209-winter-swift/second', { waitUntil: 'networkidle0' })
  await page.$eval('.language-swift .copy', button => button.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click('.language-swift .copy')
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes('struct Resolution'))
  const pre = await page.$eval('.language-swift pre', el => ({ scroll: el.scrollWidth, width: el.clientWidth }))
  assert(pre.scroll > pre.width, 'Long code remains horizontally scrollable')
  await page.$eval('.mag-article img', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click('.mag-article img')
  await page.waitForSelector('.medium-zoom-image--opened')
  await page.keyboard.press('Escape')
  await page.setJavaScriptEnabled(false)
  for (const { route } of articles) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' })
    assert(await page.$('.mag-article__body h2'), route + ' SSR sections')
    assert.equal(await page.$eval('.mag-article__body', el => getComputedStyle(el).opacity), '1', route)
  }
  assert.deepEqual(errors, [])
  console.log(`PASS ${articles.length} articles without JavaScript; modal, code copy and scrolling, image zoom`)
  console.log(`Screenshots: ${output}`)
} finally { await browser.close() }
