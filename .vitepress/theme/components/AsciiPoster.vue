<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import hands from '../ascii/creation/hands.json'
import prometheus from '../ascii/creation/prometheus.json'
import argo from '../ascii/creation/argo.json'
import handsMobile from '../ascii/creation/hands-mobile.json'
import prometheusMobile from '../ascii/creation/prometheus-mobile.json'
import argoMobile from '../ascii/creation/argo-mobile.json'
const props = withDefaults(defineProps<{ scene: 1 | 2 | 3; active?: boolean }>(), { active: true })
const posters = [hands,prometheus,argo]
const mobilePosters = [handsMobile,prometheusMobile,argoMobile]
const labels = {
  1: { title: '创造亚当', text: 'Fiat lux', lang: 'la', source: '《创世记》1:3，拉丁文译本' },
  2: { title: '普罗米修斯盗火', text: 'πῦρ ἐγώ σφιν ὤπασα.', lang: 'grc', source: '《被缚的普罗米修斯》第252行，古希腊语摘句' },
  3: { title: '阿尔戈号', text: 'Ἀργὼ πᾶσι μέλουσα', lang: 'grc', source: '荷马《奥德赛》12.70，古希腊语摘句' }
}
const fontActive = ref(false)
const tapped = ref(false)
let timer = 0
let touch: { x: number; y: number } | undefined
function touchStart(event: PointerEvent) {
  if (event.pointerType === 'touch') touch = { x: event.clientX, y: event.clientY }
}
function touchEnd(event: PointerEvent) {
  if (event.pointerType !== 'touch' || !touch) return
  const distance = Math.hypot(event.clientX - touch.x, event.clientY - touch.y)
  touch = undefined
  if (distance > 10) return
  fontActive.value = true
  tapped.value = true
  clearTimeout(timer)
  timer = window.setTimeout(() => { tapped.value = false }, 3500)
}
watch(() => props.active, active => {
  if (!active) { tapped.value = false; touch = undefined; clearTimeout(timer) }
})
onBeforeUnmount(() => clearTimeout(timer))
</script>
<template>
  <figure class="ascii-artwork" :class="{ 'has-caption-font': fontActive, 'is-caption-tapped': tapped }" tabindex="0" :aria-label="labels[scene].title" :aria-describedby="`ascii-caption-${scene}`" @pointerenter="fontActive = true" @focus="fontActive = true" @pointerdown="touchStart" @pointerup="touchEnd" @pointercancel="touch = undefined">
  <div class="ascii-slot" :data-ascii-slot="scene" aria-hidden="true">
    <svg v-for="(collection,index) in [posters,mobilePosters]" :key="index" class="ascii-poster" :class="index ? 'ascii-poster--mobile' : 'ascii-poster--desktop'" :viewBox="scene === 1 ? `5.76 0 ${(collection[0].cols-1.6)*7.2} ${collection[0].rows*12}` : `0 0 ${collection[props.scene-1].cols*7.2} ${collection[props.scene-1].rows*12}`" :preserveAspectRatio="scene === 1 ? 'none' : 'xMidYMid meet'" focusable="false"><text v-for="(line,i) in collection[props.scene-1].lines" :key="i" x="0" :y="i*12+10" xml:space="preserve">{{ line }}</text></svg>
  </div>
  <figcaption :id="`ascii-caption-${scene}`" class="ascii-caption"><span :lang="labels[scene].lang">{{ labels[scene].text }}</span><span class="ascii-caption__source">{{ labels[scene].source }}</span></figcaption>
  </figure>
</template>
<style scoped>
@font-face { font-family: 'Club Exhibition Serif'; src: url('/fonts/eb-garamond/latin.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD; }
@font-face { font-family: 'Club Exhibition Serif'; src: url('/fonts/eb-garamond/greek.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF; }
@font-face { font-family: 'Club Exhibition Serif'; src: url('/fonts/eb-garamond/greek-ext.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; unicode-range: U+1F00-1FFF; }
.ascii-artwork { position: relative; display: flow-root; width: 100%; min-width: 0; margin: 0; outline: none; }
.ascii-artwork:focus-visible { outline: 1px solid var(--mag-text-secondary); outline-offset: 5px; border-radius: 2px; }
.ascii-caption { position: relative; z-index: 4; min-height: 24px; margin-top: 10px; padding-inline: 16px; text-align: center; color: var(--mag-text-secondary); font: 400 16px/24px Georgia, 'Times New Roman', serif; font-synthesis: none; letter-spacing: .015em; opacity: 0; visibility: hidden; transform: translateY(4px); transition: opacity .24s ease, transform .3s ease, visibility 0s linear .3s; }
.has-caption-font .ascii-caption { font-family: 'Club Exhibition Serif', Georgia, 'Times New Roman', serif; }
.ascii-artwork:focus-visible .ascii-caption, .is-caption-tapped .ascii-caption { font-family: 'Club Exhibition Serif', Georgia, 'Times New Roman', serif; opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
@media (hover: hover) {
  .ascii-artwork:hover .ascii-caption { font-family: 'Club Exhibition Serif', Georgia, 'Times New Roman', serif; opacity: 1; visibility: visible; transform: none; transition-delay: .12s; }
}
.ascii-caption__source { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 700px) { .ascii-caption { font-size: 15px; margin-top: 8px; } }
@media (prefers-reduced-motion: reduce) { .ascii-caption { transform: none; transition: none; } }
@media print { .ascii-caption { opacity: 1; visibility: visible; transform: none; } }
.ascii-slot { width: 100%; min-width: 0; }
.ascii-poster { display: block; width: 100%; height: 100%; }
.ascii-poster text { fill: currentColor; font: 400 12px var(--mag-font-mono); white-space: pre; }
.ascii-poster--mobile { display: none; }
@media(max-width:700px) { .ascii-poster--desktop { display: none; }.ascii-poster--mobile { display: block; } }
</style>
