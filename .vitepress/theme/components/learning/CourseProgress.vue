<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { chapters, courseBase } from '../../../data/course'
import { readState } from '../../composables/readingState'
defineProps<{ editorial?: boolean }>()
const completed = ref<string[]>([])
const last = ref('')
const next = computed(() => chapters.find(c => c.id === last.value && !completed.value.includes(c.id)) || chapters.find(c => !completed.value.includes(c.id)) || chapters[0])
function sync() { const s = readState(); completed.value = s.completed; last.value = s.last }
onMounted(() => { sync(); window.addEventListener('storage', sync); window.addEventListener('jlu-reading-change', sync) })
onUnmounted(() => { window.removeEventListener('storage', sync); window.removeEventListener('jlu-reading-change', sync) })
</script>
<template>
  <section class="course-progress mag-no-reveal" :class="{ 'course-progress--editorial': editorial }" aria-label="主线阅读进度">
    <div class="course-progress__top"><span>你的阅读足迹</span><span>{{ completed.length }} / {{ chapters.length }} 章已读</span></div>
    <div class="course-progress__track" role="progressbar" :aria-valuenow="completed.length" :aria-valuemin="0" :aria-valuemax="chapters.length" aria-label="已读章节"><span :style="{ width: `${completed.length / chapters.length * 100}%` }" /></div>
    <a :href="courseBase + 'chapters/' + next.id">{{ completed.length === chapters.length ? '回顾第一章' : last ? '继续阅读' : '从第一章开始' }}：{{ next.title }} <span aria-hidden="true">→</span></a>
  </section>
</template>
<style scoped>
.course-progress { padding: 1.3rem 1.5rem; border: var(--mag-rule); border-radius: var(--mag-radius-sm); background: var(--mag-surface); }
.course-progress__top { display: flex; justify-content: space-between; gap: 1rem; font-size: 14px; color: var(--mag-text-secondary); }
.course-progress__track { height: 4px; margin: 1rem 0 .5rem; background: var(--mag-surface-sunken); border-radius: 4px; overflow: hidden; }
.course-progress__track span { display: block; height: 100%; background: var(--mag-accent); }
.course-progress a { display: inline-flex; align-items: center; min-height: 44px; font-size: 14px; }
.course-progress small { display: block; font-size: 14px; color: var(--mag-text-secondary); }
.course-progress--editorial { display: grid; grid-template-columns: 1fr auto; column-gap: 40px; padding: 24px 0 0; border: 0; border-radius: 0; background: transparent; }
.course-progress--editorial .course-progress__top { grid-column: 1; font-size: 11px; }
.course-progress--editorial .course-progress__track { grid-column: 1; height: 2px; margin: 10px 0 0; border-radius: 0; }
.course-progress--editorial a { grid-column: 2; grid-row: 1 / 3; color: var(--mag-text-secondary); text-decoration: none; font-size: 12px; min-height: 36px; }
.course-progress--editorial a:hover { color: var(--mag-accent); }
@media (max-width: 640px) {
  .course-progress--editorial { grid-template-columns: 1fr; padding-top: 20px; }
  .course-progress--editorial a { grid-column: 1; grid-row: 3; margin-top: 8px; }
}
</style>
