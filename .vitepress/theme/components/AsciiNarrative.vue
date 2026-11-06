<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { AsciiInteraction } from '../ascii/interaction'
import { homeTransitionDuration } from '../composables/homeMotion'
import { mythTransition, flamePose, torchLight, shadeGlyph, type Glyph as Point } from '../ascii/myth-motion'
import hands from '../ascii/creation/hands.json'
import prometheus from '../ascii/creation/prometheus.json'
import argo from '../ascii/creation/argo.json'
import handsMobile from '../ascii/creation/hands-mobile.json'
import prometheusMobile from '../ascii/creation/prometheus-mobile.json'
import argoMobile from '../ascii/creation/argo-mobile.json'
type Snapshot = { points: Point[]; width: number; height: number }
const props = defineProps<{ page: number; paged: boolean; opening: () => Snapshot | null }>()
const emit = defineEmits<{ ready: [boolean]; covering: [boolean] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const paused = ref(false)
const reduced = ref(false)
type SceneData = { cols: number; rows: number; lines: string[]; parts?: string[]; features?: typeof features }
const scenes: SceneData[] = [hands,prometheus,argo]
const mobileScenes: SceneData[] = [handsMobile,prometheusMobile,argoMobile]
const clamp = (v: number) => Math.min(1,Math.max(0,v))
let ctx: CanvasRenderingContext2D | null = null
let host: HTMLElement | null = null
let resize: ResizeObserver | undefined
let theme: MutationObserver | undefined
let observer: IntersectionObserver | undefined
let motion: MediaQueryList | undefined
let tween: gsap.core.Tween | undefined
let width=0,height=0,ink='',accent='',font='monospace'
let points: Point[]=[],base: Point[]=[]
let box={x:0,y:0,width:1,height:1}
let features={flameBase:.42,mast:.5,sailLeft:.22,sailRight:.8}
let sailTop=0,sailBottom=1
let mounted=false,visible=true,morphing=false
let lastPage=0,age=0,raf=0,lastTime=0
let openingCache: Snapshot | null = null
const playhead={value:1}
const interaction=new AsciiInteraction()
function measure() {
 if(!canvas.value || !host || !ctx)return
 width=host.clientWidth;height=host.clientHeight
 const dpr=Math.min(devicePixelRatio||1,2)
 canvas.value.width=props.paged?Math.round(width*dpr):1;canvas.value.height=props.paged?Math.round(height*dpr):1
 ctx.setTransform(dpr,0,0,dpr,0,0)
 const style=getComputedStyle(host);ink=style.color;accent=style.getPropertyValue('--mag-accent').trim()||'#007aff';font=style.getPropertyValue('--mag-font-mono')||'monospace'
 ctx.textAlign='center';ctx.textBaseline='middle'
}
function paint() {
 if(!ctx)return
 ctx.clearRect(0,0,width,height)
 if(!props.paged)return
 ctx.fillStyle=ink
 let size=0,shown=0
 for(const p of points){
  if(p.alpha<.015)continue
  shown++
  const next=Math.round(p.size*2)/2
  if(size!==next){size=next;ctx.font=`400 ${size}px ${font}`}
  ctx.globalAlpha=p.alpha;ctx.fillText(p.char,p.x,p.y)
 }
 ctx.globalAlpha=1
 if(!morphing&&props.page>0&&!reduced.value)interaction.paint(ctx,accent)
 if(canvas.value){canvas.value.dataset.points=String(points.length);canvas.value.dataset.visiblePoints=String(shown);canvas.value.dataset.sceneTime=age.toFixed(2)}
 if(canvas.value)Object.assign(canvas.value.dataset,interaction.inspect())
}
function target(page: number): Point[] {
 if(page===0){
  let shot: Snapshot | null=null
  try{shot=props.opening()||openingCache}catch{shot=openingCache}
  if(!shot)return []
  openingCache=shot
  return shot.points.map(p=>({...p,x:p.x/shot.width*width,y:p.y/shot.height*height,size:p.size*Math.min(width/shot.width,height/shot.height)}))
 }
 const slot=host?.querySelector<HTMLElement>(`[data-ascii-slot="${page}"]`)
 if(!slot)return []
 let x=0,y=0,node:HTMLElement|null=slot
 while(node&&node!==host){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent as HTMLElement|null}
 for(let parent=slot.parentElement;parent&&parent!==host;parent=parent.parentElement){x-=parent.scrollLeft;y-=parent.scrollTop}
 const data=(width<=700?mobileScenes:scenes)[page-1]
 let cellX=Math.min(slot.clientWidth/data.cols,slot.clientHeight/(data.rows/.6)),cellY=cellX/.6
 if(page===1){cellX=width/(data.cols-1.6);cellY=Math.min(cellX/.6,slot.clientHeight/data.rows);x=-cellX*.8}
 else x+=(slot.clientWidth-data.cols*cellX)/2
 y+=(slot.clientHeight-data.rows*cellY)/2
 box={x,y,width:data.cols*cellX,height:data.rows*cellY}
 if(data.features)features=data.features
 const result:Point[]=[]
 data.lines.forEach((line,row)=>Array.from(line).forEach((char,col)=>{
  if(char!==' ')result.push({x:x+(col+.5)*cellX,y:y+(row+.5)*cellY,char,size:Math.min(cellX/.6,cellY),alpha:1,u:(col+.5)/data.cols,v:(row+.5)/data.rows,part:data.parts?Number(data.parts[row][col]):0})
 }))
 if(page===3){
  const cloth=result.filter(p=>p.part===1)
  sailTop=cloth.reduce((v,p)=>Math.min(v,p.v??1),1)
  sailBottom=cloth.reduce((v,p)=>Math.max(v,p.v??0),0)
 }
 return result
}
function scenePose(page: number,source: Point[],time: number,staticScene=false): Point[] {
 return source.map((p,i)=>{
  const u=p.u??.5,v=p.v??.5
  if(page===1){
   const side=u<.5?-1:1
   const distance=Math.min(u,1-u)
   const wave=Math.sin(distance*26-time*2.15)
   const stream=staticScene?0:Math.max(0,wave)**3
   const glyphs=p.char==='@'||p.char==='%'?'@%':p.char==='#'||p.char==='*'?'#*':p.char==='+'||p.char==='='?'+=':p.char===':'||p.char==='-'?':-':p.char
   return {...p,x:p.x-side*stream*1.4,y:p.y+(staticScene?0:Math.sin(distance*18-time*1.3)*.65),char:stream>.55?glyphs[(Math.floor(time*3)+i)%glyphs.length]:p.char,alpha:staticScene?1:.67+stream*.33}
  }
  if(page===2){
   if(staticScene)return {...p}
   return p.part===1?flamePose(p,time,i,box.height,features.flameBase):torchLight(p,time,features.flameBase)
  }
  if(page===3){
   if(staticScene)return {...p}
   if(p.part===1){
    const span=clamp((u-features.sailLeft)/(features.sailRight-features.sailLeft))
    const pinned=Math.min(1,Math.abs(u-features.mast)*18)
    const drop=clamp((v-sailTop)/Math.max(.01,sailBottom-sailTop))
    const belly=Math.sin(span*Math.PI)*Math.sin(drop*Math.PI)*pinned
    const breeze=Math.sin(time*.95)
    const light=Math.sin(span*11-time*.95+drop*2)*.6+Math.cos(drop*8+span*5+time*.55)*.25
    return shadeGlyph({...p,x:p.x+belly*breeze*box.width*.023,y:p.y+belly*Math.sin(time*.95+.5)*box.height*.012},light,2.4)
   }
   if(p.part===3){
    const swell=Math.sin(u*17-time*.9+v*9)
    return {...p,x:p.x+Math.sin(time*.45+v*11)*box.width*.008,
     y:p.y+swell*box.height*.008+Math.sin(u*31-time*1.3+v*5)*box.height*.003,
     char:swell>.5?'~':swell<-.5?'_':p.char,
     alpha:.38+.24*(.5+.5*Math.cos(u*17-time*.9+v*9))}
   }
   const reflection=Math.sin(u*22-time*1.1+v*18)*.4+Math.sin(u*8+v*5+time*.6)*.3
   return shadeGlyph(p,reflection,1.9)
  }
  return p
 })
}
function stopScene(){cancelAnimationFrame(raf);raf=0;lastTime=0}
function canRun(){return props.paged&&visible&&!document.hidden&&!paused.value&&!reduced.value}
function drawScene(dt=0){
 points=scenePose(props.page,base,age,reduced.value)
 if(props.page>0&&!reduced.value)interaction.advance(points,age,dt)
 if(props.page===2&&!reduced.value){
  const flame=base.filter(p=>p.part===1)
  if(flame.length){
   const tip=flame.reduce((a,p)=>p.y<a.y?p:a)
   for(let i=0;i<3;i++){
    const phase=(age*.24+i/3)%1
    points.push({x:tip.x+Math.sin(age*.9+i*2)*box.width*.012+phase*box.width*.025,y:tip.y-phase*box.height*.11,
     char:i===1?':':'.',size:tip.size*.85,alpha:Math.sin(phase*Math.PI)*.6,part:4})
   }
  }
 }
 paint()
}
function tick(now:number){
 if(!canRun()||morphing||props.page===0){stopScene();return}
 if(!lastTime)lastTime=now
 const dt=now-lastTime
 if(dt>=1000/30){const step=Math.min(dt,80)/1000;age+=step;lastTime=now;drawScene(step)}
 raf=requestAnimationFrame(tick)
}
function playback(){
 if(!canRun()){stopScene();tween?.pause();return}
 if(morphing){tween?.resume();return}
 if(props.page>0&&!raf)raf=requestAnimationFrame(tick)
}
function settle(restart=false){
 tween?.kill();playhead.value=1;morphing=false;stopScene()
 if(restart)age=paused.value||reduced.value?5:0
 base=props.page===0?[]:target(props.page)
 interaction.reset(base.length,box,props.page===2||props.page===3)
 drawScene();emit('covering',false)
 if(canvas.value){canvas.value.dataset.morphing='false';canvas.value.dataset.motion=props.page===1?'flow':props.page===2?'burning':props.page===3?'sailing':'still'}
 playback()
}
async function change(){
 if(!mounted)return
 await nextTick()
 stopScene()
 interaction.reset(0,box)
 if(!props.paged){tween?.kill();morphing=false;points=[];base=[];measure();paint();emit('ready',false);emit('covering',false);lastPage=props.page;return}
 measure();emit('ready',true)
 const previous=lastPage;lastPage=props.page
 // Initial/static layout needs no synchronous GPU readback of the opening.
 if(previous===props.page){settle(age===0);return}
 const from=previous===0&&!points.length?target(0):points.map(p=>({...p}))
 const raw=target(props.page)
 const to=scenePose(props.page,raw,0,reduced.value||paused.value)
 if(reduced.value||paused.value||previous===props.page||!to.length||!from.length){settle(previous!==props.page||age===0);return}
 tween?.kill();morphing=true;emit('covering',previous===0||props.page===0)
 const story=mythTransition(previous,props.page,from,to,width)
 if(canvas.value)canvas.value.dataset.transition=story?.kind||'scatter'
 if(canvas.value){canvas.value.dataset.morphing='true';canvas.value.dataset.from=String(previous);canvas.value.dataset.to=String(props.page);canvas.value.dataset.sourcePoints=String(from.length)}
 const count=Math.max(from.length,to.length)
 const origin=from.slice().sort((a,b)=>a.x-b.x||a.y-b.y)
 const destination=to.slice().sort((a,b)=>a.x-b.x||a.y-b.y)
 const pairs=Array.from({length:count},(_,i)=>{
  const a=origin[i%origin.length],b=destination[i%destination.length]
  const random=Math.sin(i*127.1+previous*37)*43758.5453,noise=random-Math.floor(random)
  return {a:{...a,alpha:i<origin.length?a.alpha:0},b:{...b,alpha:i<destination.length?b.alpha:0},cx:(a.x+b.x)/2+(noise-.5)*Math.min(width*.5,450),cy:(a.y+b.y)/2+Math.sin(i*7.7)*Math.min(height*.3,180)}
 })
 playhead.value=0
 const frame=()=>{
  const t=playhead.value,u=1-t
  points=story?story.frame(t):pairs.map(({a,b,cx,cy})=>({x:u*u*a.x+2*u*t*cx+t*t*b.x,y:u*u*a.y+2*u*t*cy+t*t*b.y,size:a.size+(b.size-a.size)*t,char:t<.46?a.char:b.char,alpha:a.alpha+(b.alpha-a.alpha)*t}))
  if(canvas.value)canvas.value.dataset.progress=t.toFixed(3)
  paint()
 }
 frame()
 tween=gsap.to(playhead,{value:1,duration:homeTransitionDuration(width<=700,previous,props.page),ease:story?'none':'power2.inOut',onUpdate:frame,onComplete:()=>settle(true)})
 if(!canRun())tween.pause()
}
function preference(){reduced.value=motion?.matches??false;if(reduced.value){age=Math.max(age,5);settle()}else playback()}
function scroll(){if(props.paged)settle()}
function toggle(){paused.value=!paused.value;if(paused.value&&morphing)settle(true);else playback()}
function pointerMove(event:PointerEvent){
 if(!host||!canRun()||morphing||props.page===0)return
 if(event.pointerType==='touch'&&event.type==='pointermove')return
 const rect=host.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top
 const control=event.target instanceof Element&&event.target.closest('a,button,input')
 if(control||x<box.x||x>box.x+box.width||y<box.y||y>box.y+box.height){interaction.leave();return}
 interaction.move(x,y)
}
function pointerLeave(){interaction.leave()}
function pointerUp(event:PointerEvent){if(event.pointerType==='touch')interaction.leave()}
function visibility(){if(document.hidden)interaction.leave();playback()}
onMounted(()=>{
 if(!canvas.value)return
 ctx=canvas.value.getContext('2d');host=canvas.value.parentElement
 if(!ctx||!host)return
 mounted=true;lastPage=props.page
 motion=window.matchMedia('(prefers-reduced-motion: reduce)');reduced.value=motion.matches;motion.addEventListener('change',preference)
 document.addEventListener('visibilitychange',visibility);host.addEventListener('scroll',scroll,true)
 host.addEventListener('pointermove',pointerMove,{passive:true});host.addEventListener('pointerdown',pointerMove,{passive:true})
 host.addEventListener('pointerleave',pointerLeave);host.addEventListener('pointercancel',pointerLeave);host.addEventListener('pointerup',pointerUp)
 resize=new ResizeObserver(()=>{const w=host!.clientWidth,h=host!.clientHeight;if(w!==width||h!==height){measure();settle()}});resize.observe(host)
 observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>.1;playback()},{threshold:[0,.1]});observer.observe(host)
 theme=new MutationObserver(()=>{measure();paint()});theme.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
 change()
})
watch(()=>[props.page,props.paged],change)
onBeforeUnmount(()=>{
 mounted=false;stopScene();tween?.kill();resize?.disconnect();observer?.disconnect();theme?.disconnect()
 motion?.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);host?.removeEventListener('scroll',scroll,true)
 host?.removeEventListener('pointermove',pointerMove);host?.removeEventListener('pointerdown',pointerMove)
 host?.removeEventListener('pointerleave',pointerLeave);host?.removeEventListener('pointercancel',pointerLeave);host?.removeEventListener('pointerup',pointerUp)
})
</script>
<template>
 <canvas ref="canvas" class="ascii-narrative" aria-hidden="true" data-morphing="false" />
 <button v-if="paged&&page>0&&!reduced" class="club-ascii-playback" type="button" :aria-label="paused?'播放字符动效':'暂停字符动效'" :title="paused?'播放字符动效':'暂停字符动效'" @click="toggle"><i :class="['ti',paused?'ti-player-play':'ti-player-pause']" aria-hidden="true" /></button>
</template>
<style scoped>
.ascii-narrative { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; }
.club-ascii-playback { position: absolute; z-index: 5; right: max(7vw,calc((100vw - 1240px)/2)); bottom: 16px; display: grid; place-items: center; width: 36px; height: 36px; color: var(--mag-text-secondary); border-radius: 50%; font-size: 16px; }
.club-ascii-playback:hover { color: var(--mag-accent); background: var(--mag-accent-soft); }
@media(max-width:700px) { .club-ascii-playback { right: 52px; bottom: 12px; } }
@media print { .ascii-narrative,.club-ascii-playback { display: none; } }
</style>
