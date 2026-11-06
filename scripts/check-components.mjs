import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4173'
const out = '/private/tmp/club-components-qa'
await mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  const page = await browser.newPage()
  await page.setCacheEnabled(false)
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(base + '/about-us/maintenance/components', { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('.mag-grid .mag-card[href] .mag-card__body', el => el.textContent.trim()), '查看讲义、工具与课程入口。')
  assert.equal(await page.$eval('.mag-note strong', el => el.textContent), '加粗')
  assert.equal(await page.$eval('.mag-figure img', image => image.complete && image.naturalWidth > 0), true)
  await page.$eval('.mag-details summary', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click('.mag-details summary')
  assert(await page.$eval('.mag-details', el => el.open))
  await page.locator('.mag-modal > .mag-btn').click()
  assert(await page.$eval('dialog', el => el.open))
  await page.keyboard.press('Escape')
  assert.equal(await page.$eval('dialog', el => el.open), false)
  assert.equal(await page.$eval('.mag-modal > .mag-btn', el => document.activeElement === el), true)
  await page.locator('.mag-carousel__arrow--next').click()
  await page.waitForFunction(() => document.querySelectorAll('.mag-carousel__dot')[1].classList.contains('mag-carousel__dot--active'))
  assert.equal(await page.$$eval('.mag-carousel__track img', images => images.length), 2)
  await page.screenshot({ path: `${out}/desktop.png`, fullPage: true })
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: `${out}/desktop-top.png` })

  for (const width of [390, 320]) {
    await page.setViewport({ width, height: 844 })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
    assert.equal(overflow, false, `${width}px guide has horizontal overflow`)
    assert.equal(await page.$eval('.mag-grid', el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1)
  }
  await page.screenshot({ path: `${out}/mobile.png`, fullPage: true })
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: `${out}/mobile-top.png` })
  for (const template of ['activity', 'lesson']) {
    const response = await fetch(`${base}/templates/${template}.md`)
    assert.equal(response.status, 200)
    assert((await response.text()).startsWith('---\ntitle:'))
  }

  await page.goto(base + '/competitions/', { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('.mag-archive__year h2', el => el.firstChild.textContent), '2024')
  assert.equal(await page.$$eval('.mag-archive__year', elements => elements.length), 1)
  await page.goto(base + '/news/an-nuo-xi/', { waitUntil: 'networkidle0' })
  const resources = await page.evaluate(() => performance.getEntriesByType('resource')
    .filter(entry => /\.css|\.js|\.woff/.test(entry.name))
    .map(entry => ({ file: entry.name.split('/').pop(), bytes: entry.decodedBodySize })))
  const cssBytes = resources.filter(entry => entry.file.includes('.css')).reduce((sum, entry) => sum + entry.bytes, 0)
  assert(cssBytes < 320000, `CSS budget exceeded: ${cssBytes}`)
  await writeFile(`${out}/resources.json`, JSON.stringify({ cssBytes, resources }, null, 2))

  await page.setJavaScriptEnabled(false)
  await page.goto(base + '/about-us/maintenance/components', { waitUntil: 'networkidle0' })
  await page.$eval('.mag-details summary', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click('.mag-details summary')
  assert(await page.$eval('.mag-details', el => el.open), 'Native details must work without JavaScript')
  assert(await page.$('.mag-card__body strong'), 'SSR must include authored Markdown')
  assert.deepEqual(errors, [])
  console.log('PASS component slots, Markdown, images, dialog focus, carousel, 320/390px, templates, dates and no-JS details')
  console.log(JSON.stringify({ cssBytes, output: out }))
} finally {
  await browser.close()
}
