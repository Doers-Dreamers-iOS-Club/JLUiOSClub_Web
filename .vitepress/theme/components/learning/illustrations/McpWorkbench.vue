<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const connected = ref(false)
const pageReady = ref(false)
const phase = ref(0)
const result = ref('')
const inspected = ref(0)
const names = ['Agent 所在应用','MCP 服务','浏览器工具','本地网页']
const details = [
  ['输入：检查开始与暂停。', '输出：选择可用工具，交给宿主中的 MCP Client 调用。'],
  ['输入：客户端的工具调用。', '输出：调用浏览器能力，将结果交回客户端。'],
  ['输入：打开网址或点击按钮。', '输出：页面信息、操作结果，或页面不可达的错误。'],
  ['输入：浏览器发来的访问和操作。', '输出：实际的游戏界面及当前按钮状态。'],
]
const messages = ['先接入服务、启动网页，再执行一次检查。','Agent 选择浏览器工具，宿主客户端准备发出调用。','调用到达 MCP 服务，由服务处理工具请求。','浏览器尝试打开本地游戏地址。','页面已打开，找到开始、暂停和重开按钮。','点击开始：示意游戏进入运行中。','点击暂停：画面停止，工具把观察结果沿原路返回。','Agent 收到实际操作的结果，再判断是否符合任务。']
function advance() {
  if (result.value) return false
  phase.value++
  if (phase.value === 2 && !connected.value) { result.value = '服务未连接：应用尚无这项浏览器工具可调用。先检查 MCP 服务连接。'; return false }
  if (phase.value === 4 && !pageReady.value) { result.value = '网页未启动：工具连接正常，但浏览器打不开本地地址。请检查网页服务、端口和目录。'; return false }
  if (phase.value === 7) { result.value = '检查完成：开始后进入运行中，暂停后停止更新。工具结果已返回给 Agent。'; return false }
  return phase.value < 7
}
const { playing, reduced, play, pause, step } = useLabPlayback(root, advance, 750)
function clearRun() { pause(); phase.value = 0; result.value = '' }
function preset(service: boolean, page: boolean) { clearRun(); connected.value = service; pageReady.value = page }
function execute() { clearRun(); if (reduced.value) advance(); else play() }
function reset() { preset(false,false); inspected.value = 0 }
const error = computed(() => !!result.value && phase.value < 7)
const point = computed(() => error.value && phase.value === 2 ? [130,100] : error.value && phase.value === 4 ? [450,100] : [[68,100],[68,100],[220,100],[372,100],[524,100],[524,100],[372,196],[68,196]][Math.min(phase.value,7)])
const active = computed(() => phase.value >= 6 ? 0 : Math.min(3, Math.max(0,phase.value-1)))
</script>
<template>
  <div ref="root" class="mcp-workbench">
    <LabFrame eyebrow="06 / FOLLOW THE CONNECTION" title="连上工具，为什么页面还是打不开？" hint="换一种连接情境，再跟随调用点找到结果或故障所在的那一层。">
      <div class="lab-controls mcp-presets" aria-label="连接情境"><button type="button" :aria-pressed="!connected && !pageReady" @click="preset(false,false)">服务未连接</button><button type="button" :aria-pressed="connected && !pageReady" @click="preset(true,false)">网页未启动</button><button type="button" :aria-pressed="connected && pageReady" @click="preset(true,true)">全部就绪</button></div>
      <div class="lab-stage">
        <div class="mcp-status"><span :class="{ ready: connected }">MCP 服务：{{ connected ? '已接入' : '未接入' }}</span><span :class="{ ready: pageReady }">本地网页：{{ pageReady ? '已启动' : '未启动' }}</span></div>
        <svg viewBox="0 0 592 240" role="img" :aria-label="`应用通过 MCP 服务调用浏览器，浏览器操作本地网页。${result || messages[phase]}`">
          <path d="M68 100H524" fill="none" stroke="var(--mag-hairline-strong)" stroke-width="2" :stroke-dasharray="connected ? undefined : '5 6'" />
          <path d="M524 140V196H68V140" fill="none" stroke="var(--mag-accent-border)" stroke-width="2" />
          <path d="m145 95 7 5-7 5m152-10 7 5-7 5m152-10 7 5-7 5m-150 86-7 5 7 5m-152-10-7 5 7 5" fill="none" stroke="var(--lab-blue)" stroke-width="2" />
          <g v-for="(name,i) in names" :key="name" :transform="`translate(${i*152+20},52)`">
            <rect width="96" height="88" rx="12" :fill="active === i && phase ? 'var(--mag-accent-soft)' : 'var(--lab-paper)'" :stroke="active === i && phase ? 'var(--lab-blue)' : 'var(--mag-hairline-strong)'" />
            <g v-if="i === 0" stroke="var(--lab-blue)" fill="none" stroke-width="2"><rect x="25" y="16" width="46" height="32" rx="4" /><path d="M36 55h24m-12-7v7M32 27h12m-12 7h26" /></g>
            <g v-else-if="i === 1" stroke="var(--lab-blue)" fill="none" stroke-width="2"><rect x="26" y="16" width="44" height="18" rx="4" /><rect x="26" y="40" width="44" height="18" rx="4" /><path d="M34 25h4m-4 24h4m10-24h15m-15 24h15" /></g>
            <g v-else-if="i === 2" stroke="var(--lab-blue)" fill="none" stroke-width="2"><rect x="23" y="16" width="50" height="40" rx="4" /><path d="M23 27h50m-41-6h2m5 0h2m5 14 14 6-8 3-4 8z" /></g>
            <g v-else stroke="var(--lab-blue)" fill="none" stroke-width="2"><rect x="24" y="16" width="48" height="40" rx="4" /><path d="M32 44h13V32h14" stroke-width="5" stroke-linecap="round" /></g>
            <text x="48" y="75" text-anchor="middle" font-size="10" fill="var(--lab-muted)">{{ ['Host / Client','MCP Server','Browser','Local page'][i] }}</text>
          </g>
          <g v-if="phase" class="mcp-packet" :style="{ transform: `translate(${point[0]}px,${point[1]}px)` }"><circle r="9" :fill="phase >= 6 ? 'var(--lab-paper)' : error ? 'var(--mag-warn)' : 'var(--lab-blue)'" :stroke="error ? 'var(--mag-warn)' : 'var(--lab-blue)'" stroke-width="3" /></g>
          <text x="296" y="226" text-anchor="middle" font-size="11" fill="var(--lab-muted)">实心点：调用 · 空心点：结果返回</text>
        </svg>
        <div class="lab-tabs mcp-nodes" aria-label="查看节点的输入与输出"><button v-for="(name,i) in names" :key="name" type="button" :aria-pressed="inspected === i" @click="inspected = i">{{ name }}</button></div>
        <div class="lab-paper"><p v-for="line in details[inspected]" :key="line" class="lab-caption">{{ line }}</p><p v-if="phase >= 5 && !error" class="lab-caption">示意网页：{{ phase === 5 ? '运行中' : '已暂停' }}</p></div>
      </div>
      <template #controls><button type="button" :aria-pressed="connected" @click="clearRun(); connected = !connected">{{ connected ? '断开服务' : '接入服务' }}</button><button type="button" :aria-pressed="pageReady" @click="clearRun(); pageReady = !pageReady">{{ pageReady ? '停止网页' : '启动本地网页' }}</button><button type="button" @click="execute">{{ result ? '重新检查' : '执行检查' }}</button><button type="button" :disabled="!playing" @click="pause">暂停动画</button><button type="button" :disabled="!!result" @click="step">下一步</button><button type="button" @click="reset">重置</button></template>
      <template #observation><p :class="{ 'mcp-error': error }" data-result>{{ result || messages[phase] }}</p></template>
      <template #footer>连接过程示意，不会连接真实服务或操作你的浏览器。{{ reduced ? '减少动态效果下，执行检查只推进一步；继续点“下一步”查看。' : '连接正常不等于作品正确，仍要查看实际操作返回的结果。' }}</template>
    </LabFrame>
  </div>
</template>
<style scoped>
.mcp-presets { padding-top: 0; }.mcp-status { display: flex; flex-wrap: wrap; gap: .5rem; font-size: .75rem; }.mcp-status span { background: var(--lab-paper); border: var(--mag-rule); border-radius: 6px; padding: .3rem .55rem; }.mcp-status .ready { color: var(--lab-blue); }.mcp-packet { transition: transform .6s ease-in-out; }.mcp-nodes { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }.mcp-error { color: var(--mag-warn); }
</style>
