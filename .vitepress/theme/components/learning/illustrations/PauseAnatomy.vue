<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
import { useLabPlayback } from './useLabPlayback'
type State = 'ready' | 'running' | 'paused' | 'ended'
const root = ref<HTMLElement | null>(null)
const state = ref<State>('ready')
const position = ref(0)
const inspected = ref<State>('ready')
const saved = ref(0)
const labels: Record<State,string> = { ready: '待开始', running: '运行中', paused: '已暂停', ended: '已结束' }
const descriptions: Record<State,string> = { ready: '尚未开局，没有移动更新。点击开始后才进入运行中。', running: '每个触发脉冲推动一次移动，可以暂停，也可以重新开始。', paused: '蛇的位置和分数保留，移动触发器停止。可以从原位继续。', ended: '本局已经结束，即使画面也不动，仍不能直接继续；需要重新开始。' }
const { playing, reduced, play, pause } = useLabPlayback(root, () => { position.value++; return true }, 420, () => { if (state.value === 'running') { state.value = 'paused'; saved.value = position.value } })
function begin() { pause(); state.value = 'running'; inspected.value = 'running'; play() }
function stop() { pause(); state.value = 'paused'; saved.value = position.value; inspected.value = 'paused' }
function end() { pause(); state.value = 'ended'; inspected.value = 'ended' }
function restart() { pause(); position.value = 0; saved.value = 0; begin() }
function reset() { pause(); position.value = 0; saved.value = 0; state.value = 'ready'; inspected.value = 'ready' }
function single() { if (state.value === 'running' && !playing.value) position.value++ }
watch(reduced, (value, previous) => { if (previous && !value && state.value === 'running') stop() })
const observation = computed(() => state.value === 'paused' ? `暂停在第 ${position.value} 格，快照也是第 ${saved.value} 格。继续会保留当前位置；重开会回到第 0 格。` : state.value === 'ended' ? '已结束与已暂停都不移动，但结束后不能继续。试试“重新开始”。' : state.value === 'ready' ? '先开始一局，再暂停。查看蛇的位置是否被保留下来。' : reduced.value ? `当前为运行中，已手动移动 ${position.value} 次。减少动态效果下，每次“移动一步”代表一次移动触发。` : '当前为运行中。点暂停，比较画面与快照。')
</script>
<template>
  <div ref="root" class="pause-anatomy">
    <LabFrame eyebrow="03 / UNDER THE PAUSE BUTTON" title="暂停时，究竟停下了哪一层？" hint="操作画面，再看下方的局面、触发器和状态怎样一起变化。">
      <div class="lab-stage">
        <div class="lab-two"><SnakeScene :position="position" :score="Math.floor(position/6)" :label="labels[state]" /><div class="lab-paper anatomy-layers"><div><span class="lab-eyebrow">01 / 当前局面</span><p>位置 <b data-position>{{ position }}</b> · 分数 {{ Math.floor(position/6) }}</p><small>暂停保留，重开归零</small></div><div><span class="lab-eyebrow">02 / 移动触发器</span><div class="anatomy-pulses"><span v-for="i in 8" :key="i" :class="{ active: i === position % 8 + 1 && state === 'running' }" /></div><small>{{ state === 'running' ? reduced ? '手动逐帧' : '每 420 ms 触发一次' : '已停止' }}</small></div><div><span class="lab-eyebrow">03 / 当前状态</span><p class="anatomy-state" data-state>{{ labels[state] }}</p></div></div></div>
        <div class="lab-tabs" aria-label="查看状态含义"><button v-for="(label,key) in labels" :key="key" type="button" :aria-pressed="inspected === key" @click="inspected = key">{{ label }}</button></div>
        <p class="lab-caption">查看“{{ labels[inspected] }}”：{{ descriptions[inspected] }}（查看状态不改变当前局面。）</p>
      </div>
      <template #controls><button type="button" :disabled="state !== 'ready'" @click="begin">开始</button><button type="button" :disabled="state !== 'running'" @click="stop">暂停</button><button type="button" :disabled="state !== 'paused'" @click="begin">继续</button><button type="button" :disabled="state !== 'running' || playing" @click="single">移动一步</button><button type="button" :disabled="state !== 'running'" @click="end">触发示例结束</button><button type="button" @click="restart">重新开始</button><button type="button" @click="reset">重置实验</button></template>
      <template #observation><p>{{ observation }}</p></template>
      <template #footer>固定轨道上的状态示意，不模拟完整碰撞规则。暂停仅在运行中可用；继续仅在已暂停时可用。{{ reduced ? '已启用减少动态效果，用“移动一步”推进。' : '离开画面时，正在运行的实验会自动暂停。' }}</template>
    </LabFrame>
  </div>
</template>
<style scoped>
.anatomy-layers > div + div { border-top: var(--mag-rule); margin-top: .7rem; padding-top: .7rem; }.anatomy-layers p { margin: .3rem 0; font-size: 14px; }.anatomy-layers small { color: var(--lab-muted); font-size: 14px; }.anatomy-pulses { display: flex; gap: 5px; margin: .65rem 0; }.anatomy-pulses span { width: 14px; height: 18px; background: var(--mag-hairline); border-radius: 3px; }.anatomy-pulses .active { background: var(--lab-blue); }.anatomy-state { color: var(--lab-blue); }
</style>
