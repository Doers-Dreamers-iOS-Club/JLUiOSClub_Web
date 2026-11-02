import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || process.env.BASE || 'http://localhost:5175'
const out = process.env.QA_OUT || '/private/tmp/ai-course-illustrations-qa'
await fs.mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,1000'] })
const page = await browser.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text() + ' ' + JSON.stringify(m.location())) })
page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`) })
await page.evaluateOnNewDocument(() => {
  const start = window.setInterval.bind(window), stop = window.clearInterval.bind(window)
  window.__activeIntervals = new Set()
  window.setInterval = (...args) => { const id = start(...args); window.__activeIntervals.add(id); return id }
  window.clearInterval = id => { window.__activeIntervals.delete(id); return stop(id) }
})
const delay = ms => new Promise(r => setTimeout(r, ms))
const root = '/resources/ai-programming/'
async function go(route) { await page.goto(base + route, { waitUntil: 'networkidle0' }); await delay(300) }
async function click(scope, text) {
  for (const b of await page.$$(scope + ' button')) if ((await b.evaluate(e => e.textContent.trim())) === text) { await b.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'})); await delay(100); await b.click(); await delay(100); return }
  throw Error(`Missing button: ${scope} / ${text}`)
}
async function show(selector) { await page.$eval(selector, e => e.scrollIntoView({ block: 'center', behavior: 'instant' })); await delay(400) }
async function text(selector) { return page.$eval(selector, e => e.textContent.trim()) }
async function overflow(label) { assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow: ' + label) }
async function shot(selector,name) { await show(selector); const style = await page.addStyleTag({content: '.VPNav,.VPLocalNav { visibility: hidden !important; }'}); try { await (await page.$(selector)).screenshot({ path: path.join(out,name+'.png') }) } finally { await style.evaluate(el=>el.remove()) } }
async function state(value) { await page.waitForFunction(v => document.querySelector('.pause-anatomy [data-state]')?.textContent === v, {}, value) }
async function position() { return Number(await text('.pause-anatomy [data-position]')) }
async function select(selector, value) { await page.select(selector,value); await delay(100) }
try {
  await page.setViewport({width:1440,height:1000})
  await go(root)
  assert.equal(await page.$$eval('.course-chapter', els=>els.length),6)
  assert.equal(await page.$$eval('.learning-illustration', els=>els.length),0,'Home must not acquire chapter illustrations')

  await go(root+'chapters/01')
  await show('.project-preview')
  assert((await text('.project-preview')).includes('尚未明确'))
  await click('.project-preview','采用讲义第一版约定')
  await click('.project-preview','下一幕')
  assert((await text('.project-preview .lab-observation')).includes('等待玩家'))
  await click('.project-preview','下一幕'); await click('.project-preview','下一幕')
  assert((await text('.project-preview .lab-observation')).includes('这一局结束'))
  await click('.project-preview','下一幕')
  assert((await text('.project-preview .lab-observation')).includes('分数归零'))
  await click('.project-preview','穿过边界')
  for(let i=0;i<3;i++) await click('.project-preview','下一幕')
  assert((await text('.project-preview .lab-observation')).includes('从左侧出现'))
  await shot('.project-preview','project-desktop')
  await show('.recall-quiz'); await page.click('.recall-quiz__choices button:nth-child(1)')
  assert((await text('.recall-quiz__feedback')).includes('正确答案'))
  await click('.recall-quiz','再试一次'); await page.click('.recall-quiz__choices button:nth-child(2)')
  assert((await text('.recall-quiz__feedback')).includes('答对了'))
  await show('.reading-tools'); await click('.reading-tools','标记为已读')
  await go(root); assert((await text('.course-progress')).includes('1 / 6'))
  console.log('PASS project rules, quiz, reading progress')

  await go(root+'chapters/02')
  await show('.context-desk'); await click('.context-desk','3. 补齐规则')
  assert((await text('.context-desk .lab-observation')).includes('实现与规则'))
  await page.evaluate(() => Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}))
  await click('.context-desk','复制这段任务')
  assert(await page.$('.context-desk textarea'))
  await click('.context-desk','重置材料')
  await page.evaluate(() => {
    const card = document.querySelectorAll('.desk-card')[1], tray = document.querySelector('.desk-tray'), dataTransfer = new DataTransfer()
    card.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer}))
    tray.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer,cancelable:true}))
  })
  assert((await text('.context-desk .lab-observation')).includes('当前实现已提供'))
  await shot('.context-desk','context-desktop')
  await show('.prompt-workshop'); await page.click('.prompt-workshop__rounds button:nth-child(2)')
  assert((await text('.prompt-workshop__prompt')).includes('轻松'))
  await click('.prompt-workshop','复制这一轮提示词')
  assert((await text('.prompt-workshop__status')).includes('复制未成功'))

  await go(root+'chapters/03'); await show('.pause-anatomy')
  await state('待开始')
  const baselineIntervals = await page.evaluate(()=>window.__activeIntervals.size)
  await click('.pause-anatomy','开始')
  const runningAnnouncement=await text('.pause-anatomy [role="status"]')
  await delay(900); assert.equal(await text('.pause-anatomy [role="status"]'),runningAnnouncement,'playback must not continuously announce movement')
  await click('.pause-anatomy','暂停'); await state('已暂停')
  const frozen=await position(); assert(frozen>0); await delay(500); assert.equal(await position(),frozen)
  await click('.pause-anatomy','已结束'); await state('已暂停')
  await click('.pause-anatomy','继续'); await delay(500); await click('.pause-anatomy','触发示例结束'); await state('已结束')
  assert(await page.$$eval('.pause-anatomy button',els=>els.find(e=>e.textContent==='继续').disabled))
  await click('.pause-anatomy','重新开始'); await delay(100); await state('运行中')
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'})); await state('已暂停')
  assert.equal(await page.evaluate(()=>window.__activeIntervals.size),baselineIntervals,'offscreen playback timer cleanup')
  await shot('.pause-anatomy','pause-desktop')
  console.log('PASS context, clipboard, pause state machine, offscreen timer cleanup')

  await go(root+'chapters/04'); await show('.timer-microscope')
  await click('.timer-microscope','重开一局'); await click('.timer-microscope','重开一局')
  assert((await text('[data-timer-count]')).includes('3 个'))
  await click('.timer-microscope','推进一拍')
  assert.equal(await text('[data-clean]'),'1'); assert.equal(await text('[data-buggy]'),'3')
  await click('.timer-microscope','清理旧循环'); await click('.timer-microscope','重开一局'); await click('.timer-microscope','推进一拍')
  assert.equal(await text('[data-clean]'),await text('[data-buggy]'))
  await shot('.timer-microscope','timers-desktop')
  await page.evaluate(()=>document.querySelector('.version-book').closest('details').open=true)
  await show('.version-book')
  await select('.version-select label:nth-child(2) select','2')
  await click('.version-book','看后页：暂停版')
  await click('.version-book','代码'); assert((await text('.code-comparison')).includes('togglePause'))
  await select('.version-select label:nth-child(1) select','2')
  assert.equal(await page.$$eval('.version-book .code-added,.version-book .code-removed',els=>els.length),0,'same versions have no diffs')
  await select('.version-select label:nth-child(1) select','1')
  await click('.version-book','连接暂停 / 继续控件')
  assert.equal(await page.$$eval('.version-book .code-added',els=>els.length),1)
  assert.equal(await page.$$eval('.version-book .target-changed',els=>els.length),1)
  await shot('.version-book','version-code-desktop')
  await click('.version-book','模拟恢复为暂停版')
  assert((await text('.version-book .lab-observation')).includes('当前示意工作区：暂停版'))
  await shot('.version-book','versions-desktop')

  await go(root+'chapters/05'); await show('.skill-recipe')
  await page.click('.recipe-cards .recipe-card:first-child'); await page.click('.recipe-folder:nth-child(3) .folder-title')
  assert((await text('.skill-recipe .lab-observation')).includes('更适合'))
  await click('.skill-recipe','看整理好的示例'); assert((await text('.recipe-bottom')).includes('6 / 6'))
  await click('.skill-recipe','换成打砖块项目'); assert((await text('.skill-recipe .lab-observation')).includes('方法仍然适用'))
  assert((await text('.project-check')).includes('打砖块'))
  await shot('.skill-recipe','skill-desktop')
  console.log('PASS timer fault/repair, version comparison/restore, Skill classification')

  await go(root+'chapters/06'); await show('.mcp-workbench')
  await click('.mcp-workbench','下一步'); await click('.mcp-workbench','下一步')
  assert((await text('.mcp-workbench [data-result]')).includes('服务未连接'))
  await click('.mcp-workbench','网页未启动'); for(let i=0;i<4;i++)await click('.mcp-workbench','下一步')
  assert((await text('.mcp-workbench [data-result]')).includes('工具连接正常'))
  await click('.mcp-workbench','全部就绪'); await click('.mcp-workbench','执行检查')
  await page.waitForFunction(()=>document.querySelector('.mcp-workbench [data-result]').textContent.includes('检查完成'),{timeout:10000})
  await shot('.mcp-workbench','mcp-desktop')

  await go(root+'chapters/api-setup'); await show('.api-envelope')
  await select('.api-presets select','auth'); await click('.api-envelope','下一步'); await click('.api-envelope','下一步')
  assert((await text('.api-envelope [data-result]')).includes('认证示例失败'))
  await select('.api-presets select','model'); for(let i=0;i<3;i++)await click('.api-envelope','下一步')
  assert((await text('.api-envelope [data-result]')).includes('模型示例失败'))
  await select('.api-presets select','ok'); await click('.api-envelope','完整展示')
  for(let i=0;i<4;i++)await click('.api-envelope','下一步')
  assert.equal(await text('[data-response]'),'API 是程序交换信息的接口。')
  await click('.api-envelope','下一步'); assert((await text('[data-response]')).includes('客户端组织请求'))
  await click('.api-envelope','分段展示'); await click('.api-envelope','完整展示')
  assert.equal(await text('[data-response]'),'API 是程序交换信息的接口。')
  await click('.api-envelope','显示下一段响应')
  assert((await text('[data-response]')).includes('客户端组织请求'))
  await shot('.api-envelope','api-desktop')
  console.log('PASS MCP failures and success playback, API failure paths and segmented response')

  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
  await page.setViewport({width:320,height:820})
  const mobileScenes=[['01','project-preview'],['02','context-desk'],['03','pause-anatomy'],['04','timer-microscope'],['05','skill-recipe'],['06','mcp-workbench'],['api-setup','api-envelope']]
  for(const [chapter,scene] of mobileScenes) {
    await go(root+'chapters/'+chapter); await show('.'+scene); await overflow(scene)
    await page.evaluate(()=>document.documentElement.classList.add('dark'))
    await shot('.'+scene,scene+'-mobile-dark')
    if(chapter==='03') {
      await click('.pause-anatomy','开始'); await state('运行中')
      const pos=await position(); await delay(500); assert.equal(await position(),pos)
      await click('.pause-anatomy','移动一步'); assert.equal(await position(),pos+1)
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]); await state('已暂停')
      const afterPreference=await position(); await delay(500); assert.equal(await position(),afterPreference)
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
    }
  }
  await go(root+'chapters/04'); await page.evaluate(()=>document.querySelector('.version-book').closest('details').open=true); await show('.version-book'); await overflow('version-book mobile')
  await shot('.version-book','versions-mobile')
  await go(root+'read-all'); assert.equal(await page.$$eval('.learning-illustration',els=>els.length),10); await overflow('read-all')
  const ids=await page.$$eval('[id]',els=>els.map(e=>e.id)); assert.equal(new Set(ids).size,ids.length,'duplicate IDs in continuous reading')
  await go(root+'materials/'); await overflow('materials')
  const downloads=await page.$$eval('.vp-doc a[download]',els=>els.map(e=>e.getAttribute('href')))
  for(const href of new Set(downloads)) {
    const response=await fetch(base+href);assert.equal(response.status,200,href)
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),await fs.readFile(path.join('docs/public',decodeURIComponent(href))),href)
  }
  assert.deepEqual(errors,[])
  console.log('PASS 320px layouts, dark mode, reduced motion, continuous reading, downloads and console checks')
  console.log('Screenshots: '+out)
} catch(error) { await page.screenshot({path:path.join(out,'failure.png')}); console.log('Failed at',page.url()); throw error } finally { await browser.close() }
