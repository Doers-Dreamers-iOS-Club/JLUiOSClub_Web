<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import DemoGame from './DemoGame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const version = computed(() => frame.value >= 28 ? 1 : frame.value >= 16 ? 2 : frame.value >= 6 ? 1 : 0)
const saved = computed(() => frame.value >= 24 ? 2 : frame.value >= 12 ? 1 : 0)
const paused = computed(() => frame.value >= 21 && frame.value < 28)
const step = computed(() => frame.value >= 28 ? (frame.value-28)*2 : paused.value ? 10 : frame.value >= 16 ? (frame.value-16)*2 : frame.value >= 6 ? (frame.value-6)*2 : frame.value)
const versions = ['初始版','速度版','暂停版']
const status = computed(() => frame.value >= 28 ? '回看速度版' : frame.value === 12 || frame.value >= 24 ? '已提交' : frame.value >= 10 && frame.value < 12 || frame.value >= 22 ? '暂存改动' : frame.value >= 6 ? '检查改动' : '已保存')
useLabPlayback(root, () => { frame.value++; return frame.value < 33 }, 500, { reset: () => { frame.value = 0 }, static: () => { frame.value = 25 } })
</script>
<template>
  <div ref="root" class="version-book" :data-demo-frame="frame" :data-version="version" :data-saved="saved">
    <LabFrame title="每次保存，都能回看" hint="先检查游戏变化，再暂存、提交；历史记录保留各个版本的功能。最后回看速度版，暂停版记录仍保留。">
      <div class="lab-stage version-stage">
        <ol class="version-history"><li v-for="(name,i) in versions" :key="name" :class="{ selected: version === i, saved: saved >= i }"><span class="commit-dot"><i v-if="saved >= i" class="ti ti-check" aria-hidden="true" /></span><span><small>0{{ i+1 }}</small>{{ name }}</span><i v-if="version === i" class="ti ti-eye" aria-hidden="true" /></li></ol>
        <div class="version-working">
          <div class="version-title"><span>{{ versions[version] }}</span><span class="version-state">{{ status }}</span></div>
          <DemoGame :step="step" :paused="paused" />
          <div class="version-features"><span :class="{ added: version >= 1 }"><i class="ti ti-gauge" aria-hidden="true" />{{ version >= 1 ? '轻松 / 标准' : '固定速度' }}</span><span :class="{ added: version === 2 }"><i :class="['ti', version === 2 ? 'ti-player-pause' : 'ti-minus']" aria-hidden="true" />{{ version === 2 ? '暂停 / 继续' : '无暂停' }}</span></div>
          <div class="version-diff" :class="{ recorded: saved >= version }"><i :class="['ti', saved >= version ? 'ti-git-commit' : 'ti-file-diff']" aria-hidden="true" /><span>index.html</span><span>{{ version === 0 ? '初次保存' : version === 1 ? '+ 两档速度' : '+ 暂停恢复' }}</span></div>
        </div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.version-stage { display: grid; grid-template-columns: 130px minmax(0,1fr); gap: 28px; align-items: center; }.version-history { list-style: none; padding: 0; margin: 0; }.version-history li { position: relative; display: flex; align-items: center; gap: 10px; min-height: 94px; font-size: 13px; color: var(--lab-muted); margin: 0; }.version-history li:not(:last-child)::after { content: ''; position: absolute; width: 1px; background: var(--mag-hairline); left: 10px; top: 58px; bottom: -35px; }.commit-dot { flex: 0 0 21px; height: 21px; border: var(--mag-rule); border-radius: 50%; display: grid; place-items: center; font-size: 11px; }.saved .commit-dot { color: var(--lab-blue); border-color: var(--mag-accent-border); }.version-history small { display: block; font-size: 11px; margin-bottom: 4px; }.version-history .selected { color: var(--lab-blue); }.selected .commit-dot { background: var(--mag-accent-soft); }.version-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 14px; }.version-state { color: var(--lab-blue); font-size: 12px; }.version-features { display: flex; justify-content: space-between; gap: 8px; margin-top: 16px; font-size: 12px; color: var(--lab-muted); }.version-features span { display: flex; align-items: center; gap: 6px; }.version-features .added { color: var(--lab-blue); }.version-diff { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; border-top: var(--mag-rule); padding-top: 16px; margin-top: 20px; color: var(--lab-muted); font-size: 12px; }.version-diff > span:last-child { margin-left: auto; color: var(--lab-blue); }.recorded > i { color: var(--lab-blue); }@media(max-width:500px) { .version-stage { grid-template-columns: 1fr; gap: 22px; }.version-history { display: flex; justify-content: space-between; }.version-history li { min-height: 46px; gap: 6px; }.version-history li:not(:last-child)::after { display: none; }.version-history li > i { display: none; }.version-history small { display: none; } }
</style>
