import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4175'
const root = '/about-us/maintenance/'
const out = '/private/tmp/club-maintenance-qa'
await mkdir(out, { recursive: true })
const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const examples = ['project', 'context', 'pause', 'timers', 'versions', 'skill', 'mcp', 'api', 'observe', 'feedback', 'course', 'activities', 'swift', 'roll-text']
const errors = []
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'warn' && /Failed to resolve component/.test(message.text())) errors.push(message.text())
  })
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await browser.defaultBrowserContext().overridePermissions(base, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'])
  await page.goto(base + root, { waitUntil: 'networkidle0' })
  const navGroup = await page.$eval(`.VPNavBar a[href="${root}"]`, el => el.closest('.VPFlyout').querySelector('.button').textContent)
  assert(navGroup.includes('关于我们'))
  assert.equal(await page.$$eval('.VPSidebar a[href^="/about-us/maintenance/"]', links => links.length), 4)
  for (const filename of ['activity', 'lesson']) {
    assert.equal((await fetch(`${base}/templates/${filename}.md`)).status, 200)
  }
  await page.screenshot({ path: `${out}/overview-desktop.png` })
  await page.goto(base + root + 'animations', { waitUntil: 'networkidle0' })
  assert.equal(await page.$$eval('.animation-gallery option', options => options.length), 14)
  const sceneModules = ['ProjectPreview', 'ContextDesk', 'PauseAnatomy', 'TimerMicroscope', 'VersionBook', 'SkillRecipe', 'McpWorkbench', 'ApiEnvelope', 'LessonStory', 'CourseArtwork', 'ActivitiesArtwork', 'WinterSwiftArtwork', 'RollText']
  await page.waitForFunction(modules => {
    const resources = performance.getEntriesByType('resource').map(entry => entry.name)
    return modules.every(name => resources.some(url => url.includes('/' + name + '.') && url.endsWith('.js')))
  }, {}, sceneModules)
  const initial = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name))
  assert(!initial.some(name => /\/(AsciiHero|Mermaid)\./.test(name)), 'Gallery must not preload unrelated heavy scenes')
  assert.equal(await page.$eval('.animation-gallery__preview', el => el.dataset.example), 'project')
  assert.equal(await page.$$eval('.animation-gallery__preview > *', children => children.length), 1)
  const lateSceneRequests = []
  page.on('request', request => {
    if (sceneModules.some(name => request.url().includes('/' + name + '.') && request.url().endsWith('.js'))) lateSceneRequests.push(request.url())
  })

  async function select(index) {
    const id = examples[index]
    await page.select('.animation-gallery select', String(index))
    await page.waitForFunction(id => {
      const preview = document.querySelector('.animation-gallery__preview')
      if (preview.dataset.example !== id) return false
      if (id === 'course') return preview.querySelectorAll('.art-stage').length === 3
      if (id === 'activities' || id === 'swift') return !!preview.querySelector('figure svg')
      if (id === 'roll-text') return !!preview.querySelector('.roll-text')
      return preview.querySelector('.learning-illustration')?.dataset.scene === id && !!preview.querySelector('.lesson-lab')
    }, {}, id)
    await page.$eval('.animation-gallery__preview', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    assert.equal(await page.$$eval('.animation-gallery__preview > *', children => children.length), 1)
  }

  for (let index = 0; index < examples.length; index++) {
    await select(index)
    const snippet = await page.$eval('.animation-gallery code', el => el.textContent)
    if (index < 10) assert.equal(snippet, `<LearningIllustration scene="${examples[index]}" />`)
    if (index === 10) assert.equal(snippet, '<CourseArtwork compact />')
    if (index > 10) assert(snippet.includes("from '@theme/components/"))
    if (index >= 10 && index <= 12) {
      await page.waitForFunction(() => !document.querySelector('.animation-gallery [data-art-state="waiting"], .animation-gallery [data-art-state="playing"], .animation-gallery [data-motion-state="waiting"], .animation-gallery [data-motion-state="playing"]'))
      await (await page.$('.animation-gallery__preview')).screenshot({ path: `${out}/${examples[index]}-light.png` })
    }
  }
  assert.deepEqual(lateSceneRequests, [], 'Switching warmed scenes must not fetch animation modules')
  await page.hover('.animation-gallery__link')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.animation-gallery .roll-track')).transform !== 'none')
  await select(7)
  await page.$eval('.animation-gallery__code-bar button', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.click('.animation-gallery__code-bar button')
  await page.waitForFunction(() => document.querySelector('.animation-gallery__copied').textContent === '已复制')
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '<LearningIllustration scene="api" />')

  await select(0)
  await page.waitForFunction(() => Number(document.querySelector('.project-preview').dataset.demoFrame) > 0)
  await page.click('.animation-gallery__replay')
  await page.waitForFunction(() => document.querySelector('.project-preview').dataset.demoFrame === '0')
  await page.$eval('.animation-gallery__preview', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.waitForFunction(() => Number(document.querySelector('.project-preview').dataset.demoFrame) > 0)
  await page.screenshot({ path: `${out}/gallery-desktop.png` })
  console.log('PASS guide navigation, sidebar, templates, 14 preloaded previews without extra scene requests, copy, replay and hover')

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setViewport({ width: 320, height: 844 })
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  for (let index = 0; index < examples.length; index++) {
    await select(index)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `320px overflow: ${examples[index]}`)
    assert.equal(await page.$$eval('.animation-gallery .lab-playback', buttons => buttons.length), 0)
    if (index >= 10 && index <= 12) {
      await (await page.$('.animation-gallery__preview')).screenshot({ path: `${out}/${examples[index]}-mobile-dark.png` })
    }
  }
  await select(5)
  await page.screenshot({ path: `${out}/gallery-mobile-dark.png` })
  await page.goto(base + root + 'development', { waitUntil: 'networkidle0' })
  assert((await page.$eval('.VPContent', el => el.textContent)).includes('useLabPlayback'))
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)

  await page.setJavaScriptEnabled(false)
  await page.goto(base + root + 'animations', { waitUntil: 'networkidle0' })
  assert(await page.$('.project-preview'), 'SSR must contain the default scene')
  assert((await page.$eval('.animation-gallery code', el => el.textContent)).includes('scene="project"'))
  assert((await page.$eval('.animation-gallery noscript', el => el.textContent)).includes('静态画面'))
  assert.deepEqual(errors, [])
  console.log('PASS 14 narrow dark previews, reduced motion, maintenance content and no-JS example')
  console.log(`Screenshots: ${out}`)
} finally {
  await browser.close()
}
