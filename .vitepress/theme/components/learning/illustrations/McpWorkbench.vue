<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const phase = ref(0)
const scenario = ref(0)
const nodes = [{ name: 'Agent', icon: 'ti-message' }, { name: 'MCP', icon: 'ti-server' }, { name: '浏览器', icon: 'ti-browser' }, { name: '网页', icon: 'ti-layout' }]
const failed = computed(() => scenario.value === 1 && phase.value >= 2 || scenario.value === 2 && phase.value >= 4)
const result = computed(() => failed.value ? scenario.value === 1 ? '未连接' : '网页离线' : phase.value >= 7 ? '检查完成' : phase.value >= 5 ? '返回结果' : '调用工具')
const active = computed(() => [0,0,1,2,3,3,2,0][phase.value])
const point = computed(() => [12.5,12.5,37.5,62.5,87.5,87.5,62.5,12.5][phase.value])
function nextRun() { phase.value = 0; scenario.value = (scenario.value + 1) % 3 }
useLabPlayback(root, () => { phase.value++; return phase.value < 7 && !failed.value }, 900, { reset: nextRun, static: () => { scenario.value = 0; phase.value = 7 } })
</script>
<template>
  <div ref="root" class="mcp-workbench" :data-demo-frame="`${scenario}:${phase}`">
    <LabFrame title="工具调用的往返">
      <div class="lab-stage">
        <div class="mcp-nodes"><div v-for="(node,index) in nodes" :key="node.name" class="mcp-node" :class="{ active: active === index, failed: failed && active === index }"><i :class="['ti', node.icon]" aria-hidden="true" /><span>{{ node.name }}</span></div></div>
        <div class="mcp-track" aria-hidden="true"><span class="mcp-packet" :class="{ returning: phase >= 5, failed }" :style="{ left: point + '%' }" /></div>
        <div class="mcp-result" :class="{ failed }" data-result><i :class="['ti', failed ? 'ti-plug-x' : phase === 7 ? 'ti-check' : phase >= 5 ? 'ti-arrow-left' : 'ti-arrow-right']" aria-hidden="true" />{{ result }}</div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.mcp-nodes { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }.mcp-node { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 4px; border: var(--mag-rule); border-radius: 8px; font-size: 13px; color: var(--lab-muted); }.mcp-node > i { font-size: 32px; }.mcp-node.active { color: var(--lab-blue); border-color: var(--mag-accent-border); background: var(--mag-accent-soft); }.mcp-node.failed { color: var(--mag-warn); border-color: var(--mag-warn); }.mcp-track { position: relative; margin: 32px 0; height: 2px; background: var(--mag-hairline); }.mcp-packet { position: absolute; width: 12px; height: 12px; top: -5px; transform: translateX(-50%); border-radius: 50%; background: var(--lab-blue); border: 2px solid var(--lab-blue); transition: left .65s ease; }.mcp-packet.returning { background: var(--lab-paper); }.mcp-packet.failed { background: var(--mag-warn); border-color: var(--mag-warn); }.mcp-result { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: var(--lab-blue); min-height: 28px; }.mcp-result.failed { color: var(--mag-warn); }@media(max-width:420px) { .mcp-nodes { gap: 6px; }.mcp-node { font-size: 12px; padding-block: 18px; }.mcp-node > i { font-size: 24px; } }
</style>
