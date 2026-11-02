<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { data as activities } from '../../data/activities.data.mts'
import { data as news } from '../../data/news.data.mts'
import { data as competitions } from '../../data/competitions.data.mts'
import type { RecordEntry } from '../../data/shared'
const props = withDefaults(defineProps<{
  source?: 'activities' | 'news' | 'competitions'
  limit?: number
  highlightLatest?: boolean
  view?: 'timeline' | 'grid'
  showViewToggle?: boolean
}>(), { source: 'activities', highlightLatest: true, view: 'timeline', showViewToggle: true })
const sources = { activities, news, competitions }
const all = computed<RecordEntry[]>(() => sources[props.source])
const entries = computed(() => props.limit ? all.value.slice(0, props.limit) : all.value)
const currentView = ref(props.view)
const toggle = computed(() => props.showViewToggle && !props.limit)
const groups = computed(() => {
  const map = new Map<number, RecordEntry[]>()
  for (const entry of entries.value) map.set(entry.year, [...(map.get(entry.year) || []), entry])
  return [...map].map(([year, items]) => ({ year, items }))
})
onMounted(() => {
  if (!toggle.value) return
  try {
    const saved = localStorage.getItem('mag-archive-view')
    if (saved === 'timeline' || saved === 'grid') currentView.value = saved
  } catch {}
})
watch(currentView, view => {
  if (toggle.value) try { localStorage.setItem('mag-archive-view', view) } catch {}
})
</script>

<template>
  <div class="mag-archive" :class="{ 'mag-archive--preview': limit }">
    <div v-if="entries.length && !limit" class="mag-archive__bar">
      <span>{{ all.length }} 篇记录</span>
      <div v-if="toggle" class="mag-archive__toggle" role="group" aria-label="浏览方式">
        <button v-for="view in (['timeline', 'grid'] as const)" :key="view" type="button" :aria-pressed="currentView === view" @click="currentView = view"><i :class="['ti', view === 'timeline' ? 'ti-list' : 'ti-layout-grid']" aria-hidden="true" />{{ view === 'timeline' ? '时间线' : '网格' }}</button>
      </div>
    </div>
    <div v-if="limit" class="mag-archive__preview" data-mag-stagger>
      <a v-for="entry in entries" :key="entry.url" class="mag-archive__row" :href="entry.url">
        <time class="mag-archive__date">{{ entry.date }}</time>
        <div class="mag-archive__row-main"><h3>{{ entry.title }}</h3></div>
        <i class="ti ti-arrow-up-right mag-archive__arrow" aria-hidden="true" />
      </a>
    </div>
    <div v-else-if="currentView === 'timeline'" class="mag-archive__timeline">
      <section v-for="group in groups" :key="group.year" class="mag-archive__year">
        <h2>{{ group.year > 0 ? group.year : '未归档' }}<span>{{ group.items.length }} 篇</span></h2>
        <div class="mag-archive__entries" data-mag-stagger>
          <a v-for="entry in group.items" :key="entry.url" class="mag-archive__row" :href="entry.url">
            <time class="mag-archive__date">{{ entry.date }}</time>
            <div class="mag-archive__row-main"><h3>{{ entry.title }}</h3></div>
            <i class="ti ti-arrow-up-right mag-archive__arrow" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
    <div v-else class="mag-archive__grid">
      <a v-for="entry in entries" :key="entry.url" class="mag-archive__item" :href="entry.url">
        <div v-if="entry.cover" class="mag-archive__cover"><img :src="entry.cover" alt="" loading="lazy" decoding="async" /></div>
        <div class="mag-archive__item-content">
          <div class="mag-archive__meta"><time>{{ entry.date }}</time></div>
          <h3>{{ entry.title }}</h3>
          <i class="ti ti-arrow-up-right mag-archive__arrow" aria-hidden="true" />
        </div>
      </a>
    </div>
    <p v-if="!entries.length" class="mag-archive__empty">暂无内容。</p>
  </div>
</template>

<style scoped>
.mag-archive { margin: 2rem 0; }
.mag-archive__bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 1.25rem; border-bottom: var(--mag-rule); font-size: 13px; color: var(--mag-text-secondary); }
.mag-archive__toggle { display: flex; gap: 4px; }
.mag-archive__toggle button { display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 6px 10px; border: .5px solid transparent; border-radius: 6px; background: transparent; color: var(--mag-text-secondary); font: inherit; cursor: pointer; }
.mag-archive__toggle button[aria-pressed='true'] { border-color: var(--mag-hairline); background: var(--mag-surface-sunken); color: var(--mag-text); }
.mag-archive__year { margin-top: 2rem; }
.mag-archive__year h2 { display: flex; align-items: baseline; gap: 12px; border: 0; margin: 0 0 .5rem; padding: 0; font-size: 18px; font-weight: 500; }
.mag-archive__year h2 > span { color: var(--mag-text-secondary); font-size: 13px; font-weight: 400; }
.mag-archive__row { display: grid; grid-template-columns: 88px minmax(0, 1fr) 20px; align-items: baseline; gap: 20px; border-bottom: var(--mag-rule); padding: 24px 0; color: var(--mag-text); text-decoration: none; }
.mag-archive__date { font-size: 13px; color: var(--mag-text-secondary); white-space: nowrap; font-variant-numeric: tabular-nums; }
.mag-archive__row-main { transition: transform .5s var(--mag-ease); }
.mag-archive__row:hover .mag-archive__row-main { transform: translateX(4px); }
.mag-archive h3 { margin: 0 0 6px; padding: 0; border: 0; font-size: 16px; font-weight: 500; line-height: 1.5; }
.mag-archive__row p, .mag-archive__item p { margin: 0; font-size: 14px; line-height: 1.7; color: var(--mag-text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.mag-archive__arrow { font-size: 18px; color: var(--mag-text-secondary); transition: transform .45s var(--mag-ease), color .2s; }
.mag-archive a:hover .mag-archive__arrow { transform: translate(2px, -2px); color: var(--mag-accent); }
.mag-archive__preview .mag-archive__row:first-child { padding-top: 0; }
.mag-archive__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 24px; align-items: start; }
.mag-archive__item { display: block; overflow: hidden; border: var(--mag-rule); border-radius: 12px; color: var(--mag-text); text-decoration: none; transition: border-color .2s; }
.mag-archive__item:hover { border-color: var(--mag-hairline-strong); }
.mag-archive__cover { overflow: hidden; aspect-ratio: 16 / 9; border-bottom: var(--mag-rule); }
.mag-archive__cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .85s var(--mag-ease); }
.mag-archive__item:hover img { transform: scale(1.025); }
.mag-archive__item-content { padding: 20px; }
.mag-archive__meta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; color: var(--mag-text-secondary); font-size: 13px; }
.mag-archive__item .mag-archive__arrow { display: block; width: fit-content; margin: 20px 0 0 auto; }
.mag-archive__empty { color: var(--mag-text-secondary); padding: 2rem 0; }
@media (max-width: 700px) {
  .mag-archive__row { grid-template-columns: minmax(0, 1fr) 20px; gap: 8px 16px; padding: 20px 0; }
  .mag-archive__date { grid-column: 1; }
  .mag-archive__row-main { grid-column: 1; }
  .mag-archive__row > .mag-archive__arrow { grid-column: 2; grid-row: 2; }
}
@media (max-width: 480px) { .mag-archive__grid { grid-template-columns: 1fr; } }
</style>
