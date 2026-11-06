<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase, type DefaultTheme } from 'vitepress'
import RollText from '../RollText.vue'

const props = defineProps<{ items: DefaultTheme.SidebarItem[] }>()
const { page } = useData()
const currentPath = computed(() => '/' + page.value.relativePath.replace(/(?:index)?\.md$/, '').replace(/\/$/, ''))
const isWorkshop = computed(() => currentPath.value.startsWith('/activities/260209-winter-swift/'))
const groups = computed(() => {
  let number = 0
  return props.items.map(group => ({
    title: group.text,
    entries: group.items!.map(item => ({
      title: item.text!,
      href: item.link!,
      number: String(++number).padStart(2, '0'),
      active: item.link!.replace(/\/$/, '') === currentPath.value,
    })),
  }))
})
</script>

<template>
  <div class="magazine-sidebar">
    <header class="contents-masthead">
      <div class="contents-title"><span>目次</span><span lang="en">Contents<br><i>& stories.</i></span></div>
    </header>
    <a class="contents-index" :href="withBase('/activities/#activity-content')"><RollText text="全部活动" /><span aria-hidden="true">↗</span></a>
    <a v-if="isWorkshop" class="contents-index" :href="withBase('/activities/260209-winter-swift/')"><RollText text="工作坊总览" /><span aria-hidden="true">↗</span></a>
    <section v-for="(group, index) in groups" :key="group.title" class="contents-section" :aria-labelledby="`contents-section-${index}`">
      <h2 :id="`contents-section-${index}`">{{ group.title }}</h2>
      <ol>
        <li v-for="entry in group.entries" :key="entry.href">
          <a class="contents-entry" :href="withBase(entry.href)" :aria-current="entry.active ? 'page' : undefined" :style="{ '--entry-order': Number(entry.number) - 1 }">
            <span class="contents-number" aria-hidden="true">{{ entry.number }}</span>
            <span class="contents-label"><RollText :text="entry.title" /></span>
          </a>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.magazine-sidebar { padding-top: 28px; color: var(--mag-text); }
.contents-masthead { border-top: 2px solid var(--mag-text); padding-top: 13px; }
.contents-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 0 0 20px; }
.contents-title > span:first-child { font: 30px/1.2 var(--mag-font-serif); letter-spacing: -.08em; }
.contents-title > span:last-child { font: 17px/1.15 var(--mag-font-serif); }
.contents-title i { color: var(--mag-accent); }
.contents-index { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 0; border-top: var(--mag-rule-strong); font-size: 12px; }
.contents-index > span { color: var(--mag-accent); }
.contents-section { margin-top: 24px; }
.contents-section h2 { margin: 0; padding: 10px 0; border-top: var(--mag-rule-strong); color: var(--mag-text-secondary); font-size: 11px; font-weight: 400; letter-spacing: .1em; }
.contents-section ol { list-style: none; margin: 0; padding: 0; }
.contents-section li + li { border-top: var(--mag-rule); }
.contents-entry { position: relative; display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; padding: 13px 0; }
.contents-number { padding-top: 1px; color: var(--mag-text-secondary); font: italic 18px/1.25 var(--mag-font-serif); }
.contents-label { font-size: 13px; line-height: 1.7; }
.contents-entry[aria-current]::before { content: ''; position: absolute; top: 17px; left: -14px; width: 3px; height: 18px; background: var(--mag-accent); }
.contents-entry[aria-current] .contents-number, .contents-entry[aria-current] :deep(.roll-track) { color: var(--mag-accent); }
.magazine-sidebar a:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 4px; }
@media (max-width: 959px) { .magazine-sidebar { padding-top: 8px; } }
</style>

<style>
@keyframes contents-entry-in { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }
@media (min-width: 960px) {
  .mag-article-page:not(.article-sidebar-collapsed) .contents-entry { animation: contents-entry-in .4s var(--mag-ease) backwards; animation-delay: calc(.1s + var(--entry-order) * .025s); }
}
@media (max-width: 959px) {
  .mag-article-page .VPSidebar.open .contents-entry { animation: contents-entry-in .4s var(--mag-ease) backwards; animation-delay: calc(.1s + var(--entry-order) * .025s); }
}
@media (prefers-reduced-motion: reduce) { .Layout.mag-article-page .contents-entry { animation: none; } }
</style>

