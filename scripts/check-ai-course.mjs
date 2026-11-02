import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4173'
const out = process.env.QA_OUT || 'output/design-auto-demos-2026-11-02'
await fs.mkdir(out, {recursive:true})
const browser = await puppeteer.launch({channel:'chrome',headless:true})
const page = await browser.newPage()
const errors = []
page.on('pageerror', e=>errors.push(e.message))
page.on('response', r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.url())})
await page.evaluateOnNewDocument(()=>{
 const start=window.setInterval.bind(window),stop=window.clearInterval.bind(window)
 window.__demoTimers=new Set()
 window.setInterval=(...args)=>{const id=start(...args);window.__demoTimers.add(id);return id}
 window.clearInterval=id=>{window.__demoTimers.delete(id);return stop(id)}
})
const wait=ms=>new Promise(r=>setTimeout(r,ms))
const root='/resources/ai-programming/'
async function go(route){await page.goto(base+route,{waitUntil:'networkidle0'});await wait(200)}
async function show(selector){await page.$eval(selector,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(200)}
async function frame(selector){return page.$eval(selector,e=>e.dataset.demoFrame)}
async function changing(selector){const before=await frame(selector);await page.waitForFunction(({selector,before})=>document.querySelector(selector).dataset.demoFrame!==before,{timeout:4000},{selector,before})}
async function stable(selector){const before=await frame(selector);await wait(1650);assert.equal(await frame(selector),before)}
async function shot(selector,name){await (await page.$(selector)).screenshot({path:path.join(out,name+'.png')})}
async function clickText(scope,label){for(const b of await page.$$(scope+' button'))if((await b.evaluate(e=>e.textContent.trim()))===label){await b.click();return}throw Error('Missing '+label)}
const scenes=[['01','project-preview'],['01','lesson-story'],['02','lesson-story'],['02','context-desk'],['03','pause-anatomy'],['04','timer-microscope'],['04','version-book'],['05','skill-recipe'],['06','mcp-workbench'],['api-setup','api-envelope']]
try{
 await page.setViewport({width:1440,height:1000})
 for(const [chapter,name] of scenes){
  await go(root+'chapters/'+chapter);const selector='.'+name;await show(selector)
  await page.waitForSelector(selector+' [data-playing="true"]')
  await changing(selector)
  assert.equal(await page.$$eval(selector+' button',e=>e.length),1,'Only pause control remains')
  assert.equal(await page.$$eval(selector+' select,'+selector+' input,'+selector+' textarea,'+selector+' [draggable="true"]',e=>e.length),0,'No options or tasks')
  assert((await page.$eval(selector,e=>e.innerText)).length<180,'Demo text must stay minimal')
  await page.click(selector+' .lab-playback');await stable(selector)
  await shot(selector,name+'-'+chapter+'-desktop')
  await page.click(selector+' .lab-playback');await changing(selector)
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await wait(300);await stable(selector)
  await show(selector);await changing(selector)
  console.log('PASS autoplay, pause, offscreen stop/resume: '+name+' '+chapter)
 }
 await go(root+'chapters/02');await show('.lesson-story')
 await page.waitForFunction(()=>Number(document.querySelector('.lesson-story').dataset.demoFrame)>=9,{timeout:9000})
 await page.click('.lesson-story .lab-playback')
 const distances=await page.$$eval('.feedback-distance b',els=>els.map(e=>Number(e.textContent)))
 assert(distances[0]>0);assert.equal(distances[1],distances[0]*2,'Feedback must visibly compare different speeds')
 assert.equal(await page.$eval('.feedback-setting span',e=>e.textContent),'标准')
 await stable('.lesson-story')
 await go(root+'chapters/01');await show('.project-preview')
 await page.waitForFunction(()=>document.querySelector('.project-preview').dataset.demoFrame==='4',{timeout:9000})
 await page.waitForFunction(()=>document.querySelector('.project-preview').dataset.demoFrame==='0',{timeout:4500})
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))})
 await stable('.project-preview')
 assert.equal(await page.evaluate(()=>window.__demoTimers.size),0)
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await changing('.project-preview')
 await page.click('.project-preview .lab-playback')
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await wait(150);await show('.project-preview');await stable('.project-preview')
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await wait(200)
 assert.equal(await page.$$eval('.project-preview button',e=>e.length),0);await stable('.project-preview')
 assert.equal(await frame('.project-preview'),'3')
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await wait(100);await stable('.project-preview')
 await page.click('.project-preview .lab-playback');await changing('.project-preview')
 await page.click('.VPNavBarTitle a');await page.waitForSelector('.club-home');await wait(200)
 assert.equal(await page.evaluate(()=>window.__demoTimers.size),0,'SPA route change must dispose demo clocks')
 console.log('PASS looping, background visibility, explicit pause persistence, reduced motion and route disposal')

 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
 await page.setViewport({width:320,height:844})
 for(const [chapter,name] of scenes){
  await go(root+'chapters/'+chapter);await show('.'+name);await page.evaluate(()=>document.documentElement.classList.add('dark'))
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow')
  assert.equal(await page.evaluate(()=>window.__demoTimers.size),0,'Reduced motion must not run clocks')
  assert.equal(await page.$$eval('.'+name+' button',e=>e.length),0)
  await shot('.'+name,name+'-'+chapter+'-mobile-dark')
 }
 await page.setViewport({width:1440,height:1000})
 await go(root+'chapters/01');await show('.recall-quiz');await page.click('.recall-quiz__choices button:first-child')
 assert((await page.$eval('.recall-quiz__feedback',e=>e.textContent)).includes('正确答案'))
 await clickText('.recall-quiz','再试一次');await page.click('.recall-quiz__choices button:nth-child(2)')
 assert((await page.$eval('.recall-quiz__feedback',e=>e.textContent)).includes('答对了'))
 await show('.reading-tools');await clickText('.reading-tools','标记为已读');await go(root)
 assert((await page.$eval('.course-progress',e=>e.textContent)).includes('1 / 6'))
 await go(root+'chapters/02');await show('.prompt-workshop');await page.click('.prompt-workshop__rounds button:nth-child(2)')
 assert((await page.$eval('.prompt-workshop__prompt',e=>e.textContent)).includes('轻松'))
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}))
 await clickText('.prompt-workshop','复制这一轮提示词');await wait(100)
 assert((await page.$eval('.prompt-workshop__status',e=>e.textContent)).includes('复制未成功'))
 await go(root+'read-all');assert.equal(await page.$$eval('.learning-illustration',e=>e.length),10)
 const ids=await page.$$eval('[id]',e=>e.map(n=>n.id));assert.equal(new Set(ids).size,ids.length)
 await go(root+'materials/')
 for(const href of new Set(await page.$$eval('.vp-doc a[download]',e=>e.map(n=>n.getAttribute('href'))))){const response=await fetch(base+href);assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),await fs.readFile(path.join('docs/public',decodeURIComponent(href))))}
 await page.setJavaScriptEnabled(false);await go(root+'chapters/01')
 assert(await page.$('.project-preview svg'),'SSR should retain the illustration')
 assert.deepEqual(errors,[])
 console.log('PASS 10 minimal demos, 320px dark layouts, SSR, quiz, reading progress, prompt copying, continuous reading and downloads')
}finally{await browser.close()}
