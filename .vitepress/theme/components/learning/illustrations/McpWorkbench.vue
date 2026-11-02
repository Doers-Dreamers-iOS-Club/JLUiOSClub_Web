<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import DemoGame from './DemoGame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const loaded = computed(() => frame.value >= 4)
const started = computed(() => frame.value >= 8)
const paused = computed(() => frame.value >= 14)
const step = computed(() => Math.max(0,Math.min(6,frame.value-8)))
const calls = [{ name: '打开页面', icon: 'ti-world', at: 1, done: 4 },{ name: '读取控件', icon: 'ti-list-search', at: 5, done: 6 },{ name: '点击开始', icon: 'ti-hand-click', at: 7, done: 9 },{ name: '点击暂停', icon: 'ti-player-pause', at: 13, done: 15 }]
useLabPlayback(root, () => { frame.value++; return frame.value < 19 }, 600, { reset: () => { frame.value = 0 }, static: () => { frame.value = 19 } })
</script>
<template>
  <div ref="root" class="mcp-workbench" :data-demo-frame="frame">
    <LabFrame title="让工具真的操作一次" hint="Agent 通过 MCP 调用浏览器工具，打开本地游戏、读取控件、点击开始和暂停，再取得工具返回结果。">
      <div class="lab-stage mcp-stage">
        <div class="tool-journal"><div class="journal-heading"><i class="ti ti-message" aria-hidden="true" />Agent <span>MCP</span></div><div v-for="call in calls" :key="call.name" class="tool-call" :class="{ issued: frame >= call.at, done: frame >= call.done }"><i :class="['ti',call.icon]" aria-hidden="true" /><span>{{ call.name }}</span><i :class="['ti', frame >= call.done ? 'ti-check' : 'ti-point']" aria-hidden="true" /></div><div class="tool-receipt" :class="{ received: frame >= 17 }"><i class="ti ti-checks" aria-hidden="true" />已返回 · 暂停中</div></div>
        <div class="tool-browser">
          <div class="browser-address"><i class="ti ti-browser" aria-hidden="true" /><span>127.0.0.1:8000</span><i class="ti ti-lock-open" aria-hidden="true" /></div>
          <div class="browser-content"><div class="browser-loading" :class="{ hidden: loaded }" aria-hidden="true"><i class="ti ti-world" /><span /></div><div class="browser-game" :class="{ loaded }"><DemoGame :step="step" :paused="paused" /><div class="browser-controls"><span :class="{ targeted: frame >= 6 && frame < 10, pressed: frame === 8 }">{{ started ? '进行中' : '开始' }}</span><span :class="{ targeted: frame >= 12, pressed: frame === 14 }">{{ paused ? '继续' : '暂停' }}</span></div><i class="ti ti-pointer tool-pointer" :class="{ visible: frame >= 7 && frame <= 15, atPause: frame >= 12 }" aria-hidden="true" /></div></div>
          <div class="browser-observed"><i :class="['ti', frame >= 16 ? 'ti-camera' : 'ti-point']" aria-hidden="true" /><span>{{ frame >= 16 ? '位置不再变化' : loaded ? 'snake-lab' : '正在打开' }}</span></div>
        </div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.mcp-stage { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 28px; align-items: center; }.journal-heading { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 18px; }.journal-heading > span { margin-left: auto; color: var(--lab-blue); font-size: 11px; border-bottom: 1px solid var(--mag-accent-border); }.tool-call { display: flex; align-items: center; gap: 10px; min-height: 42px; color: var(--lab-muted); font-size: 12px; opacity: .3; transition: opacity .4s; }.tool-call > i:last-child { margin-left: auto; }.tool-call.issued { opacity: 1; }.tool-call.done > i { color: var(--lab-blue); }.tool-receipt { display: flex; align-items: center; gap: 8px; color: var(--lab-blue); font-size: 12px; padding-top: 16px; border-top: var(--mag-rule); margin-top: 16px; opacity: 0; transform: translateX(10px); transition: transform .5s,opacity .5s; }.tool-receipt.received { opacity: 1; transform: none; }.tool-browser { overflow: hidden; border: var(--mag-rule); border-radius: 10px; }.browser-address { display: flex; align-items: center; gap: 8px; padding: 12px; border-bottom: var(--mag-rule); font-size: 11px; color: var(--lab-muted); }.browser-address > i:last-child { margin-left: auto; }.browser-content { position: relative; padding: 14px; }.browser-loading { position: absolute; inset: 0; display: grid; align-content: center; justify-items: center; gap: 16px; transition: opacity .4s; color: var(--lab-muted); }.browser-loading > i { font-size: 32px; }.browser-loading > span { width: 80px; height: 2px; background: var(--mag-accent-border); }.browser-loading.hidden { opacity: 0; }.browser-game { position: relative; opacity: 0; transition: opacity .4s; }.browser-game.loaded { opacity: 1; }.browser-controls { display: flex; justify-content: center; gap: 12px; margin-top: 12px; }.browser-controls > span { padding: 6px 16px; border: var(--mag-rule); border-radius: 6px; font-size: 12px; color: var(--lab-muted); transition: transform .2s,background .2s; }.browser-controls > .targeted { border-color: var(--mag-accent-border); color: var(--lab-blue); }.browser-controls > .pressed { transform: scale(.94); background: var(--mag-accent-soft); }.tool-pointer { position: absolute; bottom: -6px; left: 30%; font-size: 25px; color: var(--lab-blue); opacity: 0; transition: transform .65s ease,opacity .3s; pointer-events: none; }.tool-pointer.visible { opacity: 1; }.tool-pointer.atPause { transform: translateX(90px); }.browser-observed { display: flex; gap: 8px; padding: 10px 14px; border-top: var(--mag-rule); font-size: 11px; color: var(--lab-blue); }@media(max-width:520px) { .mcp-stage { grid-template-columns: 1fr; gap: 20px; }.tool-journal { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }.journal-heading,.tool-receipt { grid-column: 1/-1; }.journal-heading { margin-bottom: 8px; }.tool-call { min-height: 32px; }.tool-receipt { margin-top: 8px; padding-top: 10px; }.tool-pointer.atPause { transform: translateX(78px); } }
</style>
