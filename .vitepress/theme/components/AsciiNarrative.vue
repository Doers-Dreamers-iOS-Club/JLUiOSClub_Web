<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import hands from '../ascii/creation/hands.json'
import making from '../ascii/creation/making.json'
import growing from '../ascii/creation/growing.json'
import handsMobile from '../ascii/creation/hands-mobile.json'
import makingMobile from '../ascii/creation/making-mobile.json'
import growingMobile from '../ascii/creation/growing-mobile.json'
type Point = { x: number; y: number; char: string; size: number; alpha: number; u?: number; v?: number; leaf?: number }
type Snapshot = { points: Point[]; width: number; height: number }
const props = defineProps<{ page: number; paged: boolean; opening: () => Snapshot | null }>()
const emit = defineEmits<{ ready: [boolean]; covering: [boolean] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const paused = ref(false)
const reduced = ref(false)
const scenes = [hands,making,growing]
const mobileScenes = [handsMobile,makingMobile,growingMobile]
const clamp = (v: number) => Math.min(1,Math.max(0,v))
const smooth = (v: number) => { const t=clamp(v);return t*t*(3-2*t) }
let ctx: CanvasRenderingContext2D | null = null
let host: HTMLElement | null = null
let resize: ResizeObserver | undefined
let theme: MutationObserver | undefined
let observer: IntersectionObserver | undefined
let motion: MediaQueryList | undefined
let tween: gsap.core.Tween | undefined
let width=0,height=0,ink='',font='monospace'
let points: Point[]=[],base: Point[]=[]
let box={x:0,y:0,width:1,height:1}
let anchors: {u:number;v:number}[]=[]
let mounted=false,visible=true,morphing=false
let lastPage=0,age=0,raf=0,lastTime=0
let openingCache: Snapshot | null = null
const playhead={value:1}
function measure() {
 if(!canvas.value || !host || !ctx)return
 width=host.clientWidth;height=host.clientHeight
 const dpr=Math.min(devicePixelRatio||1,2)
 canvas.value.width=props.paged?Math.round(width*dpr):1;canvas.value.height=props.paged?Math.round(height*dpr):1
 ctx.setTransform(dpr,0,0,dpr,0,0)
 const style=getComputedStyle(host);ink=style.color;font=style.getPropertyValue('--mag-font-mono')||'monospace'
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
 if(canvas.value){canvas.value.dataset.points=String(points.length);canvas.value.dataset.visiblePoints=String(shown);canvas.value.dataset.sceneTime=age.toFixed(2)}
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
 anchors='anchors' in data?data.anchors:[]
 const result:Point[]=[]
 data.lines.forEach((line,row)=>Array.from(line).forEach((char,col)=>{
  if(char!==' ')result.push({x:x+(col+.5)*cellX,y:y+(row+.5)*cellY,char,size:Math.min(cellX/.6,cellY),alpha:1,u:(col+.5)/data.cols,v:(row+.5)/data.rows,leaf:'growth' in data?Number(data.growth[row][col]):0})
 }))
 return result
}
function scenePose(page: number,source: Point[],time: number,staticScene=false): Point[] {
 const entering=staticScene?1:smooth(time/1.65)
 const centerX=box.x+box.width/2,centerY=box.y+box.height/2
 return source.map((p,i)=>{
  const u=p.u??.5,v=p.v??.5
  if(page===1){
   const side=u<.5?-1:1
   const distance=Math.min(u,1-u)
   const wave=Math.sin(distance*26-time*2.15)
   const stream=staticScene?0:Math.max(0,wave)**3
   const glyphs=p.char==='@'||p.char==='%'?'@%':p.char==='#'||p.char==='*'?'#*':p.char==='+'||p.char==='='?'+=':p.char===':'||p.char==='-'?':-':p.char
   return {...p,x:p.x+side*width*.34*(1-entering)-side*stream*1.4,y:p.y+(staticScene?0:Math.sin(distance*18-time*1.3)*.65),char:stream>.55?glyphs[(Math.floor(time*3)+i)%glyphs.length]:p.char,alpha:staticScene?1:.67+stream*.33}
  }
  if(page===2){
   const angle=-.105+(staticScene?0:Math.sin(time*.65)*.014)
   const dx=p.x-centerX,dy=p.y-centerY
   const depth=1+(v-.5)*.11+(staticScene?0:Math.sin(time*.43)*.018)
   return {...p,x:centerX+(dx*Math.cos(angle)-dy*Math.sin(angle)+dy*.06)/depth,y:centerY+(dx*Math.sin(angle)+dy*Math.cos(angle)*.94)/depth+(staticScene?0:Math.sin(time*.9+u*2)*1.7),size:p.size/Math.sqrt(depth)}
  }
  if(page===3){
   if(staticScene)return p
   if(p.leaf){
    const anchor=anchors[p.leaf-1]
    const progress=smooth((time-(1.65+(1-anchor.v)*1.25+(p.leaf%2)*.12))/.95)
    const ax=box.x+anchor.u*box.width,ay=box.y+anchor.v*box.height
    return {...p,x:ax+(p.x-ax)*(.18+.82*progress),y:ay+(p.y-ay)*(.18+.82*progress),alpha:progress,size:p.size*(.7+.3*progress)}
   }
   const progress=smooth((time-(1-v)*1.75)/.36)
   return {...p,y:p.y+(1-progress)*7,alpha:v>.97?.6+.4*progress:progress}
  }
  return p
 })
}
function stopScene(){cancelAnimationFrame(raf);raf=0;lastTime=0}
function canRun(){return props.paged&&visible&&!document.hidden&&!paused.value&&!reduced.value}
function drawScene(){points=scenePose(props.page,base,age,reduced.value);paint()}
function tick(now:number){
 if(!canRun()||morphing||props.page===0){stopScene();return}
 if(!lastTime)lastTime=now
 const dt=now-lastTime
 if(dt>=1000/30){age+=Math.min(dt,80)/1000;lastTime=now;drawScene()}
 if(props.page===3&&age>=4.5){stopScene();if(canvas.value)canvas.value.dataset.motion='complete';return}
 raf=requestAnimationFrame(tick)
}
function playback(){
 if(!canRun()){stopScene();tween?.pause();return}
 if(morphing){tween?.resume();return}
 if(props.page>0&&!raf&&!(props.page===3&&age>=4.5))raf=requestAnimationFrame(tick)
}
function settle(restart=false){
 tween?.kill();playhead.value=1;morphing=false;stopScene()
 if(restart)age=paused.value||reduced.value?5:0
 base=props.page===0?[]:target(props.page)
 drawScene();emit('covering',false)
 if(canvas.value){canvas.value.dataset.morphing='false';canvas.value.dataset.motion=props.page===1?'flow':props.page===2?'tilt':props.page===3?(age>=4.5?'complete':'growth'):'still'}
 playback()
}
async function change(){
 if(!mounted)return
 await nextTick()
 stopScene()
 if(!props.paged){tween?.kill();morphing=false;points=[];base=[];measure();paint();emit('ready',false);emit('covering',false);lastPage=props.page;return}
 measure();emit('ready',true)
 const previous=lastPage;lastPage=props.page
 const from=previous===0&&!points.length?target(0):points.map(p=>({...p}))
 const raw=target(props.page)
 const to=scenePose(props.page,raw,0,reduced.value||paused.value)
 if(reduced.value||paused.value||previous===props.page||!to.length||!from.length){settle(previous!==props.page||age===0);return}
 tween?.kill();morphing=true;emit('covering',previous===0||props.page===0)
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
  points=pairs.map(({a,b,cx,cy})=>({x:u*u*a.x+2*u*t*cx+t*t*b.x,y:u*u*a.y+2*u*t*cy+t*t*b.y,size:a.size+(b.size-a.size)*t,char:t<.46?a.char:b.char,alpha:a.alpha+(b.alpha-a.alpha)*t}))
  paint()
 }
 frame()
 tween=gsap.to(playhead,{value:1,duration:1.45,ease:'power2.inOut',onUpdate:frame,onComplete:()=>settle(true)})
 if(!canRun())tween.pause()
}
function preference(){reduced.value=motion?.matches??false;if(reduced.value){age=Math.max(age,5);settle()}else playback()}
function scroll(){if(props.paged)settle()}
function toggle(){paused.value=!paused.value;if(paused.value&&morphing)settle(true);else playback()}
onMounted(()=>{
 if(!canvas.value)return
 ctx=canvas.value.getContext('2d');host=canvas.value.parentElement
 if(!ctx||!host)return
 mounted=true;lastPage=props.page
 motion=window.matchMedia('(prefers-reduced-motion: reduce)');reduced.value=motion.matches;motion.addEventListener('change',preference)
 document.addEventListener('visibilitychange',playback);host.addEventListener('scroll',scroll,true)
 resize=new ResizeObserver(()=>{const w=host!.clientWidth,h=host!.clientHeight;if(w!==width||h!==height){measure();settle()}});resize.observe(host)
 observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>.1;playback()},{threshold:[0,.1]});observer.observe(host)
 theme=new MutationObserver(()=>{measure();paint()});theme.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
 change()
})
watch(()=>[props.page,props.paged],change)
onBeforeUnmount(()=>{mounted=false;stopScene();tween?.kill();resize?.disconnect();observer?.disconnect();theme?.disconnect();motion?.removeEventListener('change',preference);document.removeEventListener('visibilitychange',playback);host?.removeEventListener('scroll',scroll,true)})
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
