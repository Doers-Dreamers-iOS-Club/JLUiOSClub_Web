import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base = 'http://localhost:4174'
const routes = ['/activities/', ...(process.argv.includes('--all') ? ['/activities/260209-winter-swift/'] : [])]
const out = '/private/tmp/activity-overview-qa'
await fs.mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const settled = state => page.waitForFunction(state => {
  const root = document.querySelector('.activity-journal')
  return root?.dataset.coursePage === state && !root.dataset.coverTransition
}, { timeout: 6000 }, state)
const open = async () => { await page.click('.overview-next'); await settled('content') }
try {
  for (const [index, route] of routes.entries()) {
    await page.setViewport({ width: 1440, height: 1000, isMobile: false, hasTouch: false })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await page.goto(base + route, { waitUntil: 'networkidle0' }); await settled('cover')
    await page.waitForFunction(() => !document.querySelector('.activity-journal').dataset.coverEntrance)
    assert.equal(await page.$eval('.journal-cover', el => el.getBoundingClientRect().bottom), 1000)
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), 1000)
    assert.equal(await page.$('.VPSidebar'), null)
    assert.equal(await page.$eval('[data-art-state]', el => el.dataset.artState), 'waiting')
    await page.screenshot({ path: `${out}/${index}-cover.png` })
    await page.mouse.move(40, 500); await page.mouse.wheel({ deltaY: 100 }); await settled('content')
    assert.notEqual(await page.$eval('[data-art-state]', el => el.dataset.artState), 'complete')
    await page.mouse.wheel({ deltaY: 160 }); await wait(180)
    assert(await page.evaluate(() => scrollY > 50), 'SVG must not block scrolling')
    await page.mouse.wheel({ deltaY: -600 }); await settled('cover')
    assert.equal(await page.evaluate(() => scrollY), 0)
    await open(); await page.waitForSelector('[data-art-state="complete"]')
    await page.screenshot({ path: `${out}/${index}-content.png`, fullPage: true })
    const links = await page.$$eval('.journal-body a', nodes => [...new Set(nodes.map(n => n.getAttribute('href')))])
    const localLinks = links.filter(link => link.startsWith('/') && !link.startsWith('//'))
    for (const href of localLinks) {
      const response = await fetch(base + href)
      assert(response.ok, `Missing destination: ${href}`)
    }
    if (!index) assert.equal(await page.$$eval('.overview-year .journal-chapter', e => e.length), 11)
    else {
      for (const suffix of ['first/', 'second/', 'bonus-ai-programming/']) assert(localLinks.includes(route + suffix))
      for (const domain of ['bilibili.com', 'github.com', 'gitee.com']) assert(links.some(link => link.includes(domain)))
    }
    // The latest archive entry is another overview; first-lesson content retains its sidebar.
    await page.goto(base + '/activities/260209-winter-swift/first/', { waitUntil: 'networkidle0' })
    assert(await page.$('.VPSidebar'))
    await page.goto(base + route + '#activity-content', { waitUntil: 'networkidle0' }); await settled('content')
    await page.keyboard.press('PageUp'); await settled('cover')
    await page.keyboard.press('PageDown'); await settled('content')
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'activity-content')
    for (const width of [320, 390]) {
      await page.setViewport({ width, height: width === 320 ? 650 : 844, isMobile: true, hasTouch: true })
      await page.goto(base + route, { waitUntil: 'networkidle0' }); await settled('cover')
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), width === 320 ? 650 : 844)
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await page.waitForFunction(() => !document.querySelector('.activity-journal').dataset.coverEntrance)
      await wait(300)
      await page.screenshot({ path: `${out}/${index}-${width}-cover.png` })
      await open(); await page.waitForSelector('[data-art-state="complete"]')
      await page.screenshot({ path: `${out}/${index}-${width}-content.png` })
      const client = await page.createCDPSession()
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 160, y: 180 }] })
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 160, y: 320 }] })
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await settled('cover'); await client.detach()
    }
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await open()
    assert.equal(await page.$('[data-art-state]'), null)
    assert.equal(await page.$eval('.journal-cover', e => e.style.transform), '')
    await page.setViewport({ width: 844, height: 390, isMobile: false, hasTouch: false })
    await page.goto(base + route, { waitUntil: 'networkidle0' })
    assert.equal(await page.$eval('.activity-journal', el => el.dataset.coursePage), undefined)
    await page.mouse.move(500, 300); await page.mouse.wheel({ deltaY: 250 }); await wait(150)
    assert(await page.evaluate(() => scrollY > 0))
    console.log('PASS', route, 'cover/content, non-blocking SVG, full link inventory, sidebars, keyboard/touch, dark/mobile/reduced-motion/short-screen')
  }
  assert.deepEqual(errors, [])
} catch (error) {
  await page.screenshot({ path: out + '/failure.png' })
  console.error(await page.evaluate(() => ({ url: location.href, state: document.querySelector('.activity-journal')?.dataset, scrollY, height: document.documentElement.scrollHeight })))
  throw error
} finally { await browser.close() }
