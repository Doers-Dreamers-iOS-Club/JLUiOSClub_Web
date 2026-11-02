<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import DemoGame from './DemoGame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const project = computed(() => frame.value < 18 ? 0 : 1)
const local = computed(() => frame.value % 18)
const phase = computed(() => Math.min(3, Math.floor(local.value/4)))
const methods = ['读玩法','安排试玩','记录现象','整理建议']
const step = computed(() => Math.max(0, Math.min(7, local.value-4)))
useLabPlayback(root, () => { frame.value++; return frame.value < 35 }, 500, { reset: () => { frame.value = 0 }, static: () => { frame.value = 33 } })
</script>
<template>
  <div ref="root" class="skill-recipe" :data-demo-frame="frame" :data-project="project" :data-method="phase">
    <LabFrame title="换个游戏，沿用方法" hint="同一份检查技能读取不同项目的玩法，安排试玩、记录现象并整理建议。技能组织步骤，浏览器工具负责执行。">
      <div class="lab-stage skill-stage">
        <div class="recipe-bookmark">
          <div class="recipe-heading"><i class="ti ti-book-2" aria-hidden="true" /><span>SKILL.md</span><i class="ti ti-repeat" aria-hidden="true" /></div>
          <ol class="recipe-methods"><li v-for="(method,i) in methods" :key="method" :class="{ current: phase === i, complete: phase > i }"><span class="method-number">{{ phase > i ? '✓' : '0'+(i+1) }}</span>{{ method }}<span class="method-mark" /></li></ol>
          <div class="method-foot"><i class="ti ti-tool" aria-hidden="true" />浏览器工具</div>
        </div>
        <div class="recipe-project" :key="project">
          <div class="project-caption"><span>{{ project ? '打砖块' : '贪吃蛇' }}</span><span class="project-number">0{{ project+1 }}</span></div>
          <div class="project-playfield"><DemoGame :step="step" :kind="project ? 'bricks' : 'snake'" /><div class="read-marker" :class="{ visible: phase === 0 }"><i class="ti ti-search" aria-hidden="true" />{{ project ? '碰砖反弹' : '碰壁结束' }}</div><div class="capture-corners" :class="{ visible: phase === 2 }" aria-hidden="true"><span v-for="i in 4" :key="i" /></div></div>
          <div class="recipe-observation" :class="{ visible: phase >= 2 }"><i :class="['ti', phase === 3 ? 'ti-check' : 'ti-camera']" aria-hidden="true" /><span>{{ phase === 3 ? '操作与规则一致' : project ? '碰撞后反弹' : '开始后移动' }}</span><div class="observation-trace" aria-hidden="true"><span v-for="i in 5" :key="i" :style="{ height: (project ? [8,16,24,16,8] : [8,12,16,20,24])[i-1]+'px' }" /></div></div>
        </div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.skill-stage { display: grid; grid-template-columns: 180px minmax(0,1fr); align-items: center; gap: 32px; }.recipe-bookmark { border-left: 2px solid var(--mag-accent-border); padding-left: 18px; }.recipe-heading { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--lab-blue); }.recipe-heading > i:last-child { margin-left: auto; }.recipe-methods { list-style: none; padding: 0; margin: 20px 0; }.recipe-methods li { display: flex; align-items: center; gap: 12px; min-height: 42px; font-size: 13px; color: var(--lab-muted); margin: 0; }.method-number { width: 16px; font-size: 11px; }.recipe-methods .current,.recipe-methods .complete .method-number { color: var(--lab-blue); }.method-mark { margin-left: auto; width: 4px; height: 4px; border-radius: 50%; background: var(--lab-blue); opacity: 0; transition: opacity .3s; }.current .method-mark { opacity: 1; }.method-foot { display: flex; gap: 8px; color: var(--lab-muted); font-size: 12px; border-top: var(--mag-rule); padding-top: 14px; }.project-caption { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 16px; }.project-number { color: var(--lab-muted); font-size: 12px; }.project-playfield { position: relative; }.read-marker { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 6px; white-space: nowrap; border: var(--mag-rule); border-radius: 20px; background: var(--lab-paper); padding: 6px 10px; font-size: 12px; opacity: 0; transition: opacity .3s; }.capture-corners { position: absolute; inset: 8px; opacity: 0; transition: opacity .3s; }.capture-corners span { position: absolute; width: 18px; height: 18px; border-color: var(--lab-blue); border-style: solid; border-width: 2px 0 0 2px; }.capture-corners span:nth-child(2) { right: 0; transform: rotate(90deg); }.capture-corners span:nth-child(3) { bottom: 0; right: 0; transform: rotate(180deg); }.capture-corners span:nth-child(4) { bottom: 0; transform: rotate(270deg); }.recipe-observation { display: flex; align-items: center; gap: 8px; font-size: 12px; min-height: 44px; margin-top: 16px; color: var(--lab-blue); opacity: 0; transition: opacity .4s; }.visible { opacity: 1; }.observation-trace { display: flex; align-items: end; gap: 4px; margin-left: auto; }.observation-trace span { width: 4px; border-radius: 2px; background: var(--lab-blue); opacity: .4; }@media(max-width:520px) { .skill-stage { grid-template-columns: 1fr; gap: 24px; }.recipe-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; margin: 12px 0; }.recipe-methods li { min-height: 34px; }.recipe-bookmark { padding-left: 12px; } }
</style>
