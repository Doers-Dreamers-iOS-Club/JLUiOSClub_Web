<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ step: number; kind?: 'snake' | 'bricks'; paused?: boolean }>(), { kind: 'snake', paused: false })
const route = [...Array.from({ length: 10 }, (_, i) => [24 + i * 26, 30]), ...Array.from({ length: 4 }, (_, i) => [258, 56 + i * 26]), ...Array.from({ length: 9 }, (_, i) => [232 - i * 26, 134]), ...Array.from({ length: 3 }, (_, i) => [24, 108 - i * 26])]
const snake = computed(() => Array.from({ length: 4 }, (_, i) => route[((props.step + 3 - i) % 26 + 26) % 26]))
const flight = [[160,130],[180,105],[200,80],[220,55],[220,48],[200,75],[180,100],[160,130]]
const ball = computed(() => flight[props.step % 8])
</script>
<template>
  <div class="demo-game" :data-position="step" :data-kind="kind" :data-paused="paused">
    <svg viewBox="0 0 300 170" role="img" :aria-label="`${kind === 'snake' ? '贪吃蛇' : '打砖块'}${paused ? '，已暂停' : '，试玩画面'}`">
      <rect x="1" y="1" width="298" height="168" rx="8" fill="var(--lab-desk)" />
      <g v-if="kind === 'snake'">
        <g v-for="(xy,i) in snake" :key="i" class="game-piece" :style="{ transform: `translate(${xy[0]}px, ${xy[1]}px)` }"><rect x="-9" y="-9" width="18" height="18" rx="5" fill="var(--lab-blue)" :opacity="1 - i * .18" /><circle v-if="i === 0" cx="3" cy="-3" r="2" fill="var(--lab-paper)" /></g>
        <rect x="145" y="79" width="10" height="10" rx="3" fill="var(--lab-blue)" opacity=".3" />
      </g>
      <g v-else>
        <rect v-for="i in 12" :key="i" :x="20 + ((i-1)%6)*44" :y="20 + Math.floor((i-1)/6)*22" width="38" height="14" rx="3" fill="var(--lab-blue)" :opacity="i === 11 && step % 8 >= 4 ? 0 : .22 + Math.floor((i-1)/6)*.2" class="brick" />
        <circle class="game-piece" r="5" fill="var(--lab-blue)" :style="{ transform: `translate(${ball[0]}px, ${ball[1]}px)` }" />
        <rect x="130" y="140" width="60" height="6" rx="3" fill="var(--lab-blue)" />
      </g>
    </svg>
    <i v-if="paused" class="ti ti-player-pause game-paused" aria-hidden="true" />
  </div>
</template>
<style scoped>
.demo-game { position: relative; min-width: 0; }.game-piece { transition: transform .45s linear; }.brick { transition: opacity .25s; }.game-paused { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); padding: 10px; border-radius: 50%; color: var(--lab-blue); background: var(--lab-paper); font-size: 24px; }
</style>
