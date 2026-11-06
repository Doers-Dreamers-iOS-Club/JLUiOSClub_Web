<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { chapterIds, courseBase } from '../../../data/course'
import { readState, saveState } from '../../composables/readingState'
const props = defineProps<{ chapter: string }>()
const complete = ref(false)
const message = ref('')
const main = computed(() => chapterIds.includes(props.chapter))
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
    <div class="reading-tools__actions">
      <a :href="courseBase">全部章节</a>
      <a :href="courseBase + 'materials/'">配套材料</a>
      <button v-if="main" type="button" :aria-pressed="complete" @click="toggle">{{ complete ? '已读 · 点击取消' : '标记为已读' }}</button>
    </div>
    <p v-if="message" class="reading-tools__status" role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.reading-tools { margin: 1.25rem 0 2rem; padding-bottom: 1rem; border-bottom: var(--mag-rule); color: var(--mag-text-secondary); font-size: 14px; }
.reading-tools__meta, .reading-tools__actions { display: flex; flex-wrap: wrap; gap: .5rem 1.3rem; align-items: center; }
.reading-tools__actions { margin-top: .6rem; }
.reading-tools__actions a, button { display: inline-flex; align-items: center; min-height: 44px; }
button { cursor: pointer; padding: .3rem .8rem; border: var(--mag-rule); border-radius: 8px; color: var(--mag-accent); }
button[aria-pressed=true] { background: var(--mag-accent-soft); border-color: var(--mag-accent); }
button:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.reading-tools__status { margin: .2rem 0 0; font-size: 14px; }
</style>
