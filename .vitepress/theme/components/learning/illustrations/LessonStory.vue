<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLabPlayback } from './useLabPlayback'
import './lab.css'
const props = defineProps<{ kind: 'observe' | 'feedback' }>()
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const observe = ['先打开第一版，按约定试玩。','点开始、吃食物、撞墙、重开，分别观察。','写下一个具体发现，留给下一次修改。']
const feedback = ['“还是不对”留下了许多猜测。','补上操作顺序、实际结果、预期结果。','把这条证据带回对话，再检查修改后的行为。']
const lines = computed(() => props.kind === 'observe' ? observe : feedback)
const { playing, reduced, play, pause, step } = useLabPlayback(root, () => { frame.value = Math.min(2,frame.value+1); return frame.value < 2 }, 1300)
function replay() { pause(); frame.value = 0; play() }
</script>
<template>
  <aside ref="root" class="lesson-lab lesson-story mag-no-reveal" :aria-label="kind === 'observe' ? '观察第一版的三幕手记' : '把观察带回对话的三幕手记'">
    <div class="story-scene">
      <svg viewBox="0 0 240 130" role="img" :aria-label="lines[frame]"><rect x="15" y="18" width="114" height="85" rx="7" fill="var(--lab-paper)" stroke="var(--mag-hairline-strong)" /><path d="M15 35h114m-98-8h4m5 0h4" stroke="var(--lab-blue)" /><path :d="frame === 0 ? 'M36 80h24V59h26' : 'M50 80h24V59h26'" fill="none" stroke="var(--lab-blue)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" /><path d="M135 67h24m-6-6 7 6-7 6" stroke="var(--lab-blue)" fill="none" /><g :key="frame" class="lab-enter"><rect x="168" y="26" width="59" height="82" rx="3" fill="var(--mag-accent-soft)" stroke="var(--mag-accent-border)" /><path d="M179 47h32m-32 13h32m-32 13h24" stroke="var(--lab-blue)" :opacity="frame ? 1 : .2" stroke-width="2" /><path v-if="frame === 2" d="m180 89 6 5 13-14" stroke="var(--lab-blue)" stroke-width="2" fill="none" /></g></svg>
      <div><span class="lab-eyebrow">{{ kind === 'observe' ? 'FIELD NOTE / 试玩之后' : 'FIELD NOTE / 有效反馈' }}</span><p role="status">{{ lines[frame] }}</p><div class="story-controls"><button type="button" :disabled="reduced" @click="playing ? pause() : replay()">{{ playing ? '暂停' : '播放三幕' }}</button><button type="button" :disabled="frame === 2" @click="step">下一幕</button><button type="button" @click="pause(); frame = 0">重置</button></div></div>
    </div>
  </aside>
</template>
<style scoped>
.lesson-story { border-radius: 10px; }.story-scene { display: grid; grid-template-columns: 190px 1fr; gap: 1rem; padding: 1rem; align-items: center; background: var(--lab-desk); }.story-scene p { margin: .4rem 0 .7rem; font-size: .9rem; }.story-controls { display: flex; flex-wrap: wrap; gap: .4rem; }.story-controls button { font-size: .75rem; padding: .3rem .65rem; }@media(max-width:600px) { .story-scene { grid-template-columns: 1fr; }.story-scene svg { width: 210px; margin: auto; } }
</style>
