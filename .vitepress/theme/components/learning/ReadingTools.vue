<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { courseBase, readState, saveState } from './course'
const props = defineProps<{ chapter: string; minutes: number }>()
const complete = ref(false)
const message = ref('')
const main = computed(() => /^0[1-6]$/.test(props.chapter))
onMounted(() => {
  if (!main.value) return
  const state = readState()
  complete.value = state.completed.includes(props.chapter)
  saveState({ ...state, last: props.chapter })
})
function toggle() {
  const state = readState()
  complete.value = !complete.value
  const completed = state.completed.filter(id => id !== props.chapter)
  if (complete.value) completed.push(props.chapter)
  const saved = saveState({ completed, last: props.chapter })
  message.value = saved ? (complete.value ? '已记下这一章的阅读进度。' : '已取消已读标记。') : '当前浏览器无法保存；本次标记仍可使用。'
}
</script>
<template>
  <div class="reading-tools mag-no-reveal">
    <div class="reading-tools__meta"><span>JLU iOS Club · AI 编程入门</span><span>约 {{ minutes }} 分钟阅读 · 不含练习</span></div>
    <div class="reading-tools__actions">
      <a :href="courseBase">全部章节</a>
      <a :href="courseBase + 'materials/'">配套材料</a>
      <button v-if="main" type="button" :aria-pressed="complete" @click="toggle">{{ complete ? '已读 · 点击取消' : '标记为已读' }}</button>
    </div>
    <p class="reading-tools__status" role="status">{{ message || (main ? '阅读标记仅保存在当前浏览器。' : '补充学习 · 按需要阅读。') }}</p>
  </div>
</template>
<style scoped>
.reading-tools { margin: 1.25rem 0 2rem; padding-bottom: 1rem; border-bottom: var(--mag-rule); color: var(--mag-text-secondary); font-size: .85rem; }
.reading-tools__meta, .reading-tools__actions { display: flex; flex-wrap: wrap; gap: .5rem 1.3rem; align-items: center; }
.reading-tools__actions { margin-top: .6rem; }
.reading-tools__actions a, button { display: inline-flex; align-items: center; min-height: 44px; }
button { cursor: pointer; padding: .3rem .8rem; border: var(--mag-rule); border-radius: 8px; color: var(--mag-accent); }
button[aria-pressed=true] { background: var(--mag-accent-soft); border-color: var(--mag-accent); }
button:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.reading-tools__status { margin: .2rem 0 0; font-size: .78rem; }
</style>
