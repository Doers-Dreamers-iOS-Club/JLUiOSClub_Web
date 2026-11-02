<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const props = defineProps<{ kind: 'observe' | 'feedback' }>()
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const steps = computed(() => props.kind === 'observe' ? [{ title: '打开', icon: 'ti-browser' }, { title: '试玩', icon: 'ti-player-play' }, { title: '记录', icon: 'ti-notes' }] : [{ title: '操作', icon: 'ti-hand-click' }, { title: '实际结果', icon: 'ti-eye' }, { title: '预期结果', icon: 'ti-target' }])
useLabPlayback(root, () => { frame.value++; return frame.value < 2 }, 1300, { reset: () => { frame.value = 0 }, static: () => { frame.value = 2 } })
</script>
<template>
  <div ref="root" class="lesson-story" :data-demo-frame="frame">
    <LabFrame :title="kind === 'observe' ? '先试玩，再判断' : '让反馈可以复现'">
      <div class="lab-stage story-steps"><div v-for="(step,index) in steps" :key="step.title" class="story-step" :class="{ active: frame === index, passed: frame > index }"><i :class="['ti', step.icon]" aria-hidden="true" /><span>{{ step.title }}</span><i v-if="index < 2" class="ti ti-arrow-right story-arrow" aria-hidden="true" /></div></div>
    </LabFrame>
  </div>
</template>
<style scoped>
.story-steps { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 24px; }.story-step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px 8px; border-bottom: 2px solid var(--mag-hairline); color: var(--lab-muted); font-size: 13px; }.story-step > i:first-child { font-size: 40px; }.story-step.active { border-color: var(--lab-blue); color: var(--lab-blue); }.story-step.passed { border-color: var(--mag-accent-border); }.story-step .story-arrow { position: absolute; right: -20px; top: 44px; font-size: 16px; }@media(max-width:420px) { .story-steps { gap: 12px; }.story-step .story-arrow { right: -14px; }.story-step > i:first-child { font-size: 28px; } }
</style>
