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
      <span class="contents-eyebrow" lang="en">JLU iOS CLUB / FIELD NOTES</span>
      <div class="contents-title"><span>目次</span><span lang="en">Contents<br><i>& stories.</i></span></div>
      <p>{{ isWorkshop ? 'Winter Swift · 学习专题' : '社团活动 · 在这里发生' }}</p>
    </header>
    <a class="contents-index" :href="withBase('/activities/#activity-content')"><RollText text="浏览全部活动" /><span aria-hidden="true">↗</span></a>
    <a v-if="isWorkshop" class="contents-index" :href="withBase('/activities/260209-winter-swift/')"><RollText text="返回工作坊总览" /><span aria-hidden="true">↗</span></a>
    <section v-for="(group, index) in groups" :key="group.title" class="contents-section" :aria-labelledby="`contents-section-${index}`">
      <h2 :id="`contents-section-${index}`"><span>{{ group.title }}</span><span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }} /</span></h2>
      <ol>
        <li v-for="entry in group.entries" :key="entry.href">
          <a class="contents-entry" :href="withBase(entry.href)" :aria-current="entry.active ? 'page' : undefined">
            <span class="contents-number" aria-hidden="true">{{ entry.number }}</span>
            <span class="contents-label"><RollText :text="entry.title" /><span v-if="entry.active" class="contents-current">正在阅读</span></span>
          </a>
        </li>
      </ol>
    </section>
    <footer class="contents-colophon"><span aria-hidden="true">✳</span><span lang="en">DOERS & DREAMERS<br>Ideas into stories.</span></footer>
  </div>
</template>

<style scoped>
.magazine-sidebar { padding-top: 28px; color: var(--mag-text); }
.contents-masthead { border-top: 2px solid var(--mag-text); padding-top: 13px; }
.contents-eyebrow { font: 8px var(--mag-font-mono); letter-spacing: .05em; color: var(--mag-text-secondary); }
.contents-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 20px 0 16px; }
.contents-title > span:first-child { font: 42px/1.15 var(--mag-font-serif); letter-spacing: -.08em; }
.contents-title > span:last-child { font: 17px/1.15 var(--mag-font-serif); }
.contents-title i { color: var(--mag-accent); }
.contents-masthead p { margin: 0 0 20px; font-size: 11px; letter-spacing: .06em; color: var(--mag-text-secondary); }
.contents-index { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 0; border-top: var(--mag-rule-strong); font-size: 12px; }
.contents-index > span { color: var(--mag-accent); }
.contents-section { margin-top: 24px; }
.contents-section h2 { display: flex; justify-content: space-between; margin: 0; padding: 10px 0; border-top: var(--mag-rule-strong); color: var(--mag-text-secondary); font-size: 10px; font-weight: 400; letter-spacing: .1em; }
.contents-section h2 > span:last-child { font-family: var(--mag-font-mono); }
.contents-section ol { list-style: none; margin: 0; padding: 0; }
.contents-section li + li { border-top: var(--mag-rule); }
.contents-entry { position: relative; display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px; padding: 13px 0; }
.contents-number { padding-top: 1px; color: var(--mag-text-secondary); font: italic 18px/1.25 var(--mag-font-serif); }
.contents-label { font-size: 13px; line-height: 1.7; }
.contents-entry[aria-current]::before { content: ''; position: absolute; top: 17px; left: -14px; width: 3px; height: 18px; background: var(--mag-accent); }
.contents-entry[aria-current] .contents-number, .contents-entry[aria-current] :deep(.roll-track) { color: var(--mag-accent); }
.contents-current { display: block; margin-top: 5px; color: var(--mag-accent); font-size: 9px; letter-spacing: .1em; }
.magazine-sidebar a:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 4px; }
.contents-colophon { display: flex; align-items: center; gap: 12px; margin-top: 32px; padding-top: 18px; border-top: var(--mag-rule-strong); color: var(--mag-text-secondary); }
.contents-colophon > span:first-child { color: var(--mag-accent); font-size: 28px; }
.contents-colophon > span:last-child { font: 8px/1.8 var(--mag-font-mono); letter-spacing: .04em; }
@media (max-width: 959px) { .magazine-sidebar { padding-top: 8px; } }
</style>

