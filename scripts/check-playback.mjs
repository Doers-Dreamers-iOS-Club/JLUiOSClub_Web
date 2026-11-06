import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4175'
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
await page.setViewport({ width: 1440, height: 1000 })
await page.evaluateOnNewDocument(() => {
  const start = window.setInterval
  const stop = window.clearInterval
  window.__intervals = new Map()
  window.setInterval = (callback, delay, ...args) => {
    const id = start(callback, delay, ...args)
    window.__intervals.set(id, delay)
    return id
  }
  window.clearInterval = id => { window.__intervals.delete(id); stop(id) }
  const scroll = Element.prototype.scrollTo
  Element.prototype.scrollTo = function (options, ...args) {
    if (this.classList.contains('mag-carousel__track')) window.__carouselScroll = options.behavior
    return scroll.call(this, options, ...args)
  }
})
const timerCount = (delay, count) => page.waitForFunction(({ delay, count }) =>
  [...window.__intervals.values()].filter(value => value === delay).length === count,
{ timeout: 5000 }, { delay, count })
const center = selector => page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
const hidden = value => page.evaluate(value => {
  Object.defineProperty(document, 'hidden', { configurable: true, value })
  document.dispatchEvent(new Event('visibilitychange'))
}, value)
const reduced = value => page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: value ? 'reduce' : 'no-preference' }])
async function visibleFraction(selector, fraction) {
  await page.$eval(selector, (element, fraction) => {
    const bounds = element.getBoundingClientRect()
    window.scrollBy({ top: bounds.top + bounds.height * (1 - fraction), behavior: 'instant' })
  }, fraction)
}
async function leaveRoute(selector, delay) {
  await page.$eval('.VPNavBarTitle a', link => link.click())
  await page.waitForFunction(selector => !document.querySelector(selector), {}, selector)
  await timerCount(delay, 0)
}
try {
  await page.goto(base + '/news/an-nuo-xi/', { waitUntil: 'networkidle0' })
  await center('.mag-carousel')
  await page.mouse.move(1, 500)
  await timerCount(4000, 1)
  await page.waitForFunction(() => document.querySelectorAll('.mag-carousel__dot')[1].classList.contains('mag-carousel__dot--active'), { timeout: 6500 })
  await hidden(true)
  await timerCount(4000, 0)
  await hidden(false)
  await timerCount(4000, 1)
  await page.hover('.mag-carousel')
  await timerCount(4000, 0)
  await page.mouse.move(1, 500)
  await timerCount(4000, 1)
  await page.focus('.mag-carousel__arrow--next')
  await timerCount(4000, 0)
  await page.focus('.mag-carousel__arrow--prev')
  await timerCount(4000, 0)
  await page.evaluate(() => document.activeElement.blur())
  await timerCount(4000, 1)
  await visibleFraction('.mag-carousel__track', .2)
  await timerCount(4000, 0)
  await page.$eval('.mag-carousel', element => {
    element.dispatchEvent(new MouseEvent('mouseenter'))
    element.dispatchEvent(new MouseEvent('mouseleave'))
  })
  await timerCount(4000, 0)
  await center('.mag-carousel')
  await timerCount(4000, 1)
  await reduced(true)
  await timerCount(4000, 0)
  await page.$eval('.mag-carousel__arrow--next', button => button.click())
  assert.equal(await page.evaluate(() => window.__carouselScroll), 'instant', 'Manual carousel navigation respects the live preference')
  await reduced(false)
  await timerCount(4000, 1)
  await leaveRoute('.mag-carousel', 4000)
  console.log('PASS carousel: actual advance; hidden, hover, focus, threshold, live reduced motion, manual scroll and route cleanup')

  await page.goto(base + '/resources/ai-programming/chapters/04', { waitUntil: 'networkidle0' })
  await center('.timer-microscope')
  await timerCount(750, 1)
  await page.waitForFunction(() => Number(document.querySelector('.timer-microscope').dataset.demoFrame) > 0)
  await page.$eval('.timer-microscope .lab-playback', button => button.click())
  await timerCount(750, 0)
  const paused = await page.$eval('.timer-microscope', element => element.dataset.demoFrame)
  await hidden(true)
  await hidden(false)
  await timerCount(750, 0)
  assert.equal(await page.$eval('.timer-microscope', element => element.dataset.demoFrame), paused)
  await reduced(true)
  await page.waitForFunction(() => document.querySelector('.timer-microscope').dataset.demoFrame === '7')
  await timerCount(750, 0)
  await reduced(false)
  await page.waitForFunction(() => document.querySelector('.timer-microscope').dataset.demoFrame === '0')
  await timerCount(750, 0)
  await page.$eval('.timer-microscope .lab-playback', button => button.click())
  await timerCount(750, 1)
  await hidden(true)
  await timerCount(750, 0)
  await hidden(false)
  await timerCount(750, 1)
  await visibleFraction('.timer-microscope', .1)
  await timerCount(750, 0)
  await center('.timer-microscope')
  await timerCount(750, 1)
  await leaveRoute('.timer-microscope', 750)
  console.log('PASS lab: user pause retained; static frame and reset; hidden, threshold, resume and route cleanup')
  assert.deepEqual(errors, [])
} finally { await browser.close() }
