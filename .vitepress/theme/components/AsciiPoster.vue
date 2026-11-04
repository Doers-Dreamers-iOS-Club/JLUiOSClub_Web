<script setup lang="ts">
import hands from '../ascii/creation/hands.json'
import prometheus from '../ascii/creation/prometheus.json'
import argo from '../ascii/creation/argo.json'
import handsMobile from '../ascii/creation/hands-mobile.json'
import prometheusMobile from '../ascii/creation/prometheus-mobile.json'
import argoMobile from '../ascii/creation/argo-mobile.json'
const props = defineProps<{ scene: 1 | 2 | 3 }>()
const posters = [hands,prometheus,argo]
const mobilePosters = [handsMobile,prometheusMobile,argoMobile]
</script>
<template>
  <div class="ascii-slot" :data-ascii-slot="scene" aria-hidden="true">
    <svg v-for="(collection,index) in [posters,mobilePosters]" :key="index" class="ascii-poster" :class="index ? 'ascii-poster--mobile' : 'ascii-poster--desktop'" :viewBox="scene === 1 ? `5.76 0 ${(collection[0].cols-1.6)*7.2} ${collection[0].rows*12}` : `0 0 ${collection[props.scene-1].cols*7.2} ${collection[props.scene-1].rows*12}`" :preserveAspectRatio="scene === 1 ? 'none' : 'xMidYMid meet'" focusable="false"><text v-for="(line,i) in collection[props.scene-1].lines" :key="i" x="0" :y="i*12+10" xml:space="preserve">{{ line }}</text></svg>
  </div>
</template>
<style scoped>
.ascii-slot { width: 100%; min-width: 0; }
.ascii-poster { display: block; width: 100%; height: 100%; }
.ascii-poster text { fill: currentColor; font: 400 12px var(--mag-font-mono); white-space: pre; }
.ascii-poster--mobile { display: none; }
@media(max-width:700px) { .ascii-poster--desktop { display: none; }.ascii-poster--mobile { display: block; } }
</style>
