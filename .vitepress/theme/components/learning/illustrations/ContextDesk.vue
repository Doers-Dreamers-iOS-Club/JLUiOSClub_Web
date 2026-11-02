<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'

const cards = [
  { id: 'path', title: '文件路径', mark: '01', text: 'index.html', note: '知道去哪里找，还不知道里面写了什么。', icon: 'M5 10V5h10l4 4h16v23H5Z' },
  { id: 'code', title: '当前代码', mark: '02', text: 'const speed = 180\nfunction restart() { start(speed) }', note: '看见当前实现，才能判断应该改哪里。', icon: 'M15 10 5 20l10 10m10-20 10 10-10 10m-3-24-5 28' },
  { id: 'old', title: '旧对话', mark: '03', text: '上一轮：先做固定速度的基础版。', note: '帮助理解来由，但旧决定可能已被新需求替代。', icon: 'M5 6h30v22H17L8 35v-7H5Z M11 13h18m-18 7h12' },
  { id: 'rule', title: '本轮要求', mark: '04', text: '轻松 / 标准；默认轻松；开始前选择；重新开始沿用所选档位。', note: '把本次交付的边界说清楚。', icon: 'M10 4h20v32H10Z M15 13l3 3 7-7m-10 15h10m-10 6h10' },
  { id: 'error', title: '报错证据', mark: '05', text: '复现：选标准 → 开始 → 重新开始\n结果：又变回轻松速度。', note: '复现步骤和实际结果，让问题可以被验证。', icon: 'M20 4 38 35H2Z M20 14v10m0 5v1' },
]
const chosen = ref(['path'])
const preset = ref(0)
const copied = ref('')
const fallback = ref(false)
const dragging = ref(false)
const dragType = 'application/x-context-desk-card'
let copyRequest = 0
const presets = [
  { name: '只给路径', ids: ['path'], task: '请查看 index.html，先读取文件并说明当前的速度设置和重新开始逻辑；不要仅凭路径猜测代码内容。' },
  { name: '补上代码', ids: ['path', 'code'], task: '请读取 index.html 的当前代码，找出速度设置和重新开始的实现。请先说明增加速度选择还需要明确哪些规则。' },
  { name: '补齐规则', ids: ['path', 'code', 'rule'], task: '请读取 index.html，在现有贪吃蛇游戏上增加“轻松 / 标准”两档速度，默认轻松，只在开始前选择；重新开始沿用所选档位。完成后验证默认档位、两档速度和重新开始行为。' },
]
const active = computed(() => cards.filter(card => chosen.value.includes(card.id)))
const known = computed(() => [chosen.value.includes('path') ? '文件位置已提供' : '', chosen.value.includes('code') ? '当前实现已提供' : '', chosen.value.includes('rule') ? '本轮行为规则已提供' : '', chosen.value.includes('error') ? '复现证据已提供' : ''].filter(Boolean).join('；') || '尚未放入本轮材料')
const missing = computed(() => !chosen.value.includes('code') ? '还缺当前代码。路径是一条线索，不等于已经读过文件。' : !chosen.value.includes('rule') ? '还缺本轮规则：有几档、默认哪档、何时选择、重开是否保留？' : '这组材料已覆盖示例的实现与规则；仍需修改后验证实际行为。')
function toggle(id: string) { chosen.value = chosen.value.includes(id) ? chosen.value.filter(item => item !== id) : [...chosen.value, id] }
function selectPreset(index: number) { copyRequest++; preset.value = index; chosen.value = [...presets[index].ids]; copied.value = ''; fallback.value = false; dragging.value = false }
function startDrag(event: DragEvent, id: string) {
  if (!event.dataTransfer || !cards.some(card => card.id === id)) return
  event.dataTransfer.setData(dragType, id)
  event.dataTransfer.effectAllowed = 'copy'
  dragging.value = true
}
function allowDrop(event: DragEvent) {
  if (!event.dataTransfer?.types.includes(dragType)) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}
function dropCard(event: DragEvent) {
  dragging.value = false
  const id = event.dataTransfer?.getData(dragType)
  if (!id || !cards.some(card => card.id === id)) return
  event.preventDefault()
  if (!chosen.value.includes(id)) chosen.value = [...chosen.value, id]
}
async function copyTask() {
  const index = preset.value
  const task = presets[index].task
  const request = ++copyRequest
  const stillCurrent = () => request === copyRequest && preset.value === index && presets[preset.value].task === task
  try {
    await navigator.clipboard.writeText(task)
    if (!stillCurrent()) return
    copied.value = '任务已复制'; fallback.value = false
  } catch {
    if (!stillCurrent()) return
    fallback.value = true; copied.value = '无法自动复制，请在下方选择并复制任务文字。'
  }
}
</script>

<template>
  <div class="context-desk">
    <LabFrame eyebrow="CONTEXT / 材料工作台" title="把有用的材料放到同一张桌上" hint="点按纸卡加入或移出本轮材料，也可用鼠标拖入托盘。试试只给路径，再逐步补上代码与规则。">
      <div class="lab-stage">
        <div class="lab-tabs" aria-label="材料故事预设"><button v-for="(item,index) in presets" :key="item.name" :aria-pressed="preset === index" @click="selectPreset(index)">{{ index + 1 }}. {{ item.name }}</button></div>
        <div class="desk-shelf">
          <button v-for="card in cards" :key="card.id" class="desk-card" :aria-pressed="chosen.includes(card.id)" draggable="true" @dragstart="startDrag($event, card.id)" @dragend="dragging = false" @click="toggle(card.id)">
            <span class="card-top"><svg viewBox="0 0 40 40" aria-hidden="true"><path :d="card.icon" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg><span>{{ card.mark }}</span></span>
            <strong>{{ card.title }}</strong><span class="card-text">{{ card.text }}</span><span class="card-action">{{ chosen.includes(card.id) ? '已放入 · 点按移出' : '+ 放入本轮材料' }}</span>
          </button>
        </div>
        <div class="desk-tray" :class="{ 'drop-ready': dragging }" @dragover="allowDrop" @drop="dropCard">
          <div class="tray-label"><svg viewBox="0 0 72 40" aria-hidden="true"><path d="M7 29 15 8h42l8 21v7H7Z" fill="var(--mag-accent-soft)" stroke="var(--mag-accent)"/><path d="M7 29h20l3 4h12l3-4h20M22 16h28m-31 6h34" fill="none" stroke="var(--mag-accent)"/></svg><div><span class="lab-eyebrow">本轮材料托盘</span><p class="lab-caption">加入材料，是为了减少猜测。</p></div></div>
          <div v-if="active.length" class="tray-notes"><div v-for="card in active" :key="card.id" class="lab-paper lab-enter"><b>{{ card.title }}</b><p>{{ card.note }}</p></div></div>
          <p v-else class="lab-caption">托盘暂时为空。选择上方任意纸卡放进来。</p>
        </div>
        <div class="task-slip lab-paper"><span class="lab-eyebrow">可带走的任务 / {{ presets[preset].name }}</span><p>{{ presets[preset].task }}</p><button @click="copyTask">复制这段任务</button><p v-if="copied" role="status" class="lab-caption">{{ copied }}</p><textarea v-if="fallback" aria-label="手动复制任务文字" readonly :value="presets[preset].task" @focus="($event.target as HTMLTextAreaElement).select()" /></div>
      </div>
      <template #controls><button @click="selectPreset(0)">重置材料</button></template>
      <template #observation><p><b>现在已知：</b>{{ known }}。</p><p><b>下一步：</b>{{ missing }}</p><p v-if="chosen.includes('old') && chosen.includes('rule')">旧对话说明曾经的决定，本轮新增要求需要明确覆盖旧规则。</p></template>
      <template #footer>这是材料组织示意，不展示真实代理的内部上下文，也不估算 token。复制的任务与上方选中的故事预设对应。</template>
    </LabFrame>
  </div>
</template>

<style scoped>
.desk-shelf { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; margin:1rem 0 1.4rem; }
.lesson-lab .desk-card { display:flex; flex-direction:column; gap:.7rem; min-width:0; text-align:left; padding:1rem; border-radius:var(--mag-radius-sm); }
.card-top { display:flex; align-items:center; gap:.55rem; color:var(--mag-text-secondary); font: 13px/1.5 var(--mag-font-display); }
.card-top svg { width:30px; flex:none; }
.card-text { white-space:pre-wrap; overflow-wrap:anywhere; color:var(--mag-text-secondary); font:14px/1.8 var(--mag-font-display); }
.card-action { margin-top:auto; font-size:14px; color:var(--mag-accent); }
.desk-tray { border:var(--mag-rule-strong); border-top:3px solid var(--mag-accent-border); border-radius:var(--mag-radius-md); padding:1rem; }
.desk-tray.drop-ready { border-color:var(--mag-accent); background:var(--mag-accent-soft); }
.tray-label { display:flex; align-items:center; gap:.75rem; }
.tray-label svg { width:64px; flex:none; }
.tray-notes { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.65rem; margin-top:.7rem; }
.tray-notes b { font-size:14px; }.tray-notes p { font-size:14px; line-height:1.8; color:var(--mag-text-secondary); margin:.3rem 0 0; }
.task-slip { margin-top:1rem; }.task-slip p { font-size:14px; line-height:1.9; }
.task-slip textarea { width:100%; min-height:140px; margin-top:.7rem; color:var(--mag-text); background:var(--mag-surface); border:var(--mag-rule-strong); padding:.7rem; font:inherit; }
.task-slip textarea:focus-visible { outline:2px solid var(--mag-accent); outline-offset:3px; }
@media(max-width:760px) { .desk-shelf { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:420px) { .desk-shelf,.tray-notes { grid-template-columns:1fr; } }
</style>
