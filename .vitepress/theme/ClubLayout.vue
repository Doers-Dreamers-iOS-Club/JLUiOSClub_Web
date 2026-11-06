<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

const { frontmatter } = useData()
const sidebarCollapsed = ref(false)
</script>

<template>
  <DefaultTheme.Layout :class="{ 'article-sidebar-collapsed': frontmatter.pageClass === 'mag-article-page' && sidebarCollapsed }">
    <template #layout-top>
      <button
        v-if="frontmatter.pageClass === 'mag-article-page'"
        class="article-sidebar-toggle"
        type="button"
        :aria-expanded="!sidebarCollapsed"
        aria-controls="VPSidebarNav"
        :aria-label="sidebarCollapsed ? '展开目录' : '收起目录'"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >{{ sidebarCollapsed ? '目录 ›' : '‹ 收起' }}</button>
    </template>
  </DefaultTheme.Layout>
</template>

<style>
.article-sidebar-toggle { display: none; }
@media (min-width: 960px) {
  .article-sidebar-toggle { display: block; position: fixed; z-index: calc(var(--vp-z-index-sidebar) + 1); top: calc(var(--vp-nav-height) + 40px); left: calc(max(0px, (100vw - var(--vp-layout-max-width)) / 2) + var(--vp-sidebar-width) - 80px); padding: 4px 8px; color: var(--mag-text-secondary); background: var(--vp-sidebar-bg-color); font-size: 11px; line-height: 20px; }
  .article-sidebar-toggle:hover { color: var(--mag-accent); }
  .article-sidebar-toggle:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
  .article-sidebar-collapsed .VPSidebar { display: none; }
  .article-sidebar-collapsed .VPContent.has-sidebar { padding-inline: 0; }
  .article-sidebar-collapsed .article-sidebar-toggle { top: calc(var(--vp-nav-height) + 8px); left: 16px; background: var(--mag-surface); }
}
@media print { .article-sidebar-toggle { display: none; } }
</style>
