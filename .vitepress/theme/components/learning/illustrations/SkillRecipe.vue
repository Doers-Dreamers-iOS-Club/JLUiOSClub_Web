<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
const project = ref(0)
const projectRevision = ref(0)
const selected = ref<number | null>(null)
const placements = ref<Record<number,string>>({})
const dragging = ref(false)
const dragType = 'application/x-skill-recipe-card'
const feedback = ref('先选一张纸卡，再点一个收纳夹。点已归类的纸卡可重新移动。')
const groups = [
  { id: 'fact', name: '项目事实', detail: '这个项目现在是什么', icon: 'M3 12h13l5 5h28v28H3Z M3 17V9h16l5 5' },
  { id: 'task', name: '本轮任务', detail: '这一次要完成什么', icon: 'M12 5h28v42H12Z M18 17l4 4 9-10m-13 20h16m-16 8h12' },
  { id: 'method', name: '可复用方法', detail: '下次还能照着做', icon: 'M7 7h17q5 0 5 5v33q-3-4-8-4H7Z M29 12q0-5 5-5h12v34H34q-3 0-5 4 M13 17h9m-9 8h9m13-8h6m-6 8h6' },
  { id: 'tool', name: '工具能力', detail: '环境实际提供的操作', icon: 'M35 5a12 12 0 0 0-13 16L6 37a6 6 0 0 0 9 9l16-16A12 12 0 0 0 47 17l-9 8-9-9Z' },
]
const cards = computed(() => [
  { id: 0, group: 'fact', title: project.value === 0 ? '当前项目是贪吃蛇游戏' : '当前项目是打砖块游戏', why: '它描述当前项目；换一个项目时，这条事实也会变化。' },
  { id: 1, group: 'task', title: '本轮增加轻松 / 标准两档速度', why: '这是这一次的交付要求，不是每个项目都要执行的长期流程。' },
  { id: 2, group: 'method', title: '修改前先读现有实现，再确定最小改动', why: '这是一套可以跨项目使用的工作步骤，适合写入 Skill。' },
  { id: 3, group: 'method', title: '用浏览器验证：开始、移动、碰撞、重新开始', why: '这是可重复的验证方法，可写入 Skill；执行仍需要环境提供浏览器工具。' },
  { id: 4, group: 'tool', title: '浏览器工具提供点击能力', why: '点击能力来自可用工具。Skill 可以说明何时、如何点击，但不能凭文字授予工具。' },
  { id: 5, group: 'tool', title: '文件工具提供读取与编辑能力', why: '读写能力来自工具与权限，不会因为把操作步骤写进 Skill 就自动出现。' },
])
const correct = computed(() => cards.value.filter(card => placements.value[card.id] === card.group).length)
const checkRecord = computed(() => project.value === 0 ? [
  { step: '开始', observation: '点击开始，蛇身按所选档位开始移动。' },
  { step: '移动', observation: '按方向键，检查蛇头转向与连续移动。' },
  { step: '碰撞', observation: '让蛇碰到边界，检查游戏结束反馈。' },
  { step: '重新开始', observation: '蛇身与分数复位，仍使用所选速度。' },
] : [
  { step: '开始', observation: '点击开始，小球出发，砖块与挡板就位。' },
  { step: '移动', observation: '移动挡板，检查挡板响应与小球持续运动。' },
  { step: '碰撞', observation: '让小球碰到挡板与砖块，检查反弹和砖块消除。' },
  { step: '重新开始', observation: '挡板、小球、砖块与分数复位，沿用所选速度。' },
])
function assign(group: string, id = selected.value) {
  if (!groups.some(item => item.id === group)) return
  if (id === null) { feedback.value = '先选择一张纸卡，再选择收纳夹。'; return }
  const card = cards.value.find(item => item.id === id)
  if (!card) return
  placements.value = { ...placements.value, [card.id]: group }
  feedback.value = `${card.group === group ? '归类正确。' : `这张卡更适合「${groups.find(item => item.id === card.group)?.name}」。`}${card.why}`
  selected.value = null
}
function startDrag(event: DragEvent, id: number) {
  if (!event.dataTransfer || !cards.value.some(card => card.id === id)) return
  event.dataTransfer.setData(dragType, String(id))
  event.dataTransfer.effectAllowed = 'move'
  dragging.value = true
}
function allowDrop(event: DragEvent) {
  if (!event.dataTransfer?.types.includes(dragType)) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}
function dropCard(event: DragEvent, group: string) {
  dragging.value = false
  const data = event.dataTransfer?.getData(dragType)
  const card = cards.value.find(item => String(item.id) === data)
  if (!card || !groups.some(item => item.id === group)) return
  event.preventDefault()
  assign(group, card.id)
}
function remove() { if (selected.value === null) return; const next = { ...placements.value }; delete next[selected.value]; placements.value = next; selected.value = null; feedback.value = '纸卡已移回待整理区，可以重新选择收纳夹。' }
function example() { placements.value = Object.fromEntries(cards.value.map(card => [card.id,card.group])); selected.value = null; feedback.value = '已展示整理示例。可复用方法组成工作配方；项目事实与本轮任务在每次使用时另行提供。工具能力由环境提供。' }
function swap() { project.value = project.value === 0 ? 1 : 0; projectRevision.value++; feedback.value = '项目事实已换成另一个小游戏。读代码、做最小改动、验证开始 / 移动 / 碰撞 / 重开的方法仍然适用；具体操作需结合新项目。' }
function reset() { project.value = 0; projectRevision.value = 0; placements.value = {}; selected.value = null; dragging.value = false; feedback.value = '先选一张纸卡，再点一个收纳夹。点已归类的纸卡可重新移动。' }
</script>

<template>
  <div class="skill-recipe">
    <LabFrame eyebrow="SKILL / 工作配方" title="把可复用的方法，收进配方夹" hint="六张纸卡里，哪些可以跨项目复用？先选卡片，再选归类，也可用鼠标拖入收纳夹；归错可以随时移回。">
      <div class="lab-stage">
        <div class="project-label lab-paper"><svg viewBox="0 0 68 48" aria-hidden="true"><rect x="2" y="2" width="64" height="44" rx="5" fill="none" stroke="currentColor"/><path d="M2 12h64" stroke="currentColor"/><path v-if="project === 0" d="M15 33h12V23h14" fill="none" stroke="var(--mag-accent)" stroke-width="6"/><g v-else fill="var(--mag-accent)"><rect x="12" y="18" width="12" height="6"/><rect x="28" y="18" width="12" height="6"/><rect x="44" y="18" width="12" height="6"/><rect x="27" y="38" width="20" height="3"/><circle cx="36" cy="30" r="3"/></g></svg><div><span class="lab-eyebrow">当前项目 / {{ project === 0 ? 'SNAKE' : 'BREAKOUT' }}</span><b>{{ project === 0 ? '贪吃蛇小游戏' : '打砖块小游戏' }}</b></div></div>
        <div class="unsorted"><div class="shelf-heading"><span class="lab-eyebrow">待整理纸卡</span><span class="lab-caption">{{ 6 - Object.keys(placements).length }} 张待归类</span></div><div class="recipe-cards"><button v-for="card in cards.filter(item => !placements[item.id])" :key="card.id === 0 ? `fact-${projectRevision}` : card.id" class="recipe-card lab-enter" :class="{ 'fact-changed': card.id === 0 && projectRevision > 0 }" :aria-pressed="selected === card.id" draggable="true" @dragstart="startDrag($event, card.id)" @dragend="dragging = false" @click="selected = card.id"><span class="paper-number">{{ String(card.id + 1).padStart(2, '0') }}</span><span>{{ card.title }}</span><span class="pick-mark">{{ selected === card.id ? '已选中 → 选择收纳夹' : '点按选择' }}</span></button></div><p v-if="Object.keys(placements).length === 6" class="lab-caption">六张纸卡都已归类。还可以选择夹内的卡片，重新移动。</p></div>
        <div class="recipe-folders"><section v-for="group in groups" :key="group.id" class="recipe-folder" :class="{ 'method-folder': group.id === 'method', 'drop-ready': dragging }" :aria-label="group.name" @dragover="allowDrop" @drop="dropCard($event, group.id)"><button class="folder-title" @click="assign(group.id)"><svg viewBox="0 0 52 52" aria-hidden="true"><path :d="group.icon" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" /></svg><span><b>{{ group.name }}</b><small>{{ selected === null ? group.detail : '将选中的纸卡放入此处' }}</small></span><span aria-hidden="true">+</span></button><div class="folder-body"><button v-for="card in cards.filter(item => placements[item.id] === group.id)" :key="card.id === 0 ? `fact-${projectRevision}` : card.id" class="recipe-card lab-enter" :class="{ 'fact-changed': card.id === 0 && projectRevision > 0 }" :aria-pressed="selected === card.id" draggable="true" @dragstart="startDrag($event, card.id)" @dragend="dragging = false" @click="selected = card.id"><span>{{ card.title }}</span><span class="pick-mark">{{ selected === card.id ? '已选中，可移到其他夹' : card.group === group.id ? '归类正确 · 可再移动' : '待调整 · 点按再移动' }}</span></button><span v-if="!cards.some(item => placements[item.id] === group.id)" class="empty-folder">纸卡放在这里</span></div></section></div>
        <div class="recipe-bottom"><span class="lab-tag">正确归类 {{ correct }} / 6</span><button :disabled="selected === null || !placements[selected]" @click="remove">移回待整理区</button></div>
        <section v-if="projectRevision > 0" :key="`record-${projectRevision}`" class="project-check lab-paper lab-enter" aria-label="新项目的检查记录示例">
          <div class="check-heading"><svg viewBox="0 0 48 54" aria-hidden="true"><path d="M9 5h24l7 7v37H9Z M33 5v9h7 M15 23l3 3 5-6m-8 16 3 3 5-6 M28 24h6m-6 13h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><div><span class="lab-eyebrow">展开检查记录 / {{ project === 0 ? 'SNAKE' : 'BREAKOUT' }}</span><b>{{ project === 0 ? '贪吃蛇' : '打砖块' }}：同一方法，具体观察不同</b></div></div>
          <ol class="check-record"><li v-for="entry in checkRecord" :key="entry.step"><b>{{ entry.step }}</b><span>{{ entry.observation }}</span></li></ol>
          <p class="lab-caption">以上为教学示例记录，并非运行测试的结果。配方中的「开始、移动、碰撞、重新开始」保持不变；实际执行时，要根据项目记录真实观察。</p>
        </section>
      </div>
      <template #controls><button @click="example">看整理好的示例</button><button @click="swap">换成{{ project === 0 ? '打砖块' : '贪吃蛇' }}项目</button><button @click="reset">全部重置</button></template>
      <template #observation><p>{{ feedback }}</p></template>
      <template #footer>Skill 可以包含工具使用说明，但不会授予工具能力。可执行哪些操作，取决于环境中实际提供的工具和权限。</template>
    </LabFrame>
  </div>
</template>

<style scoped>
.project-label { display:flex; align-items:center; gap:1rem; margin-bottom:1.1rem; }.project-label svg { width:68px; flex:none; color:var(--mag-text-secondary); }.project-label b { display:block; font-size:.9rem; margin-top:.3rem; }
.shelf-heading { display:flex; align-items:center; justify-content:space-between; gap:.5rem; }.recipe-cards { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.6rem; margin:.5rem 0 1.4rem; }
.lesson-lab .recipe-card { position:relative; display:flex; flex-direction:column; align-items:flex-start; gap:.55rem; width:100%; min-width:0; text-align:left; padding:.85rem; font-size:.8rem; border-radius:var(--mag-radius-sm); }
.recipe-card.fact-changed { animation:fact-change .7s ease-out; }
@keyframes fact-change { from { background:var(--mag-accent-soft); border-color:var(--mag-accent); transform:translateY(-5px); } to { transform:translateY(0); } }
.recipe-folder.drop-ready { border-color:var(--mag-accent); }
.project-check { margin-top:1rem; animation-delay:.7s; animation-fill-mode:backwards; }.check-heading { display:flex; align-items:center; gap:.7rem; }.check-heading svg { width:40px; color:var(--mag-accent); flex:none; }.check-heading b { display:block; margin-top:.3rem; font-size:.82rem; }.check-heading .lab-eyebrow { font-size:.65rem; }.check-record { list-style:none; padding:0; margin:.8rem 0; counter-reset:checks; }.check-record li { counter-increment:checks; display:grid; grid-template-columns:1.5rem minmax(0,1fr); gap:.2rem .5rem; padding:.65rem 0; border-bottom:var(--mag-rule); font-size:.76rem; line-height:1.8; }.check-record li::before { content:counter(checks, decimal-leading-zero); grid-row:span 2; color:var(--mag-accent); font: .7rem/1.8 var(--mag-font-mono); }.check-record li b { grid-column:2; }.check-record li span { grid-column:2; color:var(--mag-text-secondary); }
.paper-number { color:var(--mag-accent); font:.65rem/1.6 var(--mag-font-mono); }.pick-mark { color:var(--mag-text-secondary); font-size:.65rem; margin-top:auto; }
.recipe-folders { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; }.recipe-folder { border:var(--mag-rule-strong); border-radius:var(--mag-radius-sm); overflow:hidden; background:var(--mag-surface); }.method-folder { border-color:var(--mag-accent-border); }
.lesson-lab .folder-title { width:100%; border:0; border-bottom:var(--mag-rule); border-radius:0; display:flex; align-items:center; gap:.6rem; text-align:left; background:var(--mag-surface-sunken); padding:.8rem; }.method-folder .folder-title { background:var(--mag-accent-soft); }.folder-title svg { width:34px; flex:none; color:var(--mag-accent); }.folder-title span:nth-child(2) { flex:1; }.folder-title b { display:block; }.folder-title small { display:block; font-size:.66rem; color:var(--mag-text-secondary); margin-top:.2rem; }
.folder-title:focus-visible { outline-offset:-4px; }.folder-body { display:flex; flex-direction:column; gap:.5rem; padding:.7rem; min-height:100px; }.empty-folder { color:var(--mag-text-secondary); font-size:.75rem; text-align:center; padding:1.3rem .5rem; border:1px dashed var(--mag-hairline-strong); border-radius:var(--mag-radius-sm); }.recipe-bottom { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.75rem; margin-top:1rem; }
@media(max-width:600px) { .recipe-folders { grid-template-columns:1fr; }.recipe-cards { grid-template-columns:1fr; } }
</style>
