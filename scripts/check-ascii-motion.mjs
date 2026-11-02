import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base=process.argv[2]||'http://localhost:4173'
const out='output/design-ascii-motion-2026-11-02'
await fs.mkdir(out,{recursive:true})
const browser=await puppeteer.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']})
const page=await browser.newPage()
const errors=[];page.on('pageerror',e=>errors.push(e.message))
const wait=ms=>new Promise(r=>setTimeout(r,ms))
const state=()=>page.$eval('.ascii-narrative',e=>({...e.dataset}))
const pixels=()=>page.$eval('.ascii-narrative',e=>e.toDataURL())
const at=age=>page.waitForFunction(age=>Number(document.querySelector('.ascii-narrative').dataset.sceneTime)>=age,{timeout:15000},age)
async function select(name){await page.click(`.club-pager [aria-label="${name}"]`);await page.waitForFunction(()=>!document.querySelector('.club-home').classList.contains('is-changing')&&document.querySelector('.ascii-narrative').dataset.morphing==='false')}
async function shape(){return page.$eval('.ascii-narrative',e=>{const {width:w,height:h}=e,d=e.getContext('2d').getImageData(0,0,w,h).data;let leftEdge=0,rightEdge=0,leftMax=0,rightMin=w,minX=w,maxX=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]<50)continue;if(x<8)leftEdge++;if(x>w-9)rightEdge++;if(x<w/2)leftMax=Math.max(leftMax,x);else rightMin=Math.min(rightMin,x);minX=Math.min(minX,x);maxX=Math.max(maxX,x)}return {leftEdge,rightEdge,gap:rightMin-leftMax,minX,maxX,scale:w/e.clientWidth}})}
try{
 await page.setViewport({width:1440,height:900})
 await page.goto(base+'/#start',{waitUntil:'domcontentloaded'})
 await page.waitForFunction(()=>Number(document.querySelector('.ascii-narrative')?.dataset.points)>0)
 const early=await shape();await page.screenshot({path:out+'/hands-entering.png'})
 await at(2)
 const reached=await shape()
 assert(reached.leftEdge>0&&reached.rightEdge>0,'Both forearms must reach the viewport edges')
 assert(reached.gap<early.gap-80,'Fingertips must move inward from both edges')
 const flowing=await pixels();await wait(550);assert.notEqual(await pixels(),flowing,'Glyph flow should continue after reaching')
 await page.screenshot({path:out+'/hands-flow.png'})
 await page.click('.club-ascii-playback');await wait(80)
 const paused=await pixels(),time=(await state()).sceneTime;await wait(450)
 assert.equal(await pixels(),paused);assert.equal((await state()).sceneTime,time)
 await page.click('.club-ascii-playback');await wait(450);assert.notEqual((await state()).sceneTime,time)
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))})
 const hidden=(await state()).sceneTime;await wait(450);assert.equal((await state()).sceneTime,hidden)
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))})
 console.log('PASS full-bleed reaching hands, ongoing flow, pause/resume and background suspension')
 await select('活动');await at(.2)
 const paper=await pixels();await wait(800);assert.notEqual(await pixels(),paper,'Paper should gently move')
 const area=await shape(),recordLeft=await page.$eval('.club-making__records',e=>e.getBoundingClientRect().left)
 assert(area.maxX/area.scale<recordLeft-12,'Tilted artwork must not overlap activity text')
 await page.screenshot({path:out+'/paper-tilted.png'})
 await select('加入');await at(.3)
 const sprout=Number((await state()).visiblePoints)
 await page.screenshot({path:out+'/tree-trunk.png'})
 await at(2.6);await page.screenshot({path:out+'/tree-leaves.png'})
 await page.waitForFunction(()=>document.querySelector('.ascii-narrative').dataset.motion==='complete')
 assert(Number((await state()).visiblePoints)>sprout*2,'Branches and leaves must emerge progressively')
 const grown=await pixels(),ended=(await state()).sceneTime;await wait(450)
 assert.equal(await pixels(),grown);assert.equal((await state()).sceneTime,ended,'Growth should finish without a perpetual loop')
 await page.screenshot({path:out+'/tree-grown.png'})
 console.log('PASS subtle perspective motion, text clearance, staged growth and completed still state')
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
 for(const label of ['学习','活动','加入']){await select(label);const before=await pixels();await wait(150);assert.equal(await pixels(),before);assert.equal(await page.$('.club-ascii-playback'),null)}
 for(const [width,height] of [[320,568],[390,844]]){
  await page.setViewport({width,height});await page.goto(base+'/#start',{waitUntil:'networkidle0'})
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  const edges=await shape();assert(edges.leftEdge>0&&edges.rightEdge>0,'Mobile arms must be full bleed')
  assert(await page.$$eval('.club-path',els=>els.every(e=>{const r=e.getBoundingClientRect();return r.top>=64&&r.bottom<=innerHeight})), 'All learning links must remain visible')
  await page.evaluate(()=>document.documentElement.classList.add('dark'))
  await page.screenshot({path:`${out}/hands-${width}-dark.png`})
 }
 assert.deepEqual(errors,[])
 console.log('PASS reduced motion, 320px short phone layout, dark theme and visible links')
}finally{await browser.close()}
