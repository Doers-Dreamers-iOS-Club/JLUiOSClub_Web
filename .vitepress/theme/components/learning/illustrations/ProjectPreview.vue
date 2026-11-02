<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const phase = ref(0)
const scenes = ['等待开始', '开始', '得分', '碰壁结束', '重新开始']
const rule = computed(() => phase.value < 3 ? 0 : phase.value === 3 ? 1 : 2)
const body = computed(() => {
  const head = [126, 174, 222, 280, 126][phase.value]
  return [head, head - 24, head - 48, head - 72]
})
useLabPlayback(root, () => { phase.value++; return phase.value < 4 }, 1300, { reset: () => { phase.value = 0 }, static: () => { phase.value = 3 } })
</script>
<template>
  <div ref="root" class="project-preview" :data-demo-frame="phase">
    <LabFrame title="规则 → 游戏">
      <div class="lab-stage preview-layout">
        <div class="preview-rules" aria-label="游戏规则">
          <div v-for="(label,index) in ['点击开始','撞墙结束','重开清零']" :key="label" class="preview-rule" :class="{ active: rule === index }"><i :class="['ti', ['ti-player-play','ti-square','ti-refresh'][index]]" aria-hidden="true" /><span>{{ label }}</span><i class="ti ti-arrow-right" aria-hidden="true" /></div>
        </div>
        <div class="preview-game">
        <span class="preview-score" aria-hidden="true">{{ phase === 2 || phase === 3 ? 10 : 0 }} 分</span>
        <svg viewBox="0 0 320 245" role="img" :aria-label="`${scenes[phase]}，${phase === 2 || phase === 3 ? 10 : 0} 分`">
          <rect x="1" y="1" width="318" height="243" rx="12" fill="var(--lab-paper)" stroke="var(--mag-hairline-strong)" /><path d="M1 34h318" stroke="var(--mag-hairline)" /><circle cx="16" cy="17" r="3" fill="var(--lab-blue)" />
          <rect x="22" y="50" width="276" height="137" rx="6" fill="var(--lab-desk)" /><path d="M292 60v115" :stroke="phase === 3 ? 'var(--mag-warn)' : 'var(--mag-hairline-strong)'" stroke-width="2" stroke-dasharray="4 5" />
          <rect v-for="(x,index) in body" :key="index" class="preview-segment" :x="x-10" y="108" width="20" height="20" rx="5" fill="var(--lab-blue)" :opacity="1-index*.17" /><circle class="preview-segment" :cx="body[0]+3" cy="114" r="2" fill="var(--lab-paper)" />
        </svg>
        <span class="preview-scene" :class="{ ended: phase === 3 }" aria-hidden="true">{{ scenes[phase] }}</span>
        </div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.preview-layout { display: grid; grid-template-columns: minmax(130px, .7fr) minmax(0, 1.3fr); align-items: center; gap: 24px; }
.preview-game { position: relative; }.preview-score { position: absolute; top: 3%; right: 7%; font-size: 12px; color: var(--lab-muted); }.preview-scene { position: absolute; bottom: 7%; left: 0; width: 100%; text-align: center; font-size: 13px; color: var(--lab-blue); }.preview-scene.ended { color: var(--mag-warn); }
.preview-rules { display: grid; gap: 16px; }.preview-rule { display: flex; align-items: center; gap: 12px; color: var(--lab-muted); font-size: 14px; padding: 16px 0; border-bottom: var(--mag-rule); }.preview-rule > i:last-child { margin-left: auto; opacity: 0; }.preview-rule.active { color: var(--lab-blue); }.preview-rule.active > i:last-child { opacity: 1; }.preview-segment { transition: x .7s ease, cx .7s ease; }
@media(max-width:600px) { .preview-layout { grid-template-columns: 1fr; gap: 20px; }.preview-rules { grid-template-columns: repeat(3, 1fr); gap: 8px; }.preview-rule { flex-direction: column; padding: 8px 0; gap: 6px; font-size: 12px; }.preview-rule > i:last-child { display: none; } }
</style>
