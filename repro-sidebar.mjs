/* 完整用户路径复现：
   首页 → 撕便签到 winter-swift → 撕 MagCard 到 first/ → 侧边栏导航 */
import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE || 'http://localhost:5174'

const browser = await puppeteer.launch({
  channel: 'chrome',
  headless: true,
  args: ['--window-size=1280,900']
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
page.on('console', (m) => {
  if (m.type() === 'error') console.log('[console.error]', m.text())
})

async function probe(label) {
  const s = await page.evaluate(() => {
    const vp = document.querySelector('.VPContent')
    const doc = document.querySelector('.vp-doc')
    const stuck = [...document.querySelectorAll('.mag-reveal:not(.mag-in)')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight && r.bottom > 0 // 视口内却不显示 = 真 bug
      })
    return {
      url: location.pathname,
      htmlClass: document.documentElement.className,
      vpOpacity: vp ? getComputedStyle(vp).opacity : 'none',
      stuckInViewport: stuck.length,
      ghosts: document.querySelectorAll('body > .mag-note--tearing').length
    }
  })
  console.log(label, JSON.stringify(s))
}

async function settle(ms = 2500) {
  await new Promise((r) => setTimeout(r, ms))
}

// 1. 首页撕便签
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
await settle(1200)
await page.evaluate(() =>
  document.querySelector('.mag-archive__item')?.scrollIntoView({ block: 'center' })
)
await settle(900)
await page.click('.mag-archive__item')
await settle(2600)
await probe('① 便签撕下落地:')

// 2. winter-swift 页撕 MagCard 进第一讲
const cardClicked = await page.evaluate(() => {
  const a = [...document.querySelectorAll('.mag-card--link')].find((el) =>
    (el.getAttribute('href') || '').includes('first')
  )
  if (!a) return false
  a.scrollIntoView({ block: 'center' })
  return true
})
await settle(600)
if (cardClicked) {
  await page.evaluate(() => {
    const a = [...document.querySelectorAll('.mag-card--link')].find((el) =>
      (el.getAttribute('href') || '').includes('first')
    )
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  })
}
console.log('② MagCard 点击:', cardClicked)
await settle(2600)
await probe('② 卡片撕下落地:')

// 3. 在 first/ 页点侧边栏第二讲
const sideClicked = await page.evaluate(() => {
  const a = [...document.querySelectorAll('.VPSidebar a')].find((l) =>
    l.href.includes('second')
  )
  if (!a) return false
  a.click()
  return true
})
console.log('③ 侧边栏点击:', sideClicked)
await settle(2000)
await probe('③ 侧边栏导航后:')

// 4. 快速连点侧边栏（撕下转场进行中打断）
await page.evaluate(() => {
  const a = [...document.querySelectorAll('.VPSidebar a')].find((l) =>
    l.href.includes('260209-winter-swift')
  )
  a?.click()
})
await settle(300) // 打断窗口
await page.evaluate(() => {
  const a = [...document.querySelectorAll('.VPSidebar a')].find((l) =>
    l.href.includes('bonus-ai-programming')
  )
  a?.click()
})
await settle(2500)
await probe('④ 快速连续导航后:')

await page.screenshot({ path: 'shot-final.png' })
await browser.close()
