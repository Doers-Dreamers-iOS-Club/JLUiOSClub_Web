<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
import { useLabPlayback } from './useLabPlayback'
const props = defineProps<{ kind: 'observe' | 'feedback' }>()
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const moves = computed(() => Math.max(0, frame.value - 5))
const steps = [{ title: '打开', icon: 'ti-browser' }, { title: '试玩', icon: 'ti-player-play' }, { title: '记录', icon: 'ti-notes' }]
useLabPlayback(root, () => { frame.value++; return frame.value < (props.kind === 'feedback' ? 15 : 2) }, props.kind === 'feedback' ? 500 : 1300, { reset: () => { frame.value = 0 }, static: () => { frame.value = props.kind === 'feedback' ? 14 : 2 } })
</script>
<template>
  <div ref="root" class="lesson-story" :data-demo-frame="frame">
    <LabFrame :title="kind === 'observe' ? '先试玩，再判断' : '让反馈可以复现'">
      <div v-if="kind === 'feedback'" class="lab-stage feedback-demo" :aria-label="frame < 5 ? '先选择标准档，再重新开始' : `重开后，实际仍按轻松档移动 ${moves} 格，预期标准档移动 ${moves * 2} 格`">
        <div class="feedback-actions" aria-hidden="true">
          <div class="feedback-setting" :class="{ selected: frame >= 2 }"><i class="ti ti-adjustments-horizontal" /><span>{{ frame < 2 ? '轻松' : '标准' }}</span><i v-if="frame === 1" class="ti ti-pointer feedback-pointer" /></div>
          <i class="ti ti-arrow-right feedback-arrow" />
          <div class="feedback-restart" :class="{ pressed: frame === 4 }"><i class="ti ti-refresh" /><span>重开</span><i v-if="frame === 3 || frame === 4" class="ti ti-pointer feedback-pointer" :class="{ clicking: frame === 4 }" /><span v-if="frame === 4" class="feedback-click" /></div>
        </div>
        <div class="feedback-fork" aria-hidden="true"><i class="ti ti-arrows-split" /></div>
        <div class="feedback-results">
          <div v-for="(label,index) in ['实际结果','预期结果']" :key="label" class="feedback-result" :class="{ running: frame >= 5, actual: index === 0 }">
            <div class="feedback-result__heading"><span>{{ label }}</span><span :class="{ 'feedback-speed': frame >= 5 }">{{ frame < 5 ? '待重开' : index === 0 ? '仍是轻松' : '应为标准' }}</span></div>
            <SnakeScene :position="moves * (index + 1)" :food="false" :label="`${label}，${index === 0 ? '轻松档' : '标准档'}`" />
            <div class="feedback-distance" aria-hidden="true"><span class="feedback-meter"><i :style="{ transform: `scaleX(${moves * (index + 1) / 20})` }" /></span><span><b>{{ moves * (index + 1) }}</b> 格</span></div>
          </div>
        </div>
      </div>
      <div v-else class="lab-stage story-steps"><div v-for="(step,index) in steps" :key="step.title" class="story-step" :class="{ active: frame === index, passed: frame > index }"><i :class="['ti', step.icon]" aria-hidden="true" /><span>{{ step.title }}</span><i v-if="index < 2" class="ti ti-arrow-right story-arrow" aria-hidden="true" /></div></div>
    </LabFrame>
  </div>
</template>
<style scoped>
.story-steps { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 24px; }.story-step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 24px 8px; border-bottom: 2px solid var(--mag-hairline); color: var(--lab-muted); font-size: 13px; }.story-step > i:first-child { font-size: 40px; }.story-step.active { border-color: var(--lab-blue); color: var(--lab-blue); }.story-step.passed { border-color: var(--mag-accent-border); }.story-step .story-arrow { position: absolute; right: -20px; top: 44px; font-size: 16px; }@media(max-width:420px) { .story-steps { gap: 12px; }.story-step .story-arrow { right: -14px; }.story-step > i:first-child { font-size: 28px; } }
.feedback-actions { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 4px 0 8px; }
.feedback-setting, .feedback-restart { position: relative; display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 108px; height: 44px; border: var(--mag-rule); border-radius: 8px; font-size: 14px; color: var(--lab-muted); }
.feedback-setting.selected, .feedback-restart.pressed { color: var(--lab-blue); border-color: var(--mag-accent-border); background: var(--mag-accent-soft); }
.feedback-arrow { color: var(--lab-muted); font-size: 16px; }
.feedback-pointer { position: absolute; right: 3px; bottom: -12px; z-index: 1; font-size: 24px; color: var(--lab-ink); animation: feedback-point .4s ease-out both; }
.feedback-pointer.clicking { animation: feedback-press .35s ease both; }
.feedback-click { position: absolute; right: -3px; bottom: -7px; width: 24px; height: 24px; border: 1px solid var(--lab-blue); border-radius: 50%; animation: feedback-click .5s ease-out both; }
.feedback-fork { display: flex; justify-content: center; padding: 14px 0; color: var(--lab-muted); font-size: 24px; }
.feedback-results { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; }
.feedback-result { min-width: 0; }
.feedback-result :deep(.lab-snake rect[rx="5"]), .feedback-result :deep(.lab-snake circle[r="2"]) { transition: x .45s linear, y .45s linear, cx .45s linear, cy .45s linear; }
.feedback-result__heading { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px 12px; font-size: 13px; margin-bottom: 12px; }
.feedback-result__heading > span:last-child { color: var(--lab-muted); }
.feedback-result.running .feedback-speed { color: var(--lab-blue); }
.feedback-result.running.actual .feedback-speed { color: var(--mag-warn); }
.feedback-distance { display: flex; align-items: center; gap: 12px; margin-top: 14px; font-size: 12px; color: var(--lab-muted); font-variant-numeric: tabular-nums; }
.feedback-distance > span:last-child { width: 38px; text-align: right; flex: none; }
.feedback-meter { flex: 1; height: 3px; background: var(--mag-hairline); }
.feedback-meter i { display: block; height: 100%; background: var(--lab-blue); transform-origin: left; transition: transform .4s linear; }
.feedback-result.actual .feedback-meter i { background: var(--mag-warn); }
@keyframes feedback-point { from { opacity: 0; transform: translate(12px,10px); } to { opacity: 1; transform: translate(0,0); } }
@keyframes feedback-press { 50% { transform: scale(.8); } }
@keyframes feedback-click { from { opacity: 1; transform: scale(.5); } to { opacity: 0; transform: scale(1.8); } }
@media(max-width:480px) { .feedback-actions { gap: 12px; }.feedback-setting, .feedback-restart { min-width: 84px; font-size: 13px; }.feedback-results { grid-template-columns: 1fr; gap: 24px; }.feedback-distance { gap: 6px; } }
</style>
