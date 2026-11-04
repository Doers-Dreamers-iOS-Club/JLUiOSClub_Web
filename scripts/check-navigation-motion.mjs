import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4174'
const out = '/private/tmp/club-navigation-qa'
await fs.mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
const errors = [], requests = []
page.on('pageerror', e => errors.push(e.message))
page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
page.on('request', r => requests.push(r.url()))
const wait = ms => new Promise(r => setTimeout(r, ms))
const group = '.VPNavBarMenuGroup.club-flyout'
const button = group + ' > button'
const menu = group + ' > .menu'
const checkBounds = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow')
try {
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + '/#start', { waitUntil: 'networkidle0' })
  await page.waitForSelector(group + '.is-ready')
  await page.waitForSelector('.gooey-search[data-ready="true"]')
  assert(!requests.some(url => /searchContent\./.test(url)), 'Search engine must stay lazy')
  await page.hover(button); await wait(180)
  assert.equal(await page.$eval(button, e => e.getAttribute('aria-expanded')), 'true')
  await page.screenshot({ path: out + '/dropdown-opening.png' })
  await wait(1000)
  await page.screenshot({ path: out + '/dropdown-open.png' })
  const firstLink = await page.$(menu + ' a')
  await firstLink.hover(); await wait(150)
  assert.equal(await page.$eval(button, e => e.getAttribute('aria-expanded')), 'true', 'Menu remains open across pointer gap')
  for (let i = 0; i < 3; i++) { await page.mouse.move(700, 180); await wait(70); await page.hover(button); await wait(70) }
  await page.mouse.move(700, 180); await page.waitForFunction(selector => { const el = document.querySelector(selector); return el.inert && getComputedStyle(el).visibility === 'hidden' }, { timeout: 2000 }, menu)
  const closed = await page.$eval(menu, e => ({ inert:e.inert, visibility:getComputedStyle(e).visibility, style:e.getAttribute('style'), expanded:e.previousElementSibling.getAttribute('aria-expanded'), active:document.activeElement.outerHTML.slice(0,100) })); assert(closed.inert && closed.visibility === 'hidden', JSON.stringify(closed))
  await page.focus(button); await page.keyboard.press('ArrowDown'); await wait(100)
  assert(await page.$eval(menu, e => e.contains(document.activeElement)), 'ArrowDown focuses first menu link')
  await page.keyboard.press('Escape'); await wait(500)
  assert(await page.$eval(button, e => document.activeElement === e && e.getAttribute('aria-expanded') === 'false'))
  console.log('PASS dropdown elastic open, interruption, pointer gap, keyboard and Escape')

  await page.mouse.move(700, 180)
  await page.hover('.club-path'); await wait(900)
  const roll = await page.$eval('.club-path .roll-track', e => ({ y: new DOMMatrix(getComputedStyle(e).transform).m42, height: e.getBoundingClientRect().height, shadow: getComputedStyle(e).textShadow }))
  assert(Math.abs(roll.y + roll.height) < 1, 'Each glyph rolls up one full line')
  assert(roll.shadow.includes('rgb(0, 113, 227)') || roll.shadow.includes('rgb(41, 151, 255)'), 'Rolling duplicate uses blue accent')
  await page.screenshot({ path: out + '/home-link-blue.png' })
  await page.mouse.move(700, 180); await wait(900)
  assert(await page.$eval('.club-path .roll-track', e => Math.abs(new DOMMatrix(getComputedStyle(e).transform).m42) < .01))
  console.log('PASS per-character blue roll and hover restoration')

  await page.click('.gooey-trigger'); await wait(1000)
  assert(await page.$eval('.gooey-field input', e => document.activeElement === e))
  await page.type('.gooey-field input', 'Swift')
  await page.waitForSelector('.gooey-result'); await wait(1500)
  assert(requests.some(url => /searchContent\./.test(url)), 'Search loads its real index on demand')
  assert(await page.$eval('.gooey-result', e => e.getAttribute('href').startsWith('/')))
  await page.screenshot({ path: out + '/search-results.png' })
  await page.keyboard.press('ArrowDown')
  assert.equal(await page.$eval('.gooey-field input', e => e.getAttribute('aria-activedescendant')), 'club-search-result-0')
  await page.keyboard.press('Escape'); await wait(650)
  assert(await page.$eval('.gooey-trigger', e => document.activeElement === e && e.getAttribute('aria-expanded') === 'false'))
  await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control'); await wait(1200)
  assert(await page.$eval('.gooey-field input', e => document.activeElement === e))
  await page.$eval('.gooey-field input', e => { e.value = 'nonexistentzzzz987'; e.dispatchEvent(new Event('input', { bubbles: true })) })
  await page.waitForFunction(() => document.querySelector('.gooey-feedback').textContent.includes('没有找到'))
  await page.mouse.click(700, 180); await wait(650)
  assert.equal(await page.$eval('.gooey-trigger', e => e.getAttribute('aria-expanded')), 'false')
  console.log('PASS real lazy search, result links, keyboard shortcut, selection, empty state and outside dismissal')

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.hover(button); await wait(50)
  assert.equal(await page.$eval(menu, e => getComputedStyle(e).opacity), '1')
  await page.mouse.move(700, 180); await wait(150)
  assert.equal(await page.$eval(menu, e => getComputedStyle(e).visibility), 'hidden')
  for (const width of [320, 390, 1024]) {
    await page.setViewport({ width, height: width === 320 ? 568 : 844 })
    await page.goto(base + '/#start', { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await page.waitForSelector('.gooey-search[data-ready="true"]')
    await page.click('.gooey-trigger'); await page.waitForSelector('.gooey-search.is-open'); await page.waitForFunction(() => document.activeElement === document.querySelector('.gooey-field input')); await page.$eval('.gooey-field input', e => { e.value = ''; e.dispatchEvent(new Event('input', { bubbles:true })) }); await page.type('.gooey-field input', 'AI')
    await page.waitForSelector('.gooey-result'); await wait(100)
    await checkBounds()
    assert(await page.$eval('.gooey-panel', e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth }), 'Search panel stays inside viewport')
    await page.screenshot({ path: `${out}/search-${width}-dark-reduced.png` })
    await page.keyboard.press('Escape')
  }
  await page.click('.gooey-trigger'); await page.waitForSelector('.gooey-result')
  const destination = await page.$eval('.gooey-result', e => new URL(e.href).pathname)
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter')
  await page.waitForFunction(path => location.pathname === path, {}, destination)
  assert.equal(await page.$eval('.gooey-trigger', e => e.getAttribute('aria-expanded')), 'false', 'Search selection navigates and closes the panel')
  assert.deepEqual(errors, [])
  console.log('PASS reduced motion, dark theme and 320/390/1024px search bounds; no runtime errors')
} catch (error) {
  await page.screenshot({ path: out + '/failure.png' })
  console.error(await page.evaluate(() => ({ url:location.href, search:document.querySelector('.gooey-search')?.className, query:document.querySelector('.gooey-field input')?.value, feedback:document.querySelector('.gooey-feedback')?.textContent, active:document.activeElement?.outerHTML.slice(0,300) })))
  throw error
} finally { await browser.close() }
