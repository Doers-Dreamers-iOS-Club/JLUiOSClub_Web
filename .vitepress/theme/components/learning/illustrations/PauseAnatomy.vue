<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const position = ref(0)
const state = computed(() => frame.value === 0 ? '待开始' : frame.value >= 5 && frame.value <= 7 ? '已暂停' : frame.value >= 11 ? '已结束' : '运行中')
function reset() { frame.value = 0; position.value = 0 }
useLabPlayback(root, () => { frame.value++; if (state.value === '运行中') position.value++; return frame.value < 11 }, 650, { reset, static: () => { frame.value = 5; position.value = 4 } })
</script>
<template>
  <div ref="root" class="pause-anatomy" :data-demo-frame="frame">
    <LabFrame title="暂停与继续">
      <div class="lab-stage lab-two">
        <SnakeScene :position="position" :score="position" :label="state" />
        <div class="anatomy-layers">
          <div><span>位置</span><b data-position>{{ position }}</b></div>
          <div><span>触发器</span><div class="anatomy-pulses"><i v-for="i in 8" :key="i" :class="{ active: state === '运行中' && i === position % 8 + 1 }" /></div></div>
          <div><span>状态</span><b data-state>{{ state }}</b></div>
        </div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.anatomy-layers { align-self: center; display: grid; gap: 24px; padding: 16px; }.anatomy-layers > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 14px; }.anatomy-layers span { color: var(--lab-muted); }.anatomy-layers b { color: var(--lab-blue); font-variant-numeric: tabular-nums; }.anatomy-pulses { display: flex; gap: 4px; }.anatomy-pulses i { width: 10px; height: 20px; background: var(--mag-hairline); border-radius: 3px; }.anatomy-pulses .active { background: var(--lab-blue); }
</style>
