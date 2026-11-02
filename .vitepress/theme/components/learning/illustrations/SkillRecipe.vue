<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import { useLabPlayback } from './useLabPlayback'
const root = ref<HTMLElement | null>(null)
const frame = ref(0)
const groups = [{ id: 'fact', name: '事实', icon: 'ti-file' }, { id: 'task', name: '任务', icon: 'ti-checklist' }, { id: 'method', name: '方法', icon: 'ti-book' }, { id: 'tool', name: '工具', icon: 'ti-tool' }]
const cards = computed(() => [
  { group: 'fact', title: frame.value >= 7 ? '打砖块' : '贪吃蛇' },
  { group: 'task', title: '两档速度' },
  { group: 'method', title: '先读再改' },
  { group: 'method', title: '浏览器验证' },
  { group: 'tool', title: '点击' },
  { group: 'tool', title: '文件读写' }
])
useLabPlayback(root, () => { frame.value++; return frame.value < 8 }, 1100, { reset: () => { frame.value = 0 }, static: () => { frame.value = 7 } })
</script>
<template>
  <div ref="root" class="skill-recipe" :data-demo-frame="frame">
    <LabFrame title="方法可以复用">
      <div class="lab-stage">
        <div class="recipe-source" aria-label="待归类材料"><span v-for="(card,index) in cards" :key="index" class="lab-tag" :class="{ placed: index < frame }">{{ card.title }}</span></div>
        <div class="recipe-folders"><div v-for="group in groups" :key="group.id" class="recipe-folder" :class="{ reusable: group.id === 'method' && frame >= 4 }"><div class="folder-title"><i :class="['ti', group.icon]" aria-hidden="true" /><span>{{ group.name }}</span><i v-if="group.id === 'method' && frame >= 7" class="ti ti-repeat" aria-hidden="true" /></div><div class="folder-body"><template v-for="(card,index) in cards" :key="index"><span v-if="index < frame && card.group === group.id" :key="card.title" class="lab-tag lab-enter">{{ card.title }}</span></template></div></div></div>
        <div class="recipe-status" aria-hidden="true"><span :class="{ active: frame < 7 }">归类</span><i class="ti ti-arrow-right" /><span :class="{ active: frame >= 7 }">换项目，沿用方法</span></div>
      </div>
    </LabFrame>
  </div>
</template>
<style scoped>
.recipe-source { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; margin-bottom: 24px; }.recipe-source .lab-tag { text-align: center; transition: opacity .4s; }.recipe-source .placed { opacity: .2; }.recipe-folders { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; }.recipe-folder { min-height: 154px; border: var(--mag-rule); border-radius: 8px; }.recipe-folder.reusable { border-color: var(--mag-accent-border); background: var(--mag-accent-soft); }.folder-title { display: flex; align-items: center; gap: 8px; padding: 16px; font-size: 14px; }.folder-title > i { color: var(--lab-blue); font-size: 20px; }.folder-title > i:last-child { margin-left: auto; }.folder-body { display: flex; flex-wrap: wrap; align-items: start; gap: 8px; padding: 0 16px 16px; }.recipe-status { display: flex; justify-content: center; gap: 12px; padding-top: 24px; font-size: 13px; color: var(--lab-muted); }.recipe-status .active { color: var(--lab-blue); }@media(max-width:420px) { .recipe-source { grid-template-columns: repeat(2,minmax(0,1fr)); }.recipe-folders { gap: 8px; }.folder-title { padding: 12px; }.folder-body { padding: 0 12px 12px; } }
</style>
