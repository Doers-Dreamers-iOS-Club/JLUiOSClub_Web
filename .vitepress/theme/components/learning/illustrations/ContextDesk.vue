<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const read = computed(() => frame.value >= 3)
const lines = ['const speed = 120', 'function restart() {', '  start(speed)', '}']
useLabPlayback(root, () => { frame.value++; return frame.value < 12 }, 650, { reset: () => { frame.value = 0 }, static: () => { frame.value = 12 } })
</script>
<template>
  <div ref="root" class="context-desk" :data-demo-frame="frame" :data-read="read">
    <LabFrame title="从路径，到真正读懂" hint="路径帮助定位；读到的代码、明确的要求和实际反馈，才成为本轮可用的上下文。">
      <div class="lab-stage context-stage">
        <div class="context-location"><i class="ti ti-folder" aria-hidden="true" /> snake-lab <span>/ index.html</span><i :class="['ti', read ? 'ti-check' : 'ti-search']" aria-hidden="true" /></div>
        <div class="context-layout">
          <div class="source-sheet" :class="{ opened: read }">
            <div class="sheet-label">{{ read ? '已读取' : '待读取' }}<i class="ti ti-file-code" aria-hidden="true" /></div>
            <div class="source-lines"><div v-for="(line,i) in lines" :key="line" :class="{ focused: read && (i === 0 || i === 2) }"><small>{{ i+1 }}</small><code v-if="read">{{ line }}</code><span v-else class="unread-line" :style="{ width: [70,90,60,20][i] + '%' }" /></div></div>
            <div class="source-scan" :style="{ transform: `translateY(${Math.min(frame,3)*32}px)`, opacity: frame > 0 && frame < 4 ? 1 : 0 }" />
          </div>
          <div class="context-margin">
            <div class="context-note" :class="{ visible: frame >= 5 }"><i class="ti ti-message" aria-hidden="true" /><span>增加轻松档</span></div>
            <div class="context-note" :class="{ visible: frame >= 7 }"><i class="ti ti-repeat" aria-hidden="true" /><span>重开保留档位</span></div>
            <div class="context-note evidence" :class="{ visible: frame >= 9 }"><i class="ti ti-eye" aria-hidden="true" /><span>重开仍是旧速度</span><div class="speed-proof" aria-hidden="true"><span /><span /></div></div>
          </div>
        </div>
        <div class="context-summary" :class="{ ready: frame >= 11 }"><i :class="['ti', frame >= 11 ? 'ti-focus-2' : 'ti-dots']" aria-hidden="true" /><span>{{ frame >= 11 ? '定位到重开逻辑' : read ? '补齐这次任务' : '路径只是起点' }}</span><div class="context-meter" aria-hidden="true"><span :style="{ transform: `scaleX(${Math.min(frame,11)/11})` }" /></div></div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.context-location { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--lab-muted); margin-bottom: 24px; flex-wrap: wrap; }.context-location > i:last-child { margin-left: auto; color: var(--lab-blue); }.context-layout { display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; align-items: center; }.source-sheet { position: relative; border: var(--mag-rule); border-radius: 8px 8px 16px 8px; padding: 16px; overflow: hidden; }.sheet-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--lab-muted); margin-bottom: 20px; }.opened .sheet-label { color: var(--lab-blue); }.source-lines > div { display: flex; align-items: center; gap: 12px; height: 32px; white-space: pre; }.source-lines small { color: var(--lab-muted); font-size: 11px; }.source-lines code { font-size: 12px; padding: 0; background: transparent; color: var(--lab-muted); }.source-lines .focused code { color: var(--lab-blue); }.unread-line { height: 5px; background: var(--mag-hairline); border-radius: 3px; }.source-scan { position: absolute; top: 64px; left: 12px; right: 12px; height: 30px; background: var(--mag-accent-soft); border-left: 2px solid var(--lab-blue); transition: transform .6s ease, opacity .3s; pointer-events: none; }.context-margin { display: grid; gap: 18px; }.context-note { display: flex; gap: 10px; align-items: center; opacity: 0; transform: translateY(12px); transition: opacity .45s, transform .45s; font-size: 13px; flex-wrap: wrap; }.context-note.visible { opacity: 1; transform: none; }.context-note > i { color: var(--lab-blue); font-size: 18px; }.speed-proof { width: 100%; padding-left: 28px; display: grid; gap: 6px; }.speed-proof span { height: 4px; border-radius: 3px; width: 42%; background: var(--lab-blue); }.speed-proof span:last-child { width: 78%; opacity: .25; }.context-summary { display: flex; align-items: center; gap: 10px; margin-top: 28px; font-size: 13px; color: var(--lab-muted); }.context-summary.ready { color: var(--lab-blue); }.context-meter { flex: 1; height: 2px; background: var(--mag-hairline); margin-left: 12px; }.context-meter span { display: block; height: 100%; background: var(--lab-blue); transform-origin: left; transition: transform .6s; }@media(max-width:500px) { .context-layout { grid-template-columns: 1fr; gap: 22px; }.context-margin { min-height: 116px; gap: 12px; }.context-location { margin-bottom: 16px; } }
</style>
