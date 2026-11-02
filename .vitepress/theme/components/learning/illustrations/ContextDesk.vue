<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const cards = [{ title: '路径', icon: 'ti-folder' }, { title: '代码', icon: 'ti-code' }, { title: '规则', icon: 'ti-list-check' }, { title: '证据', icon: 'ti-photo' }]
const chosen = computed(() => cards.slice(0, frame.value + 1))
useLabPlayback(root, () => { frame.value++; return frame.value < 3 }, 1500, { reset: () => { frame.value = 0 }, static: () => { frame.value = 3 } })
</script>
<template>
  <div ref="root" class="context-desk" :data-demo-frame="frame">
    <LabFrame title="上下文 → 更少猜测">
      <div class="lab-stage">
        <div class="desk-shelf"><div v-for="(card,index) in cards" :key="card.title" class="desk-card" :class="{ active: index <= frame }"><i :class="['ti', card.icon]" aria-hidden="true" /><span>{{ card.title }}</span><i v-if="index <= frame" class="ti ti-check desk-check" aria-hidden="true" /></div></div>
        <div class="desk-connection" aria-hidden="true"><i class="ti ti-arrow-down" /></div>
        <div class="desk-tray"><i class="ti ti-stack-2" aria-hidden="true" /><div class="tray-notes"><span v-for="card in chosen" :key="card.title" class="lab-tag lab-enter">{{ card.title }}</span></div><span class="desk-result" :class="{ ready: frame >= 2 }">{{ frame < 2 ? '材料不足' : '可以开始' }}</span></div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.desk-shelf { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }.desk-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 8px; border: var(--mag-rule); border-radius: 8px; font-size: 14px; color: var(--lab-muted); }.desk-card > i:first-child { font-size: 28px; }.desk-card.active { color: var(--lab-blue); border-color: var(--mag-accent-border); background: var(--mag-accent-soft); }.desk-check { position: absolute; top: 8px; right: 8px; font-size: 13px; }.desk-connection { text-align: center; padding: 24px; color: var(--lab-blue); }.desk-tray { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; min-height: 108px; padding: 20px; border: var(--mag-rule); border-radius: 8px; }.desk-tray > i { font-size: 24px; color: var(--lab-blue); }.tray-notes { display: flex; flex-wrap: wrap; gap: 8px; }.desk-result { margin-left: auto; font-size: 13px; color: var(--lab-muted); }.desk-result.ready { color: var(--lab-blue); }@media(max-width:420px) { .desk-shelf { grid-template-columns: repeat(2,1fr); } }
</style>
