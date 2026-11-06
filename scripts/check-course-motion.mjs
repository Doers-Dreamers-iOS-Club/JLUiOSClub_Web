import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4174'
const output = process.env.QA_OUT || '/private/tmp/club-course-motion-qa'
await fs.mkdir(output, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(response.url()) })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const path = '/resources/ai-programming/'
const stage = index => `.art-stage:nth-of-type(${index + 1})`
async function show(selector) {
  await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
}
async function complete(index) {
  await page.waitForFunction(selector => document.querySelector(selector)?.dataset.motionState === 'complete', { timeout: 7000 }, stage(index))
}
async function playing(index) {
  await page.waitForFunction(selector => document.querySelector(selector)?.dataset.motionState === 'playing', { timeout: 5000 }, stage(index))
}
async function state(index) { return page.$eval(stage(index), element => element.dataset.motionState) }
async function frame(index) { return page.$eval(stage(index), element => [...element.querySelectorAll('[style]')].map(node => node.getAttribute('style')).join('|')) }
try {
  await page.setViewport({ width: 1440, height: 600 })
  await page.goto(base + path, { waitUntil: 'networkidle0' })
  assert.equal(await state(0), 'waiting')
  await page.click('.journal-cover__next')
  await page.waitForFunction(() => document.querySelector('.course-journal').dataset.coursePage === 'content' && !document.querySelector('.course-journal').dataset.coverTransition)
  await show('.course-art'); await playing(0)
  await (await page.$('.course-art')).screenshot({ path: output + '/drawing.png' })
  await Promise.all([complete(0), complete(1), complete(2)])
  assert.equal(await page.$eval('.art-snake', e => Number.parseFloat(getComputedStyle(e).strokeDashoffset)), 0)
  assert.equal(await page.$eval('.art-apple', e => e.style.transform), '', 'Apple returns to its original SVG coordinates')
  await (await page.$('.course-art')).screenshot({ path: output + '/complete.png' })
  console.log('PASS desktop sketch, code, play button and snake complete')

  await page.waitForSelector('.journal-chapter[style]')
  await page.$eval('.journal-chapter[style]', e => scrollTo({ top: scrollY + e.getBoundingClientRect().top - innerHeight * .67, behavior: 'instant' }))
  await wait(30)
  const first = await page.$eval('.journal-chapter[style]', e => Number(getComputedStyle(e).opacity))
  await wait(800)
  const settled = await page.$eval('.journal-chapter[style]', e => Number(getComputedStyle(e).opacity))
  assert(settled > first && settled > .99, `Damping should settle: ${first} -> ${settled}`)
  console.log('PASS native scrolling with damped content movement')

  await page.setViewport({ width: 390, height: 500 })
  await page.goto(base + path, { waitUntil: 'networkidle0' })
  await show(stage(0)); await complete(0)
  assert.equal(await state(1), 'waiting', 'Mobile code waits for its own viewport')
  await show(stage(1)); await playing(1)
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await wait(150)
  const paused = await frame(1); await wait(400); assert.equal(await frame(1), paused)
  await show(stage(1)); await complete(1)
  await show(stage(2)); await playing(2)
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
  const background = await frame(2); await wait(400); assert.equal(await frame(2), background)
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')) }); await complete(2)
  console.log('PASS independent mobile panels, offscreen pause and background resume')

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); await wait(150)
  assert.equal(await page.$$eval('[data-motion-state]', elements => elements.length), 0)
  assert.equal(await page.$eval('.art-snake', e => Number.parseFloat(getComputedStyle(e).strokeDashoffset)), 0)
  assert.equal(await page.$eval('.journal-chapter', e => getComputedStyle(e).opacity), '1')
  assert.equal(await page.$eval('.art-pen-motion', e => e.style.transform), '')
  console.log('PASS live reduced-motion switch restores complete artwork and readable content')

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.waitForSelector('.journal-chapter[style]')
  await page.evaluate(() => { window.__oldJournal = document.querySelector('.course-journal') })
  await page.focus('.journal-chapter'); await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).opacity), '1')
  await page.keyboard.press('Enter'); await page.waitForSelector('.ai-course-article')
  assert.equal(await page.evaluate(() => window.__oldJournal.querySelectorAll('[data-motion-state]').length), 0)
  assert.equal(await page.evaluate(() => window.__oldJournal.querySelector('.journal-chapter').style.transform), '')
  await page.goBack(); await page.waitForSelector('.course-journal'); await page.waitForSelector('[data-motion-state]')
  console.log('PASS keyboard navigation, route cleanup and fresh animations on return')

  await page.setJavaScriptEnabled(false); await page.goto(base + path, { waitUntil: 'networkidle0' })
  assert.equal(await page.$$eval('.art-stage svg', elements => elements.length), 3)
  assert.equal(await page.$eval('.art-snake', e => Number.parseFloat(getComputedStyle(e).strokeDashoffset)), 0)
  assert.equal(await page.$$eval('.course-spot', elements => elements.length), 5)
  assert.deepEqual(errors, [])
  console.log('PASS complete SSR illustrations without JavaScript and no browser errors')
} finally { await browser.close() }
