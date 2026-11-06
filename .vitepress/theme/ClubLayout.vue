<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { gsap } from 'gsap'

const { frontmatter, page } = useData()
const sidebarCollapsed = ref(false)
const isArticle = computed(() => frontmatter.value.pageClass === 'mag-article-page')
let articleMotion: gsap.core.Tween | undefined
let desktop: MediaQueryList, reducedMotion: MediaQueryList

function settleArticle() {
  articleMotion?.progress(1).kill()
  articleMotion = undefined
}
function syncSidebar() {
  settleArticle()
  const sidebar = document.querySelector<HTMLElement>('.VPSidebar')
  if (sidebar) sidebar.inert = isArticle.value && desktop.matches && sidebarCollapsed.value
}
async function toggleSidebar() {
  const article = document.querySelector<HTMLElement>('.mag-article')!
  const left = article.getBoundingClientRect().left
  settleArticle()
  sidebarCollapsed.value = !sidebarCollapsed.value
  await nextTick()
  syncSidebar()
  if (reducedMotion.matches) return
  articleMotion = gsap.fromTo(article, { x: left - article.getBoundingClientRect().left, willChange: 'transform' }, {
    x: 0, duration: .46, ease: 'power3.out', clearProps: 'transform,willChange',
  })
}
onMounted(() => {
  desktop = matchMedia('(min-width: 960px)')
  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  desktop.addEventListener('change', syncSidebar)
  reducedMotion.addEventListener('change', settleArticle)
  window.addEventListener('resize', settleArticle)
  watch(() => page.value.relativePath, syncSidebar, { flush: 'post' })
  syncSidebar()
})
onBeforeUnmount(() => {
  settleArticle()
  desktop.removeEventListener('change', syncSidebar)
  reducedMotion.removeEventListener('change', settleArticle)
  window.removeEventListener('resize', settleArticle)
})
</script>

<template>
  <DefaultTheme.Layout :class="{ 'article-sidebar-collapsed': isArticle && sidebarCollapsed }">
    <template #layout-top>
      <button
        v-if="isArticle"
        class="article-sidebar-toggle"
        type="button"
        :aria-expanded="!sidebarCollapsed"
        aria-controls="VPSidebarNav"
        :aria-label="sidebarCollapsed ? '展开目录' : '收起目录'"
        @click="toggleSidebar"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m13 4-6 6 6 6" /></svg>
      </button>
    </template>
  </DefaultTheme.Layout>
</template>

<style>
.article-sidebar-toggle { display: none; }
@media (min-width: 960px) {
  .Layout.mag-article-page { --article-sidebar-edge: calc(max(0px, (100vw - var(--vp-layout-max-width)) / 2) + var(--vp-sidebar-width)); --article-sidebar-ease: cubic-bezier(.22, 1, .36, 1); }
  .article-sidebar-toggle { display: grid; place-items: center; position: fixed; z-index: calc(var(--vp-z-index-sidebar) + 1); top: calc(var(--vp-nav-height) + 36px); left: calc(var(--article-sidebar-edge) - 8px); width: 44px; height: 52px; color: var(--mag-text-secondary); cursor: pointer; transition: transform .46s var(--article-sidebar-ease), color .2s; }
  .article-sidebar-toggle svg { width: 28px; height: 28px; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .3s var(--article-sidebar-ease); }
  .article-sidebar-toggle:hover svg { transform: translateX(-2px); }
  .article-sidebar-toggle:hover { color: var(--mag-accent); }
  .article-sidebar-toggle:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: -5px; border-radius: 8px; }
  .Layout.mag-article-page .VPSidebar { transition: transform .46s var(--article-sidebar-ease), opacity .3s, visibility 0s; }
  .Layout.article-sidebar-collapsed .VPSidebar { transform: translateX(-100%); opacity: 0; visibility: hidden; pointer-events: none; transition: transform .46s var(--article-sidebar-ease), opacity .3s, visibility 0s .46s; }
  .article-sidebar-collapsed .VPContent.has-sidebar { padding-inline: 0; }
  .article-sidebar-collapsed .article-sidebar-toggle { transform: translateX(calc(8px - var(--article-sidebar-edge))); }
  .article-sidebar-toggle[aria-expanded='false'] svg { transform: rotate(180deg); }
  .article-sidebar-toggle[aria-expanded='false']:hover svg { transform: translateX(2px) rotate(180deg); }
}
@media (prefers-reduced-motion: reduce) { .Layout.mag-article-page .VPSidebar, .article-sidebar-toggle, .article-sidebar-toggle svg { transition: none; } }
@media print { .article-sidebar-toggle { display: none; } }
</style>
