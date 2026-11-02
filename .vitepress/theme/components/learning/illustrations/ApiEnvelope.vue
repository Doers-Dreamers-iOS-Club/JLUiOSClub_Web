<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const phase = ref(0)
const scenario = ref(0)
const failed = computed(() => scenario.value === 1 && phase.value >= 2 || scenario.value === 2 && phase.value >= 3)
const result = computed(() => failed.value ? scenario.value === 1 ? '认证失败' : '模型不匹配' : phase.value >= 5 ? '响应已返回' : ['准备请求','发送','认证','模型','返回'][phase.value])
function reset() { phase.value = 0; scenario.value = (scenario.value + 1) % 3 }
useLabPlayback(root, () => { phase.value++; return phase.value < 5 && !failed.value }, 1100, { reset, static: () => { scenario.value = 0; phase.value = 5 } })
</script>
<template>
  <div ref="root" class="api-envelope" :data-demo-frame="`${scenario}:${phase}`">
    <LabFrame title="请求 → 响应">
      <div class="lab-stage">
        <div class="lab-two">
          <div class="api-card"><i class="ti ti-mail" aria-hidden="true" /><div class="api-fields"><span v-for="(field,index) in ['地址','凭证','模型','消息']" :key="field" :class="{ active: phase === index + 1, failed: failed && phase === index + 1 }">{{ field }}</span></div></div>
          <div class="api-card" :class="{ received: phase >= 4 && !failed, failed }"><i :class="['ti', failed ? 'ti-file-x' : phase >= 5 ? 'ti-file-check' : 'ti-file']" aria-hidden="true" /><div class="api-lines" aria-hidden="true"><span v-for="i in 3" :key="i" :class="{ arrived: !failed && (phase === 5 || phase === 4 && i < 3) }" /></div></div>
        </div>
        <div class="api-flight" aria-hidden="true"><span class="api-mail" :style="{ left: [0,20,40,60,80,100][phase] + '%' }"><i class="ti ti-mail" /></span></div>
        <div class="api-result" :class="{ failed }" data-result>{{ result }}</div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.api-card { display: grid; justify-items: center; gap: 24px; padding: 24px 16px; min-height: 190px; border: var(--mag-rule); border-radius: 8px; color: var(--lab-muted); }.api-card > i { font-size: 64px; }.api-card.received { color: var(--lab-blue); border-color: var(--mag-accent-border); }.api-fields { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 13px; }.api-fields .active { color: var(--lab-blue); }.api-lines { width: 72%; display: grid; gap: 8px; }.api-lines span { height: 4px; border-radius: 4px; background: var(--mag-hairline); transition: background .3s; }.api-lines span:last-child { width: 65%; }.api-lines .arrived { background: var(--lab-blue); }.api-flight { position: relative; height: 1px; margin: 36px 16px 24px; background: var(--mag-hairline-strong); }.api-mail { position: absolute; top: -12px; transform: translateX(-50%); color: var(--lab-blue); background: var(--lab-paper); font-size: 24px; transition: left .8s ease; }.api-result { text-align: center; color: var(--lab-blue); font-size: 13px; padding: 8px 0; }.failed,.api-fields .failed { color: var(--mag-warn); }@media(max-width:600px) { .api-envelope .lab-two { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }.api-card { padding: 20px 8px; }.api-card > i { font-size: 44px; }.api-fields { gap: 8px; font-size: 12px; } }
</style>
