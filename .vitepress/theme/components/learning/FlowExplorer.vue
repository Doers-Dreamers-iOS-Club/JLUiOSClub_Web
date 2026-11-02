<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Kind = 'debug' | 'skill' | 'mcp' | 'api'
const props = withDefaults(defineProps<{ kind?: Kind }>(), { kind: 'debug' })
const flows: Record<Kind, { title: string; nodes: [string, string][] }> = {
  debug: { title: '一次修改，怎样闭环？', nodes: [
    ['复现', '写下具体操作、预期结果和实际结果。例如：保持同一速度档，连续重新开始三次，蛇却越跑越快。'],
    ['定位', '让 AI 阅读相关文件、追踪重新开始的逻辑和计时器，先解释证据，再提出原因。'],
    ['小步修复', '只修改与问题相关的计时逻辑。检查重建前是否清理旧计时器，避免多个计时器同时运行。'],
    ['回归验证', '重复多次重新开始，再检查轻松、标准两档速度，以及暂停、继续、得分和碰撞；确认没有破坏其他行为。'],
    ['保存', '检查差异，记录验证结果，再保存或提交这次改动。AI 说完成不等于验证完成。'],
  ] },
  skill: { title: '方法与工具，各自做什么？', nodes: [
    ['提出任务', '用户要求检查现有贪吃蛇的速度、暂停和重新开始行为，并说明预期结果。'],
    ['读取 Skill', 'Skill 提供可复用的方法与检查清单，例如先读代码、给出计划、再验证。它不会凭空赋予工具权限。'],
    ['选择工具', 'Agent 按方法选择已经可用、已获授权的工具，例如读文件、修改代码或运行终端。'],
    ['执行检查', '工具执行具体操作，返回文件内容、修改结果或测试输出；Agent 根据证据继续。'],
    ['交付结果', '说明改了什么、验证了什么、还有哪些限制。Skill 是做事方法，工具提供操作能力。'],
  ] },
  mcp: { title: 'MCP：一次浏览器工具调用', nodes: [
    ['用户', '用户要求检查本地贪吃蛇页面，明确要观察开始、暂停、继续和重新开始。'],
    ['Agent', 'Agent 判断需要浏览器工具，并选择已连接服务提供的合适操作。'],
    ['Host / Client', '宿主应用中的 MCP Client 按协议，把工具调用交给对应的 MCP Server。'],
    ['MCP Server', '服务端接收调用，连接其负责的能力。这里以浏览器自动化服务为例。'],
    ['浏览器', '浏览器打开页面、点击按钮或读取页面状态。MCP 本身并不是浏览器。'],
    ['返回结果', '结果沿服务端和客户端返回给 Agent，Agent 据此判断行为，再向用户解释。'],
  ] },
  api: { title: '一句话，怎样成为 API 响应？', nodes: [
    ['输入消息', '用户在客户端输入问题，例如“请解释这个速度切换函数”。'],
    ['客户端', '客户端整理对话、模型选择等参数，准备发送到配置的服务地址。'],
    ['请求与认证', '请求携带服务要求的认证信息。API Key 是凭证，不应放进网页源码或公开仓库。'],
    ['服务商', '服务商验证请求、检查权限与额度，并让所选模型处理消息。'],
    ['响应与展示', '客户端接收结果并显示。认证失败、地址错误和额度不足需要分别排查。'],
  ] },
}
const flow = computed(() => flows[props.kind] ?? flows.debug)
const current = ref(0)
const running = ref(false)
const reducedMotion = ref(false)
const panel = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined
let motion: MediaQueryList | undefined
let visible = true
function pause() { if (timer !== undefined) clearInterval(timer); timer = undefined; running.value = false }
function advance() {
  if (current.value < flow.value.nodes.length - 1) current.value++
  if (current.value === flow.value.nodes.length - 1) pause()
}
function select(index: number) { pause(); current.value = index }
function start() {
  pause()
  if (reducedMotion.value || document.hidden || !visible) return
  if (current.value === flow.value.nodes.length - 1) current.value = 0
  running.value = true
  timer = setInterval(advance, 3500)
}
function next() { pause(); advance() }
function onVisibility() { if (document.hidden) pause() }
function onMotion() { reducedMotion.value = motion?.matches ?? false; if (reducedMotion.value) pause() }
watch(() => props.kind, () => select(0))
onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  onMotion()
  motion.addEventListener('change', onMotion)
  document.addEventListener('visibilitychange', onVisibility)
  if ('IntersectionObserver' in window && panel.value) {
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) pause() })
    observer.observe(panel.value)
  }
})
onBeforeUnmount(() => {
  pause(); observer?.disconnect()
  motion?.removeEventListener('change', onMotion)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <section ref="panel" class="flow-explorer mag-no-reveal" :aria-label="flow.title">
    <strong class="flow-explorer__title">{{ flow.title }}</strong>
    <p class="flow-explorer__intro">点击节点逐步阅读，或播放观察信息如何流动。</p>
    <ol class="flow-explorer__path">
      <li v-for="(node, index) in flow.nodes" :key="node[0]" :class="{ 'flow-explorer__passed': index < current, 'flow-explorer__playing': running && index === current }">
        <button type="button" :aria-current="current === index ? 'step' : undefined" :aria-label="`第 ${index + 1} 步：${node[0]}`" @click="select(index)"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ node[0] }}</button>
        <span v-if="index < flow.nodes.length - 1" class="flow-explorer__arrow" aria-hidden="true">→</span>
      </li>
    </ol>
    <div class="flow-explorer__explanation" role="status" aria-atomic="true"><strong>{{ current + 1 }} / {{ flow.nodes.length }} · {{ flow.nodes[current][0] }}</strong><p>{{ flow.nodes[current][1] }}</p></div>
    <div class="flow-explorer__controls">
      <button type="button" :disabled="reducedMotion" :aria-pressed="running" @click="running ? pause() : start()">{{ running ? '暂停' : current === flow.nodes.length - 1 ? '重新播放' : '播放' }}</button>
      <button type="button" :disabled="current === flow.nodes.length - 1" @click="next">下一步</button>
      <button type="button" @click="select(0)">重置</button>
    </div>
    <p v-if="reducedMotion" class="flow-explorer__intro">已启用减少动态效果：请点击节点或「下一步」。</p>
  </section>
</template>

<style scoped>
.flow-explorer { margin: var(--mag-space-xl) 0; padding: var(--mag-space-lg); background: var(--mag-surface); color: var(--mag-text); border: var(--mag-rule); border-radius: var(--mag-radius-lg); }
.flow-explorer__intro { color: var(--mag-text-secondary); font-size: var(--mag-fs-small); }
.flow-explorer .flow-explorer__path { display: flex; list-style: none; padding: 0; margin: var(--mag-space-lg) 0; }
.flow-explorer__path li { display: flex; align-items: center; flex: 1; min-width: 0; margin: 0; }
.flow-explorer button { min-height: 44px; border: var(--mag-rule-strong); border-radius: var(--mag-radius-sm); padding: 8px 12px; background: var(--mag-surface); color: var(--mag-text); font: inherit; cursor: pointer; }
.flow-explorer__path button { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px; flex: 1; min-width: 0; min-height: 92px; padding: 8px 3px; font-size: var(--mag-fs-micro); line-height: 1.5; overflow-wrap: anywhere; }
.flow-explorer__path button span { font-family: var(--mag-font-mono); color: var(--mag-text-secondary); }
.flow-explorer__path button[aria-current="step"] { color: var(--mag-accent); border-color: var(--mag-accent); background: var(--mag-accent-soft); }
.flow-explorer__passed button { border-color: var(--mag-accent-border); }
.flow-explorer__arrow { position: relative; flex: 0 0 18px; text-align: center; color: var(--mag-text-secondary); }
.flow-explorer__playing .flow-explorer__arrow::after { content: ''; position: absolute; width: 4px; height: 4px; bottom: 0; left: 0; border-radius: var(--mag-radius-pill); background: var(--mag-accent); animation: flow-explorer-pulse 1.2s linear infinite; }
@keyframes flow-explorer-pulse { from { transform: translateX(0); opacity: .35; } to { transform: translateX(14px); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .flow-explorer__playing .flow-explorer__arrow::after { animation: none; } }
.flow-explorer__passed .flow-explorer__arrow { color: var(--mag-accent); }
.flow-explorer__explanation { padding: var(--mag-space-md); min-height: 130px; border-radius: var(--mag-radius-md); background: var(--mag-surface-sunken); font-size: var(--mag-fs-small); }
.flow-explorer__explanation p { margin: var(--mag-space-xs) 0 0; }
.flow-explorer__controls { display: flex; flex-wrap: wrap; gap: var(--mag-space-xs); margin-top: var(--mag-space-md); }
.flow-explorer button:hover { border-color: var(--mag-accent); }
.flow-explorer button:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.flow-explorer button:disabled { opacity: .55; cursor: default; }
@media (max-width: 600px) {
  .flow-explorer { padding: var(--mag-space-md); }
  .flow-explorer .flow-explorer__path { flex-direction: column; }
  .flow-explorer__path li { flex-direction: column; }
  .flow-explorer__path button { flex-direction: row; width: 100%; min-height: 44px; gap: 12px; font-size: var(--mag-fs-small); }
  .flow-explorer__arrow { transform: rotate(90deg); line-height: 24px; }
}
</style>
