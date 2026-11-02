<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const scenario = ref('ok')
const phase = ref(0)
const selected = ref('address')
const chunked = ref(false)
const responseParts = ref(0)
const fields = { address: ['服务地址', '请求送到哪里。这里使用 example.invalid，仅作图示。'], key: ['认证凭证', '服务按要求验证身份。这里只展示虚构占位符，不填写真实密钥。'], model: ['模型', '这次希望服务调用哪个模型，必须与提供商支持的配置相符。'], message: ['消息', '请求中包含的问题和相关上下文。响应是服务返回的信息。'] }
const explanations = ['点击信封字段认识它们，再发送一条预设示例。','客户端把地址、认证、模型与消息组织成请求。','服务收到请求，检查认证信息。','认证通过，检查所选模型是否匹配。','服务处理消息，开始返回响应。','响应已返回，客户端把内容显示出来。']
const error = computed(() => scenario.value === 'auth' && phase.value >= 2 ? '认证示例失败：先核对凭证与提供商是否对应。请求没有进入模型处理。' : scenario.value === 'model' && phase.value >= 3 ? '模型示例失败：认证通过，但所选模型不匹配。应按同一提供商的说明核对模型。' : '')
const response = 'API 是程序交换信息的接口。客户端组织请求，服务处理后返回响应。'
function advance() { if (phase.value >= 5 || error.value) return false; phase.value++; if (phase.value === 4) responseParts.value = 1; if (phase.value === 5) responseParts.value = 2; return phase.value < 5 && !error.value }
const { playing, reduced, play, pause, step } = useLabPlayback(root, advance, 900)
function resetRun() { pause(); phase.value = 0; responseParts.value = 0 }
function toggleDisplay() { chunked.value = !chunked.value; if (chunked.value && phase.value >= 4 && !error.value) responseParts.value = 1 }
function send() { resetRun(); if (reduced.value) advance(); else play() }
function reset() { resetRun(); scenario.value = 'ok'; selected.value = 'address'; chunked.value = false }
const displayResponse = computed(() => error.value ? '此次示例没有成功响应。' : phase.value < 4 ? '等待示例响应…' : chunked.value && responseParts.value === 1 ? 'API 是程序交换信息的接口。' : response)
</script>
<template>
  <div ref="root" class="api-envelope">
    <LabFrame eyebrow="API / INSIDE THE ENVELOPE" title="一条消息，怎样完成一次往返？" hint="翻开信封字段，换一种预设配置，观察请求在哪一步成功或停止。">
      <div class="lab-controls api-presets"><label>示例配置 <select v-model="scenario" @change="resetRun"><option value="ok">正常配置</option><option value="auth">认证失败</option><option value="model">模型不匹配</option></select></label><button type="button" :aria-pressed="chunked" @click="toggleDisplay">{{ chunked ? '分段展示' : '完整展示' }}</button></div>
      <div class="lab-stage">
        <div class="lab-two"><div class="envelope-paper lab-paper"><span class="lab-eyebrow">REQUEST / 发出去的信</span><svg viewBox="0 0 260 130" role="img" aria-label="请求信封：地址、认证、模型和消息"><rect x="20" y="15" width="220" height="100" rx="8" fill="var(--mag-accent-soft)" stroke="var(--lab-blue)" /><path d="m20 20 110 66L240 20M20 115l70-54m150 54-70-54" fill="none" stroke="var(--mag-accent-border)" stroke-width="2" /><rect x="189" y="30" width="30" height="35" rx="3" fill="var(--lab-paper)" stroke="var(--lab-blue)" /><path d="M197 41h14m-14 7h14m-14 7h8" stroke="var(--lab-blue)" /></svg><div class="api-fields"><button v-for="(field,key) in fields" :key="key" type="button" :aria-pressed="selected === key" @click="selected = key">{{ field[0] }}</button></div><p class="lab-caption">{{ fields[selected as keyof typeof fields][1] }}</p></div><div class="lab-paper response-paper"><span class="lab-eyebrow">RESPONSE / 收到的回信</span><svg viewBox="0 0 260 130" role="img" :aria-label="error ? '请求在处理环节停止' : phase >= 4 ? '响应返回' : '等待响应'"><path d="M45 115V17h122l48 40v58Z" fill="var(--lab-desk)" stroke="var(--mag-hairline-strong)" /><path d="M167 17v40h48" fill="none" stroke="var(--mag-hairline-strong)" /><g v-if="phase >= 4 && !error" :key="phase" class="lab-enter" stroke="var(--lab-blue)" stroke-width="4" stroke-linecap="round"><path d="M68 48h72m-72 20h123" /><path v-if="!chunked || responseParts === 2" d="M68 88h105" /></g><path v-else-if="error" d="m110 54 34 34m0-34-34 34" stroke="var(--mag-warn)" stroke-width="4" /></svg><p class="api-response" data-response>{{ displayResponse }}</p><button v-if="chunked && phase === 5 && responseParts === 1 && !error" type="button" @click="responseParts = 2">显示下一段响应</button><p v-if="chunked && phase >= 4 && !error" class="lab-caption">已显示 {{ responseParts }} / 2 段示例响应</p></div></div>
        <svg class="api-flight" viewBox="0 0 500 95" role="img" aria-label="示例信封从客户端发到服务，再返回客户端">
          <path d="M35 43h430" stroke="var(--mag-accent-border)" stroke-width="2" stroke-dasharray="4 5" />
          <rect x="207" y="14" width="86" height="58" rx="10" fill="var(--lab-paper)" stroke="var(--mag-hairline-strong)" /><text x="250" y="48" text-anchor="middle" font-size="12" fill="var(--lab-muted)">模型服务</text>
          <g class="api-mail" :style="{ transform: `translate(${[35,115,215,270,360,465][phase]}px,43px)` }"><rect x="-16" y="-11" width="32" height="22" rx="3" :fill="phase >= 4 ? 'var(--lab-paper)' : 'var(--mag-accent-soft)'" :stroke="error ? 'var(--mag-warn)' : 'var(--lab-blue)'" stroke-width="2" /><path d="m-15-9 15 11 15-11" fill="none" :stroke="error ? 'var(--mag-warn)' : 'var(--lab-blue)'" /></g>
          <text x="35" y="88" text-anchor="middle" font-size="11" fill="var(--lab-muted)">客户端发出</text><text x="460" y="88" text-anchor="middle" font-size="11" fill="var(--lab-muted)">客户端收到</text>
        </svg>
        <div class="api-trip" aria-label="请求处理阶段"><span v-for="(name,i) in ['客户端','认证','模型','处理','返回']" :key="name" :class="{ active: phase === i+1, passed: phase > i+1, failed: !!error && phase === i+1 }"><i />{{ name }}</span></div>
        <details><summary>拆开请求信封</summary><pre>{{ JSON.stringify({ address: 'https://example.invalid', credential: 'DEMO_PLACEHOLDER', model: scenario === 'model' ? 'unknown-demo-model' : 'demo-model', message: '请用两句话解释 API。' }, null, 2) }}</pre></details>
        <details><summary>查看响应示例</summary><pre>{{ error || (phase === 5 ? response : '完成一次成功示例后，这里展示完整响应。') }}</pre></details>
      </div>
      <template #controls><button type="button" @click="send">{{ phase ? '重新发送示例' : '发送示例' }}</button><button type="button" :disabled="!playing" @click="pause">暂停动画</button><button type="button" :disabled="phase >= 5 || !!error" @click="step">下一步</button><button type="button" @click="reset">重置</button></template>
      <template #observation><p data-result>{{ error || explanations[phase] }}</p></template>
      <template #footer>全部是预设请求与响应，不发送网络请求、不接受真实密钥。分段展示只用于观察返回过程，不表示一个字就是一个 token。{{ reduced ? '减少动态效果下，请用下一步继续。' : '' }}</template>
    </LabFrame>
  </div>
</template>
<style scoped>
.api-mail { transition: transform .7s ease-in-out; }.api-flight { margin-top: 1rem; }.api-presets { padding-top: 0; }.api-fields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .4rem; }.api-trip { position: relative; display: flex; justify-content: space-between; margin: 1.2rem 0; gap: .3rem; }.api-trip::before { content: ''; position: absolute; top: 7px; left: 8%; right: 8%; height: 1px; background: var(--mag-hairline-strong); }.api-trip span { z-index: 1; display: flex; flex-direction: column; align-items: center; gap: .4rem; font-size: .7rem; color: var(--lab-muted); }.api-trip i { width: 15px; height: 15px; border-radius: 50%; border: 2px solid var(--mag-hairline-strong); background: var(--lab-paper); }.api-trip .passed i,.api-trip .active i { border-color: var(--lab-blue); }.api-trip .active i { background: var(--lab-blue); animation: api-arrival .6s ease-out; }.api-trip .failed i { background: var(--mag-warn); border-color: var(--mag-warn); }.api-response { font-size: .88rem; line-height: 1.8; min-height: 5em; }.response-paper { align-self: stretch; }@keyframes api-arrival { from { transform: scale(.5); } to { transform: scale(1); } }
</style>
