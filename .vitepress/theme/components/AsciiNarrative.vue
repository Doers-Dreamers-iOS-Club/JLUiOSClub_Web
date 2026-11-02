<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import hands from '../ascii/creation/hands.json'
import making from '../ascii/creation/making.json'
import growing from '../ascii/creation/growing.json'
import handsMobile from '../ascii/creation/hands-mobile.json'
import makingMobile from '../ascii/creation/making-mobile.json'
import growingMobile from '../ascii/creation/growing-mobile.json'
type Point = { x: number; y: number; char: string; size: number; alpha: number }
type Snapshot = { points: Point[]; width: number; height: number }
const props = defineProps<{ page: number; paged: boolean; opening: () => Snapshot | null }>()
const emit = defineEmits<{ ready: [boolean]; covering: [boolean] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const scenes = [hands,making,growing]
const mobileScenes = [handsMobile,makingMobile,growingMobile]
let ctx: CanvasRenderingContext2D | null = null
let host: HTMLElement | null = null
let resize: ResizeObserver | undefined
let theme: MutationObserver | undefined
let motion: MediaQueryList | undefined
let tween: gsap.core.Tween | undefined
let width=0,height=0,ink='',font='monospace'
let points: Point[]=[]
let mounted=false
let lastPage=0
let openingCache: Snapshot | null = null
const playhead={value:1}
let frame = () => {}
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
 let size=0
 for(const p of points){if(p.alpha<.015)continue;const next=Math.round(p.size*2)/2;if(size!==next){size=next;ctx.font=`400 ${size}px ${font}`}ctx.globalAlpha=p.alpha;ctx.fillText(p.char,p.x,p.y)}
 ctx.globalAlpha=1
 if(canvas.value)canvas.value.dataset.points=String(points.length)
}
function target(page: number): Point[] {
 if(page===0){const shot=props.opening()||openingCache;if(!shot)return [];openingCache=shot;return shot.points.map(p=>({...p,x:p.x/shot.width*width,y:p.y/shot.height*height,size:p.size*Math.min(width/shot.width,height/shot.height)}))}
 const slot=host?.querySelector<HTMLElement>(`[data-ascii-slot="${page}"]`)
 if(!slot)return []
 let x=0,y=0,node:HTMLElement|null=slot
 while(node&&node!==host){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent as HTMLElement|null}
 for(let parent=slot.parentElement;parent&&parent!==host;parent=parent.parentElement){x-=parent.scrollLeft;y-=parent.scrollTop}
 const data=(width<=700?mobileScenes:scenes)[page-1]
 const cell=Math.min(slot.clientWidth/data.cols,slot.clientHeight/(data.rows/0.6))
 x+=(slot.clientWidth-data.cols*cell)/2;y+=(slot.clientHeight-data.rows*cell/.6)/2
 const result:Point[]=[]
 data.lines.forEach((line,row)=>Array.from(line).forEach((char,col)=>{if(char!==' ')result.push({x:x+(col+.5)*cell,y:y+(row+.5)*cell/.6,char,size:cell/.6,alpha:1})}))
 return result
}
function settle() {
 tween?.kill();playhead.value=1
 points=props.page===0?[]:target(props.page);paint();emit('covering',false)
 if(canvas.value)canvas.value.dataset.morphing='false'
}
async function change() {
 if(!mounted)return
 await nextTick()
 if(!props.paged){tween?.kill();points=[];measure();paint();emit('ready',false);emit('covering',false);lastPage=props.page;return}
 measure();emit('ready',true)
 const to=target(props.page)
 const previous=lastPage;lastPage=props.page
 if(motion?.matches||previous===props.page||!to.length){settle();return}
 const from=previous===0&&!points.length?target(0):points.map(p=>({...p}))
 if(!from.length){settle();return}
 tween?.kill();emit('covering',previous===0||props.page===0)
 if(canvas.value)canvas.value.dataset.morphing='true'
 if(canvas.value){canvas.value.dataset.from=String(previous);canvas.value.dataset.to=String(props.page);canvas.value.dataset.sourcePoints=String(from.length)}
 const count=Math.max(from.length,to.length)
 const origin=from.slice().sort((a,b)=>a.x-b.x||a.y-b.y)
 const destination=to.slice().sort((a,b)=>a.x-b.x||a.y-b.y)
 const pairs=Array.from({length:count},(_,i)=>{
  const a=origin[i%origin.length],b=destination[i%destination.length]
  const random=Math.sin(i*127.1+previous*37)*43758.5453;const noise=random-Math.floor(random)
  return {a:{...a,alpha:i<origin.length?a.alpha:0},b:{...b,alpha:i<destination.length?1:0},cx:(a.x+b.x)/2+(noise-.5)*Math.min(width*.5,450),cy:(a.y+b.y)/2+Math.sin(i*7.7)*Math.min(height*.3,180)}
 })
 playhead.value=0
 frame=()=>{
  const t=playhead.value, u=1-t
  points=pairs.map(({a,b,cx,cy})=>({x:u*u*a.x+2*u*t*cx+t*t*b.x,y:u*u*a.y+2*u*t*cy+t*t*b.y,size:a.size+(b.size-a.size)*t,char:t<.46?a.char:b.char,alpha:a.alpha+(b.alpha-a.alpha)*t}))
  paint()
 }
 frame()
 tween=gsap.to(playhead,{value:1,duration:1.45,ease:'power2.inOut',onUpdate:frame,onComplete:settle})
 if(document.hidden)tween.pause()
}
function visibility(){if(document.hidden)tween?.pause();else tween?.resume()}
function preference(){if(motion?.matches)settle()}
function scroll(){if(props.paged)settle()}
onMounted(()=>{
 if(!canvas.value)return
 ctx=canvas.value.getContext('2d');host=canvas.value.parentElement
 if(!ctx||!host)return
 mounted=true;lastPage=props.page
 motion=window.matchMedia('(prefers-reduced-motion: reduce)');motion.addEventListener('change',preference)
 document.addEventListener('visibilitychange',visibility)
 host.addEventListener('scroll',scroll,true)
 resize=new ResizeObserver(()=>{measure();settle()});resize.observe(host)
 theme=new MutationObserver(()=>{measure();paint()});theme.observe(document.documentElement,{attributes:true,attributeFilter:['class']})
 change()
})
watch(()=>[props.page,props.paged],change)
onBeforeUnmount(()=>{mounted=false;tween?.kill();resize?.disconnect();theme?.disconnect();motion?.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);host?.removeEventListener('scroll',scroll,true)})
</script>
<template><canvas ref="canvas" class="ascii-narrative" aria-hidden="true" data-morphing="false" /></template>
<style scoped>
.ascii-narrative { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; }
@media print { .ascii-narrative { display: none; } }
</style>
