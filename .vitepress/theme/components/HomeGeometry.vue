<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
const props = withDefaults(defineProps<{ active: boolean; mode?: number; community?: boolean }>(), { mode: 0, community: false })
const root = ref<HTMLElement | null>(null)
type Pose = [number, number, number]
const arrangements: Pose[][] = [
  [[190,150,0],[262,208,0],[164,260,0],[300,94,0],[100,210,0],[102,96,-12]],
  [[196,158,-45],[278,112,45],[182,256,-20],[100,98,0],[106,220,-90],[302,230,12]],
  [[204,166,90],[280,240,0],[110,150,90],[296,88,0],[108,250,90],[106,76,0]],
  [[174,168,180],[268,142,12],[218,256,0],[94,94,0],[100,248,-90],[292,68,-12]]
]
const together: Pose[] = [[200,168,0],[244,212,0],[181,258,0],[281,112,0],[118,202,0],[129,102,-12]]
const initial = props.community ? together : arrangements[0]
let context: gsap.Context | undefined
let timeline: gsap.core.Timeline | undefined
let observer: IntersectionObserver | undefined
let preference: MediaQueryList | undefined
let visible = false
let mounted = false
let currentMode = -1
let entered = false
function update() {
  if (!mounted || !root.value) return
  const pieces = root.value.querySelectorAll<SVGGElement>('.geometry-piece')
  const pose = props.community ? together : arrangements[props.mode]
  const canPlay = props.active && visible && !document.hidden
  if (!canPlay) { timeline?.pause(); if (!props.active || !visible) entered = false; return }
  if (preference?.matches) {
    timeline?.kill()
    context?.add(() => pieces.forEach((piece,i) => gsap.set(piece, { x: pose[i][0], y: pose[i][1], rotation: pose[i][2], opacity: 1 })))
    currentMode = props.mode
    entered = true
    return
  }
  if (entered && currentMode === props.mode) { timeline?.resume(); return }
  timeline?.kill()
  const entrance = !entered
  currentMode = props.mode
  entered = true
  context?.add(() => {
    timeline = gsap.timeline({ defaults: { duration: entrance ? 1.25 : .75, ease: 'power3.inOut' } })
    pieces.forEach((piece,i) => {
      const [x,y,rotation] = pose[i]
      if (entrance) gsap.set(piece, { x: x + (i%2 ? 32 : -32), y: y + (i<3 ? -18 : 18), rotation: rotation + (i%2 ? 18 : -18), opacity: .3 })
      timeline!.to(piece, { x,y,rotation,opacity: 1 }, entrance ? i*.055 : 0)
    })
  })
}
onMounted(() => {
  mounted = true
  context = gsap.context(() => {}, root.value!)
  preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change',update)
  document.addEventListener('visibilitychange',update)
  observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio > .1; update() },{threshold:[0,.1]})
  observer.observe(root.value!)
  update()
})
watch(() => [props.active,props.mode],update)
onBeforeUnmount(() => { mounted = false; observer?.disconnect(); preference?.removeEventListener('change',update); document.removeEventListener('visibilitychange',update); context?.revert() })
</script>
<template>
  <div ref="root" class="home-geometry" :class="{ 'home-geometry--community': community }" :data-mode="mode" aria-hidden="true">
    <svg viewBox="0 0 400 340" focusable="false">
      <g class="geometry-guides"><path d="M42 54h12m-6-6v12 M346 286h12m-6-6v12" /><circle cx="200" cy="170" r="132" stroke-dasharray="1 9" /></g>
      <g v-for="(pose,i) in initial" :key="i" class="geometry-piece" :transform="`translate(${pose[0]} ${pose[1]}) rotate(${pose[2]})`">
        <circle v-if="i === 0" r="66" class="geometry-ring" stroke-dasharray="311 104" transform="rotate(-45)" />
        <rect v-else-if="i === 1" x="-29" y="-29" width="58" height="58" rx="14" class="geometry-solid" />
        <rect v-else-if="i === 2" x="-44" y="-5" width="88" height="10" rx="5" class="geometry-bar" />
        <circle v-else-if="i === 3" r="9" class="geometry-solid" />
        <path v-else-if="i === 4" d="M-21-23v46h42" class="geometry-angle" />
        <rect v-else x="-23" y="-23" width="46" height="46" rx="10" class="geometry-tile" />
      </g>
    </svg>
  </div>
</template>
<style scoped>
.home-geometry { width: 100%; max-width: 440px; margin-inline: auto; }
.home-geometry svg { display: block; width: 100%; height: auto; overflow: visible; }
.geometry-guides { fill: none; stroke: var(--mag-hairline-strong); stroke-width: 1; }
.geometry-ring { fill: none; stroke: var(--mag-accent); stroke-width: 2; }
.geometry-solid { fill: var(--mag-accent); }
.geometry-bar { fill: var(--mag-text); }
.geometry-angle { fill: none; stroke: var(--mag-text); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.geometry-tile { fill: var(--mag-accent-soft); stroke: var(--mag-accent-border); stroke-width: 1; }
.home-geometry--community { max-width: 270px; }
.home-geometry--community .geometry-guides { display: none; }
@media(max-width:700px) { .home-geometry { max-width: 220px; }.home-geometry--community { max-width: 230px; } }
</style>
