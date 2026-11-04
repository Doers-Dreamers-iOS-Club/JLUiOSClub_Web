import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const base=process.argv[2]||'http://localhost:4173'
const out=process.env.QA_OUT||'output/design-ascii-motion-2026-11-02'
await fs.mkdir(out,{recursive:true})
const browser=await puppeteer.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']})
const page=await browser.newPage()
const errors=[];page.on('pageerror',e=>errors.push(e.message))
const wait=ms=>new Promise(r=>setTimeout(r,ms))
const state=()=>page.$eval('.ascii-narrative',e=>({...e.dataset}))
const pixels=()=>page.$eval('.ascii-narrative',e=>e.toDataURL())
const at=age=>page.waitForFunction(age=>Number(document.querySelector('.ascii-narrative').dataset.sceneTime)>=age,{timeout:15000},age)
async function select(name){await page.click(`.club-pager [aria-label="${name}"]`);await page.waitForFunction(()=>!document.querySelector('.club-home').classList.contains('is-changing')&&document.querySelector('.ascii-narrative').dataset.morphing==='false')}
async function story(label,kind,suffix=''){
 await page.click(`.club-pager [aria-label="${label}"]`)
 await page.waitForFunction(kind=>{const d=document.querySelector('.ascii-narrative').dataset;return d.morphing==='true'&&d.transition===kind&&Number(d.progress)>.18},{timeout:10000},kind)
 await page.screenshot({path:`${out}/${kind}-${label}${suffix}-early.png`})
 await page.waitForFunction(()=>Number(document.querySelector('.ascii-narrative').dataset.progress)>.58)
 await page.screenshot({path:`${out}/${kind}-${label}${suffix}-late.png`})
 await page.waitForFunction(()=>!document.querySelector('.club-home').classList.contains('is-changing')&&document.querySelector('.ascii-narrative').dataset.morphing==='false')
}
async function interact(label){
 const point=await page.$eval('.ascii-narrative',e=>{
  const ctx=e.getContext('2d'),{width:w,height:h}=e,data=ctx.getImageData(0,0,w,h).data,rect=e.getBoundingClientRect()
  // Pick a visible glyph, so the test exercises the actual artwork at any size.
  for(let y=Math.floor(h*.3);y<h*.8;y+=3)for(let x=Math.floor(w*.18);x<w*.8;x+=3){
   if(data[(y*w+x)*4+3]>100)return {x:rect.left+x/w*rect.width,y:rect.top+y/h*rect.height}
  }
  throw new Error('No visible glyph to interact with')
 })
 await page.mouse.move(point.x,point.y)
 await page.waitForFunction(()=>Number(document.querySelector('.ascii-narrative').dataset.displacement)>.2)
 await wait(450)
 assert(Number((await state()).regions)>=2,'Hover should detect multiple regions in the artwork')
 const blue=await page.$eval('.ascii-narrative',e=>{const d=e.getContext('2d').getImageData(0,0,e.width,e.height).data;let count=0;for(let i=0;i<d.length;i+=4)if(d[i+2]>d[i]+40&&d[i+3]>50)count++;return count})
 assert(blue>30,'Scan brackets and connectors must be drawn in the accent color')
 await page.screenshot({path:`${out}/${label}-scan.png`})
 await page.click('.club-ascii-playback');await wait(80)
 const frozen=await pixels();await page.mouse.move(point.x+20,point.y+10);await wait(200)
 assert.equal(await pixels(),frozen,'Pause must freeze scan overlay as well as glyphs')
 await page.click('.club-ascii-playback');await page.mouse.move(5,5)
 await wait(1600)
 assert.equal((await state()).regions,'0','Scan overlay must fade out on pointer leave')
 assert(Number((await state()).displacement)<.05,'Displaced glyphs must spring back')
}
async function shape(){return page.$eval('.ascii-narrative',e=>{const {width:w,height:h}=e,d=e.getContext('2d').getImageData(0,0,w,h).data;let leftEdge=0,rightEdge=0,leftMax=0,rightMin=w,minX=w,maxX=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]<50)continue;if(x<8)leftEdge++;if(x>w-9)rightEdge++;if(x<w/2)leftMax=Math.max(leftMax,x);else rightMin=Math.min(rightMin,x);minX=Math.min(minX,x);maxX=Math.max(maxX,x)}return {leftEdge,rightEdge,gap:rightMin-leftMax,minX,maxX,scale:w/e.clientWidth}})}
try{
 await page.setViewport({width:1440,height:900})
 await page.goto(base+'/#start',{waitUntil:'domcontentloaded'})
 await page.waitForFunction(()=>Number(document.querySelector('.ascii-narrative')?.dataset.points)>0)
 const early=await shape();await page.screenshot({path:out+'/hands-initial.png'})
 await at(2)
 const reached=await shape()
 assert(reached.leftEdge>0&&reached.rightEdge>0,'Both forearms must reach the viewport edges')
 assert(Math.abs(reached.gap-early.gap)<12,'Hands must stay in place without a reaching entrance')
 const flowing=await pixels();await wait(550);assert.notEqual(await pixels(),flowing,'Glyph flow should continue with stationary hands')
 await page.screenshot({path:out+'/hands-flow.png'})
 await interact('hands')
 await page.click('.club-ascii-playback');await wait(80)
 const paused=await pixels(),time=(await state()).sceneTime;await wait(450)
 assert.equal(await pixels(),paused);assert.equal((await state()).sceneTime,time)
 await page.click('.club-ascii-playback');await wait(450);assert.notEqual((await state()).sceneTime,time)
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))})
 const hidden=(await state()).sceneTime;await wait(450);assert.equal((await state()).sceneTime,hidden)
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))})
 console.log('PASS stationary full-bleed hands, ongoing flow, pause/resume and background suspension')
 await story('活动','hands-sand');await at(.2)
 const fire=await pixels();await wait(800);assert.notEqual(await pixels(),fire,'Flame should keep burning')
 assert.equal((await state()).motion,'burning')
 const area=await shape(),recordLeft=await page.$eval('.club-making__records',e=>e.getBoundingClientRect().left)
 assert(area.maxX/area.scale<recordLeft-12,'Torch artwork must not overlap activity text')
 await page.screenshot({path:out+'/prometheus-burning.png'})
 await interact('prometheus')
 await story('加入','fire-to-sail');await at(.3)
 assert.equal((await state()).motion,'sailing')
 const sail=await pixels();await wait(1100)
 assert.notEqual(await pixels(),sail,'Sail and water should continue moving after arrival')
 await page.screenshot({path:out+'/argo-sailing.png'})
 await interact('argo')
 await story('活动','fire-to-sail')
 await story('学习','hands-sand')
 console.log('PASS hands-sand and fire-to-sail transitions in both directions, burning, billowing, text clearance and scanning')
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
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}])
 await story('活动','hands-sand','-390')
 await story('学习','hands-sand','-390')
 for(const [label,name] of [['活动','prometheus'],['加入','argo']]){
  await select(label);await at(.4)
  const before=await pixels();await wait(600);assert.notEqual(await pixels(),before,'Myth motion should also run on mobile')
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  await page.screenshot({path:`${out}/${name}-390-dark.png`})
 }
 assert.deepEqual(errors,[])
 console.log('PASS reduced motion, 320px short phone layout, mobile myth animation, dark theme and visible links')
}finally{await browser.close()}
