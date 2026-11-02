<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const versions = [{ name: '初始版', speed: false, pause: false }, { name: '速度版', speed: true, pause: false }, { name: '暂停版', speed: true, pause: true }]
const before = computed(() => frame.value < 12 ? 0 : 1)
const after = computed(() => before.value + 1)
const pair = computed(() => [versions[before.value],versions[after.value]])
const split = computed(() => 100 - Math.min(10, frame.value % 12) * 10)
useLabPlayback(root, () => { frame.value++; return frame.value < 23 }, 300, { reset: () => { frame.value = 0 }, static: () => { frame.value = 17 } })
</script>
<template>
  <div ref="root" class="version-book" :data-demo-frame="frame">
    <LabFrame title="每一版，都有迹可循">
      <div class="lab-stage">
        <div class="book-spine"><span v-for="(version,index) in versions" :key="version.name" :class="{ active: index === after }"><i>{{ String(index+1).padStart(2,'0') }}</i>{{ version.name }}</span></div>
        <div class="wipe-preview" :key="before">
          <div v-for="(version,index) in pair" :key="index" class="preview-page" :class="{ 'preview-after': index === 1 }" :style="index === 1 ? { clipPath: `inset(0 0 0 ${split}%)` } : {}">
            <div class="page-heading">{{ version.name }}</div>
            <SnakeScene :position="3" :food="false" :label="version.name" />
            <div class="snapshot-controls"><span :class="{ added: version.speed }">{{ version.speed ? '轻松 / 标准' : '固定速度' }}</span><span>重开</span><span :class="{ added: version.pause }">{{ version.pause ? '暂停 / 继续' : '—' }}</span></div>
          </div>
          <div class="wipe-line" :style="{ left: `${split}%` }" aria-hidden="true" />
        </div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.book-spine { display: flex; gap: 16px; margin-bottom: 24px; }.book-spine span { flex: 1; padding-bottom: 12px; border-bottom: var(--mag-rule); color: var(--lab-muted); font-size: 13px; }.book-spine i { font-style: normal; margin-right: 8px; }.book-spine .active { color: var(--lab-blue); border-color: var(--lab-blue); }.wipe-preview { position: relative; max-width: 520px; margin: auto; overflow: hidden; border: var(--mag-rule); border-radius: 8px; }.preview-page { padding: 16px; background: var(--lab-paper); }.preview-after { position: absolute; inset: 0; transition: clip-path .3s linear; }.page-heading { font-size: 14px; margin-bottom: 16px; }.snapshot-controls { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; margin-top: 12px; }.snapshot-controls span { padding: 10px 4px; font-size: 12px; text-align: center; border: var(--mag-rule); border-radius: 6px; color: var(--lab-muted); }.snapshot-controls .added { background: var(--mag-accent-soft); color: var(--lab-blue); border-color: var(--mag-accent-border); }.wipe-line { position: absolute; top: 0; bottom: 0; border-left: 2px solid var(--lab-blue); transition: left .3s linear; }@media(max-width:420px) { .preview-page { padding: 10px; }.snapshot-controls { gap: 4px; }.snapshot-controls span { font-size: 11px; }.book-spine { gap: 8px; }.book-spine i { display: block; } }
</style>
