<script setup lang="ts">
import { ref } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const count = ref(1)
const clean = ref(0)
const buggy = ref(0)
const tick = ref(0)
const fixed = ref(false)
const log = ref(['准备：两边各有 1 个模拟计时器。'])
function record(s:string) { log.value = [...log.value.slice(-3), s] }
function advance() { tick.value++; clean.value++; buggy.value += count.value; return true }
const { playing, reduced, play, pause, step } = useLabPlayback(root, advance, 600)
function restart() { pause(); clean.value = 0; buggy.value = 0; tick.value = 0; count.value = fixed.value ? 1 : Math.min(3,count.value+1); record(`重开：正常侧 1 个，${fixed.value ? '修复侧' : '故障侧'} ${count.value} 个计时器。`) }
function repair() { pause(); fixed.value = true; count.value = 1; record('清理旧循环：两边都只保留 1 个。位置保留，后续移动节奏一致。') }
function reset() { pause(); count.value = 1; clean.value = 0; buggy.value = 0; tick.value = 0; fixed.value = false; log.value = ['准备：两边各有 1 个模拟计时器。'] }
</script>
<template>
  <div ref="root" class="timer-microscope">
    <LabFrame eyebrow="04 / A CLOSER LOOK" title="为什么重开几次，蛇反而越跑越快？" hint="先重开两次，再单步观察两边在同一时间窗口里更新了几次。">
      <div class="lab-stage">
        <div class="lab-two"><div class="timer-column"><span class="lab-tag">正常实现 · 1 个计时器</span><SnakeScene :position="clean" :food="false" label="正常实现" /><div class="timer-tracks"><span>循环 1</span><div><i v-for="n in 8" :key="n" :class="{ on: n === tick % 8 + 1 }" /></div></div><p class="lab-caption">移动更新 <b data-clean>{{ clean }}</b> 次</p></div><div class="timer-column"><span class="lab-tag" data-timer-count>{{ fixed ? '修复后' : '旧循环未清理' }} · {{ count }} 个计时器</span><SnakeScene :position="buggy" :food="false" label="对比实现" /><div v-for="i in count" :key="i" class="timer-tracks lab-enter"><span>循环 {{ i }}</span><div><i v-for="n in 8" :key="n" :class="{ on: n === tick % 8 + 1 }" /></div></div><p class="lab-caption">移动更新 <b data-buggy>{{ buggy }}</b> 次</p></div></div>
        <p class="lab-caption">同一时钟：已经过 {{ tick }} 个时间窗口。每个活动循环在一个窗口内更新一次。</p><ul class="lab-log"><li v-for="(entry,i) in log" :key="i">{{ entry }}</li></ul>
      </div>
      <template #controls><button type="button" :disabled="reduced" :aria-pressed="playing" @click="playing ? pause() : play()">{{ playing ? '暂停' : '播放脉冲' }}</button><button type="button" @click="step">推进一拍</button><button type="button" @click="restart">重开一局</button><button type="button" :disabled="fixed" @click="repair">清理旧循环</button><button type="button" @click="reset">重置实验</button></template>
      <template #observation><p>{{ fixed ? '旧循环被清理了，之后每拍两边都只更新一次。再重开，活动计时器仍然是 1 个。' : count === 1 ? '现在两边相同。点“重开一局”，观察故障侧是否留下了旧循环。' : `同一拍，正常侧更新 1 次，故障侧更新 ${count} 次。检查活动循环的数量，比猜测“速度变量错了”更具体。` }}</p></template>
      <template #footer>这是“一种可能原因”的简化模型，实际问题仍需读代码验证。最多展示 3 个模拟循环，由同一个时钟驱动，不会累积真实计时器。</template>
    </LabFrame>
  </div>
</template>
<style scoped>
.timer-column > .lab-tag { margin-bottom: .65rem; }.timer-tracks { display: flex; align-items: center; gap: .5rem; margin-top: .6rem; font-size: 14px; color: var(--lab-muted); }.timer-tracks > div { display: flex; flex: 1; gap: 4px; }.timer-tracks i { flex: 1; height: 12px; border-radius: 3px; background: var(--mag-hairline); }.timer-tracks i.on { background: var(--lab-blue); }
</style>
