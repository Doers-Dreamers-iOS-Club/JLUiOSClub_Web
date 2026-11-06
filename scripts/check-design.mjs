import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4173'
const out = process.env.QA_OUT || '/private/tmp/club-design-qa'
await fs.mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', message => {
  const source = message.location().url
  if (message.type() === 'error' && source?.startsWith(base)) errors.push(message.text())
})
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`) })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function go(route) { await page.goto(base + route, { waitUntil: 'networkidle0' }); await delay(850); await page.waitForFunction(() => !document.querySelector('.club-home.is-intro')); }
async function scrollPage() {
  if (await page.$('.club-pager')) {
    for (const label of ['学习', '活动', '加入']) {
      await page.click(`.club-pager [aria-label="${label}"]`)
      await page.waitForFunction(() => !document.querySelector('.club-home').classList.contains('is-changing'))
    }
    return
  }
  if (await page.$('[data-course-page="cover"]')) {
    await page.click('.journal-cover__next')
    await page.waitForFunction(() => !document.querySelector('[data-cover-transition]'))
  }
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .75) {
      scrollTo({ top: y, behavior: 'instant' }); await new Promise(resolve => setTimeout(resolve, 90))
    }
    scrollTo({ top: 0, behavior: 'instant' })
  }); await delay(700)
}
async function check(label) {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    tiny: [...document.querySelectorAll('.VPContent *')].filter(e => e instanceof HTMLElement && !e.closest('[inert],[aria-hidden="true"]') && e.getClientRects().length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 11).map(e => e.className),
    hidden: [...document.querySelectorAll('[data-mag-enter],[data-mag-reveal],[data-mag-stagger] > *')].filter(e => !e.closest('[inert]') && (getComputedStyle(e).visibility === 'hidden' || Number(getComputedStyle(e).opacity) < .99)).length
  }))
  assert(!result.overflow, label + ': horizontal overflow')
  assert.deepEqual(result.tiny, [], label + ': text smaller than 11px')
  assert.equal(result.hidden, 0, label + ': hidden reveal content')
}
try {
  const routes = [['home','/'],['archive','/activities/'],['resources','/resources/'],['course','/resources/ai-programming/'],['lesson','/resources/ai-programming/chapters/02'],['detail','/activities/260209-winter-swift/'],['about','/about-us/'],['join','/join-us/']]
  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
  for (const [name, route] of routes) {
    await go(route); await scrollPage(); await check(name)
    await page.screenshot({ path: path.join(out, name + '-desktop.png'), fullPage: ['home','course'].includes(name) })
    console.log('PASS desktop '+name)
  }
  await go('/news/')
  await page.click('.mag-archive__toggle button:nth-child(2)')
  await page.waitForSelector('.mag-archive__grid')
  await page.screenshot({path:path.join(out,'archive-grid.png')})
  await page.reload({waitUntil:'networkidle0'})
  assert(await page.$('.mag-archive__grid'), 'Grid preference was not retained')
  await page.click('.mag-archive__toggle button:first-child')
  await page.click('.mag-archive__row')
  await page.waitForFunction(() => !document.querySelector('.mag-archive__timeline'))
  await page.goBack({waitUntil:'networkidle0'}); await delay(700); await scrollPage(); await check('history back')
  await go('/')
  await page.click('.club-pager [aria-label="加入"]')
  await page.waitForFunction(() => !document.querySelector('.club-home').classList.contains('is-changing'))
  await page.focus('.club-community a')
  await delay(150)
  assert.equal(await page.$eval('.club-community', e => getComputedStyle(e).opacity), '1', 'Keyboard focus must reveal content')
  await page.click('.club-pager [aria-label="学习"]')
  await page.waitForFunction(() => !document.querySelector('.club-home').classList.contains('is-changing'))
  await page.click('.club-path')
  await page.waitForSelector('.course-journal')
  assert.equal(await page.$('.mag-note--tearing'), null, 'Old tearing transition still runs')
  await page.goBack({waitUntil:'networkidle0'}); await delay(900)
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
  await delay(150); await check('live reduced motion')
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]); await delay(1000); await scrollPage(); await check('live restore motion')
  for (const width of [390,320]) {
    await page.setViewport({width,height:844})
    for (const [name,route] of routes.filter(([name])=>['home','archive','course','lesson'].includes(name))) {
      await go(route); await scrollPage(); await check(name+' '+width)
      await page.screenshot({path:path.join(out,name+'-'+width+'.png'),fullPage:name==='home'})
    }
  }
  await page.setViewport({width:1440,height:1000})
  await page.evaluate(()=>{localStorage.setItem('vitepress-theme-appearance','dark')})
  for (const [name,route] of routes.filter(([name])=>['home','course','lesson'].includes(name))) {
    await go(route); await scrollPage(); await check(name+' dark')
    assert(await page.evaluate(()=>document.documentElement.classList.contains('dark')))
    await page.screenshot({path:path.join(out,name+'-dark.png'),fullPage:name==='home'})
  }
  await page.setViewport({width:390,height:844}); await go('/'); await scrollPage(); await check('mobile dark')
  await page.screenshot({path:path.join(out,'home-mobile-dark.png'),fullPage:true})
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await go('/'); await check('reduced motion load')
  await page.setJavaScriptEnabled(false); await go('/')
  assert((await page.$eval('h1',e=>e.textContent)).includes('从这里开始'))
  assert(await page.$eval('.club-community',e=>getComputedStyle(e).visibility==='visible'),'SSR content hidden')
  assert.deepEqual(errors,[])
  console.log('PASS 8 routes, 320/390px layouts, light/dark, view persistence, route/history, live reduced motion, SSR readability, font minimum and console checks')
  console.log('Screenshots: '+out)
} finally { await browser.close() }
