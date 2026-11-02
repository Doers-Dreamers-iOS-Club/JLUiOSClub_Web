<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const clean = ref(0)
const buggy = ref(0)
const fixed = computed(() => frame.value >= 10)
const count = computed(() => fixed.value ? 1 : frame.value >= 6 ? 3 : frame.value >= 3 ? 2 : 1)
function reset() { frame.value = 0; clean.value = 0; buggy.value = 0 }
useLabPlayback(root, () => { frame.value++; clean.value++; buggy.value += count.value; return frame.value < 14 }, 750, { reset, static: () => { frame.value = 7; clean.value = 7; buggy.value = 14 } })
</script>
<template>
  <div ref="root" class="timer-microscope" :data-demo-frame="frame">
    <LabFrame title="重复计时 → 越跑越快">
      <div class="lab-stage">
        <div class="lab-two">
          <div class="timer-column"><span class="lab-caption">正常 · 1 个循环</span><SnakeScene :position="clean" :food="false" label="正常" /><div class="timer-tracks"><i v-for="n in 8" :key="n" :class="{ on: n === frame % 8 + 1 }" /></div><span class="lab-caption"><b data-clean>{{ clean }}</b> 步</span></div>
          <div class="timer-column"><span class="lab-caption" data-timer-count>{{ fixed ? '已清理' : '重复' }} · {{ count }} 个循环</span><SnakeScene :position="buggy" :food="false" :label="fixed ? '已修复' : '重复计时'" /><div class="timer-track-stack"><div v-for="i in count" :key="i" class="timer-tracks"><i v-for="n in 8" :key="n" :class="{ on: n === frame % 8 + 1 }" /></div></div><span class="lab-caption"><b data-buggy>{{ buggy }}</b> 步</span></div>
        </div>
        <div class="lab-progress" aria-hidden="true"><span v-for="(label,index) in ['运行','重开','再重开','清理']" :key="label" :class="{ active: index === (fixed ? 3 : count-1) }">{{ label }}</span></div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.timer-column { display: grid; gap: 12px; }.timer-tracks { display: flex; gap: 4px; height: 12px; }.timer-tracks i { flex: 1; border-radius: 3px; background: var(--mag-hairline); }.timer-tracks .on { background: var(--lab-blue); }.timer-track-stack { display: grid; align-content: start; gap: 4px; height: 44px; }.timer-column > .timer-tracks { margin-bottom: 32px; }
</style>
