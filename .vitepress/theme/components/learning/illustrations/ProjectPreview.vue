<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const choices = ref<(number | null)[]>([null, null, null])
const phase = ref(0)
const focusedRule = ref(0)
const activeRule = computed(() => phase.value === 0 ? focusedRule.value : phase.value < 3 ? 0 : phase.value === 3 ? 1 : 2)
const connectors = [
  { path: 'M8 74C52 74 44 216 105 216', x: 8, y: 74, target: '开始按钮' },
  { path: 'M8 104C88 104 174 70 286 70', x: 8, y: 104, target: '游戏边界' },
  { path: 'M8 74C30 74 36 22 246 22', x: 8, y: 74, target: '分数显示' },
]
const rules = [
  { title: '什么时候开始？', options: ['点击开始', '打开就运行'] },
  { title: '碰到边界以后？', options: ['撞墙结束', '穿过边界'] },
  { title: '重新开始时？', options: ['分数清零', '保留分数'] },
]
const scenes = ['一句想法', '打开页面', '开始试玩', '碰到边界', '重新开始']
const ready = computed(() => choices.value.every(c => c !== null))
const { playing, reduced, play, pause, step } = useLabPlayback(root, () => { if (phase.value < 4) phase.value++; return phase.value < 4 }, 1100)
function choose(row: number, value: number) { pause(); choices.value[row] = value; focusedRule.value = row; phase.value = 0 }
function contract() { pause(); choices.value = [0, 0, 0]; phase.value = 0 }
function reset() { pause(); choices.value = [null, null, null]; phase.value = 0 }
function replay() { phase.value = 0; play() }
const body = computed(() => {
  if (phase.value === 3 && choices.value[1] === 1) return [46, 270, 246, 222]
  const head = phase.value === 3 ? 270 : phase.value === 2 ? 198 : phase.value === 1 && choices.value[0] === 1 ? 150 : 126
  return [head, head - 24, head - 48, head - 72]
})
const score = computed(() => phase.value === 4 ? choices.value[2] === 0 ? 0 : 10 : phase.value >= 2 ? 10 : 0)
const note = computed(() => {
  if (!ready.value) return '“做个贪吃蛇”还留下了三处选择。先点选规则，看便签如何变成一份明确的约定。'
  if (phase.value === 0) return '三项选择已经写进便签。点击播放，依次观察打开、试玩、碰到边界和重开。'
  if (phase.value === 1) return choices.value[0] === 0 ? '打开页面：蛇保持静止，等待玩家点击开始。' : '打开页面：蛇已经移动。自动开始与点击开始，是两种不同体验。'
  if (phase.value === 2) return '开始试玩：示意玩家已经点击开始并得到 10 分。下一幕观察碰到边界。'
  if (phase.value === 3) return choices.value[1] === 0 ? '碰到边界：这一局结束。这个结果对应“撞墙结束”的要求。' : '碰到右边界：从左侧出现。这个结果对应“穿过边界”的要求。'
  return choices.value[2] === 0 ? '重新开始：蛇回到初始局面，分数归零。原讲义第一版采用这一规则。' : '重新开始：蛇回到初始局面，但保留 10 分。这是另一种约定，与原讲义不同。'
})
</script>
<template>
  <div ref="root" class="project-preview">
    <LabFrame eyebrow="01 / IDEA TO PROTOTYPE" title="一句“做个游戏”，还缺哪些决定？" hint="选三项规则，再翻看这份小作品的五个瞬间。">
      <div class="lab-stage lab-two">
        <div class="lab-paper preview-note">
          <span class="lab-eyebrow">我的需求便签</span>
          <p>我想做一个贪吃蛇。</p>
          <fieldset v-for="(rule,row) in rules" :key="rule.title" :class="{ 'preview-focus': ready && activeRule === row }"><legend><span class="preview-number">{{ row + 1 }}</span> {{ rule.title }}</legend><div class="preview-options"><button v-for="(option,index) in rule.options" :key="option" type="button" :aria-pressed="choices[row] === index" @click="choose(row,index)">{{ option }}</button></div></fieldset>
        </div>
        <div>
          <svg viewBox="0 0 320 245" role="img" :aria-label="`${scenes[phase]}：${note}`">
            <rect x="1" y="1" width="318" height="243" rx="12" fill="var(--lab-paper)" stroke="var(--mag-hairline-strong)" />
            <path d="M1 34h318" stroke="var(--mag-hairline)" /><circle cx="16" cy="17" r="3" fill="var(--lab-blue)" />
            <text x="34" y="22" font-size="12" fill="var(--lab-muted)">snake-lab</text><text x="296" y="22" text-anchor="end" font-size="12" fill="var(--lab-muted)">{{ score }} 分</text>
            <rect x="22" y="50" width="276" height="137" rx="6" fill="var(--lab-desk)" />
            <path d="M286 60v115" :stroke="phase === 3 ? 'var(--mag-warn)' : 'var(--mag-hairline-strong)'" stroke-dasharray="4 5" stroke-width="2" />
            <g :key="phase" class="lab-signal"><rect v-for="(x,i) in body" :key="i" :x="x-10" y="108" width="20" height="20" rx="5" fill="var(--lab-blue)" :opacity="1-i*.17" /><circle :cx="body[0]+3" cy="114" r="2" fill="var(--lab-paper)" /></g>
            <rect x="106" y="203" width="108" height="27" rx="13" fill="var(--mag-accent-soft)" :stroke="ready && activeRule === 0 ? 'var(--lab-blue)' : 'none'" /><text x="160" y="221" text-anchor="middle" font-size="12" fill="var(--lab-blue)">{{ phase === 3 && choices[1] === 0 ? '本局结束' : scenes[phase] }}</text>
          <g v-if="ready" :key="activeRule" class="preview-connection">
              <path :d="connectors[activeRule].path" fill="none" stroke="var(--lab-blue)" stroke-width="1.5" stroke-dasharray="4 3" class="preview-wire" />
              <circle :cx="connectors[activeRule].x + 4" :cy="connectors[activeRule].y" r="10" fill="var(--lab-blue)" /><text :x="connectors[activeRule].x + 4" :y="connectors[activeRule].y + 4" text-anchor="middle" font-size="11" fill="var(--lab-paper)">{{ activeRule + 1 }}</text>
            </g>
          </svg>
          <p v-if="ready" class="lab-caption">规则 {{ activeRule + 1 }} 对应：{{ connectors[activeRule].target }}</p>
          <ol class="preview-script"><li v-for="(rule,i) in rules" :key="rule.title" :class="{ 'preview-set': choices[i] !== null, 'preview-rule-active': ready && activeRule === i }">{{ choices[i] === null ? '尚未明确：' + rule.title : rule.options[choices[i]!] }}</li></ol>
        </div>
      </div>
      <template #controls><button type="button" @click="contract">采用讲义第一版约定</button><button type="button" :disabled="!ready || reduced" :aria-pressed="playing" @click="playing ? pause() : replay()">{{ playing ? '暂停' : '播放分镜' }}</button><button type="button" :disabled="!ready || phase === 4" @click="step">下一幕</button><button type="button" @click="reset">重置</button><span class="lab-caption">{{ phase + 1 }} / 5 · {{ scenes[phase] }}</span></template>
      <template #observation><p>{{ note }}</p></template>
      <template #footer>预设规则的教学示意，不会调用 AI 生成游戏。{{ reduced ? '已启用减少动态效果，可以用“下一幕”观察。' : '同一个游戏名字，可以对应不同的行为约定。' }}</template>
    </LabFrame>
  </div>
</template>
<style scoped>
.preview-number { display: inline-block; border: 1px solid var(--mag-hairline-strong); border-radius: 50%; width: 19px; text-align: center; }.preview-focus legend, .preview-rule-active { color: var(--lab-blue); }.preview-focus .preview-number { background: var(--mag-accent-soft); border-color: var(--lab-blue); }.preview-wire { animation: trace-rule .8s ease-out; }@keyframes trace-rule { from { stroke-dashoffset: 50; opacity: .2; } to { stroke-dashoffset: 0; opacity: 1; } }.preview-note {  border-top: 3px solid var(--mag-accent-border); }
.preview-note p { font-family: var(--mag-font-display); font-size: 1.1rem; }
.preview-note fieldset { border: 0; padding: 0; margin: .9rem 0 0; min-width: 0; }
.preview-note legend { font-size: 14px; color: var(--lab-muted); margin-bottom: .4rem; }
.preview-options { display: flex; flex-wrap: wrap; gap: .35rem; }.preview-options button { font-size: 14px; padding: .4rem .55rem; }
.preview-script { padding: 0; list-style: none; font-size: 14px; line-height: 1.8; color: var(--lab-muted); }
.preview-script li { border-bottom: var(--mag-rule); padding: .3rem 0; }.preview-set { color: var(--lab-blue); }
</style>
