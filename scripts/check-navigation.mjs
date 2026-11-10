import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4175'
const output = '/private/tmp/club-navigation'
await mkdir(output, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(`${page.url()}\n${error.stack ?? error.message}`))
page.on('response', response => {
  if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
})
const course = '/resources/ai-programming/'
const winter = '/activities/260209-winter-swift/'
const go = path => page.goto(base + path, { waitUntil: 'networkidle0' })
const idle = () => page.waitForFunction(() => !document.documentElement.dataset.routeTransition)
const click = selector => page.$eval(selector, element => element.click())
const href = selector => page.$eval(selector, element => element.getAttribute('href'))
const activeNav = () => page.$$eval('.VPNavBarMenu > .active', elements => elements.map(element => (element.querySelector('.button .text') ?? element).textContent.trim()))

try {
  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await go(course + 'chapters/02')
  assert.deepEqual(await activeNav(), ['学习中心'])
  assert.equal(await href('.mag-article__previous'), course + 'chapters/01')
  assert.equal(await href('.mag-article__next'), course + 'chapters/03')
  assert.equal(await href('.mag-article__index'), course + '#course-content')
  assert.equal(await href('.reading-tools a'), course + '#course-content')

  for (const width of [1440, 1024, 960, 390, 320]) {
    await page.setViewport({ width, height: 1000 })
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForSelector('.VPLocalNavOutlineDropdown > button', { visible: true })
    await page.click('.VPLocalNavOutlineDropdown > button')
    await page.waitForSelector('.VPLocalNavOutlineDropdown .outline-link', { visible: true })
    assert(await page.$$eval('.VPLocalNavOutlineDropdown .outline-link', links => links.length > 0 && links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))))
    await click('.VPLocalNavOutlineDropdown .outline-link')
    await page.waitForFunction(() => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      const localNav = document.querySelector('.VPLocalNav').getBoundingClientRect()
      return target && target.getBoundingClientRect().top >= localNav.bottom - 2 && target.getBoundingClientRect().top < innerHeight
    })
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `No overflow at ${width}px`)
    if (width === 320) {
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await page.screenshot({ path: output + '/chapter-mobile-dark.png' })
      await page.evaluate(() => document.documentElement.classList.remove('dark'))
      assert.equal(await page.$eval('.VPLocalNav .menu-text', element => element.textContent.trim()), '课程章节')
      await page.click('.VPLocalNav .menu')
      await page.waitForSelector('.VPSidebar.open', { visible: true })
      await click('.contents-index')
      await page.waitForSelector('.course-journal[data-course-page="content"]', { visible: true })
      assert.equal(new URL(page.url()).hash, '#course-content')
      await go(course + 'chapters/02')
    }
  }
  await page.setViewport({ width: 1440, height: 1000 })
  await go(course + 'chapters/02')
  await page.screenshot({ path: output + '/chapter-desktop.png' })
  await page.click('.article-sidebar-toggle')
  await page.$eval('.mag-article__body h2', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await page.waitForSelector('.mag-article__outline-panel[data-state="visible"]', { visible: true })
  await page.screenshot({ path: output + '/chapter-outline.png' })
  await click('.reading-tools a')
  await page.waitForSelector('.course-journal[data-course-page="content"]', { visible: true })
  console.log('PASS page outline with expanded/collapsed sidebar, mobile drawer, anchors, chapter links and directory returns')

  await page.evaluate(() => localStorage.setItem('jlu-ai-programming-reading-v1', JSON.stringify({ completed: ['01', '02'], last: '03' })))
  await go(course)
  assert.equal(await href('.journal-start'), course + 'chapters/03')
  assert.match(await page.$eval('.journal-start', element => element.textContent), /继续学习/)
  await click('.journal-start')
  await page.waitForSelector('.reading-tools button', { visible: true })
  await page.click('.reading-tools button')
  await go(course)
  assert.equal(await href('.journal-start'), course + 'chapters/04')
  await page.evaluate(() => localStorage.setItem('jlu-ai-programming-reading-v1', '{invalid'))
  await go(course)
  assert.equal(await href('.journal-start'), course + 'chapters/01')
  await page.screenshot({ path: output + '/course-cover.png' })
  console.log('PASS resume, completed-chapter progression and corrupted-storage fallback without adding progress UI')

  await go(winter + 'second')
  assert.deepEqual(await activeNav(), ['学习中心'])
  assert.equal(await href('.mag-article__previous'), winter + 'first')
  assert.equal(await href('.mag-article__index'), winter + '#activity-content')
  assert.equal(await href('.contents-index'), winter + '#activity-content')
  await click('.mag-article__index')
  await page.waitForSelector('[data-course-page="content"]', { visible: true })
  assert.equal(new URL(page.url()).hash, '#activity-content')
  assert.equal(await href('.overview-list a'), winter + 'first')
  await go('/activities/251018-vibe-coding/')
  assert.deepEqual(await activeNav(), ['学习中心'])
  await click('a[href="/join-us/#成为普通社员"]')
  await page.waitForSelector('.dual-qr')
  await idle()
  const headings = await page.$$eval('.vp-doc h2', elements => elements.map(element => element.textContent))
  assert(headings.findIndex(text => text.includes('成为普通社员')) < headings.findIndex(text => text.includes('组织架构')))
  await page.screenshot({ path: output + '/join-desktop.png' })
  await go('/resources/#swift-学习资源')
  await page.waitForFunction(() => {
    const top = document.getElementById('swift-学习资源').getBoundingClientRect().top
    return top >= 60 && top < innerHeight
  })
  console.log('PASS Winter series returns, help destination, joining order and legacy resource anchor')

  await go('/activities/#activity-content')
  assert.deepEqual(await activeNav(), ['活动与动态'])
  await page.$eval('.overview-year:last-of-type', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
  const savedScroll = await page.evaluate(() => scrollY)
  const activityLink = '.overview-year:last-of-type a'
  await click(activityLink)
  await page.waitForSelector('.mag-article')
  await page.goBack()
  await page.waitForSelector('[data-course-page="content"]')
  await idle()
  await page.waitForFunction(expected => Math.abs(scrollY - expected) < 5, {}, savedScroll)
  await page.goForward()
  await page.waitForSelector('.mag-article')
  await idle()
  console.log('PASS activity list back/forward restores content view and scroll position')

  await go('/about-us/')
  await page.evaluate(() => { const link = document.createElement('a'); link.href = '/questions/test'; document.body.append(link); link.click() })
  await page.waitForFunction(() => location.pathname === '/questions/' && document.querySelector('a[href="https://ks.wjx.top/vm/mbkrxvr.aspx#"]'))
  await page.goBack()
  await page.waitForFunction(() => location.pathname === '/about-us/')
  await idle()
  await page.evaluate(() => { const link = document.createElement('a'); link.href = '/new'; document.body.append(link); link.click() })
  await page.waitForFunction(() => location.pathname.startsWith('/activities/') && document.querySelector('.mag-article'))
  await page.goBack()
  await page.waitForFunction(() => location.pathname === '/about-us/')
  await idle()
  await page.setViewport({ width: 390, height: 844 })
  await page.click('.VPNavBarHamburger')
  await page.waitForSelector('.VPNavScreen', { visible: true })
  assert(await page.$eval('.VPNavScreen', element => ['学习中心', '活动与动态', '竞赛', '关于社团', '加入我们'].every(label => element.textContent.includes(label))))
  await page.screenshot({ path: output + '/mobile-navigation.png' })
  await page.click('.VPNavScreen a[href="/competitions/"]')
  await page.waitForFunction(() => location.pathname === '/competitions/' && !document.querySelector('.VPNavScreen'))
  await idle()
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  // A trailing native outline scroll callback can fire after its page unmounts.
  await page.setViewport({ width: 1440, height: 1000 })
  for (let attempt = 0; attempt < 3; attempt++) {
    await go(course + 'chapters/02')
    await page.evaluate(() => {
      scrollTo(0, 600)
      window.dispatchEvent(new Event('scroll'))
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'))
        document.querySelector('.reading-tools a').click()
      }, 20)
    })
    await page.waitForSelector('.course-journal')
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 200)))
  }
  assert.deepEqual(errors, [])
  console.log('PASS legacy redirects, mobile global navigation, rapid outline disposal, no runtime errors or failed local requests')
} catch (error) {
  console.error('Failed at', page.url())
  await page.screenshot({ path: output + '/failure.png' })
  throw error
} finally {
  await browser.close()
}
