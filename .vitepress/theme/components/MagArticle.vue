<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import VPDocAsideOutline from 'vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue'
import { useArticleOutline } from '../composables/useArticleOutline'

const { frontmatter } = useData()
const hasOutline = computed(() => frontmatter.value.articleOutline === true)
const header = ref<HTMLElement>()
const outlinePanel = ref<HTMLElement>()
useArticleOutline(header, outlinePanel)

const props = withDefaults(defineProps<{
  title: string
  description: string
  date?: string
  issue: string
  category: string
  kind?: string
  author?: string
  dateLabel?: string
  numbered?: boolean
  next?: { title: string; href: string }
  indexHref?: string
  indexLabel?: string
  masthead?: string
  edition?: string
}>(), { kind: '活动回顾', author: '大学生创新应用工坊', dateLabel: '活动日期', numbered: true,
  indexHref: '/activities/#activity-content', indexLabel: '返回活动目录', masthead: '社团活动 · 现场手记', edition: 'FIELD NOTES' })
const titleLines = computed(() => props.title.replaceAll('，', '，\n').split('\n'))
</script>

<template>
  <article class="mag-article" :class="{ 'mag-article--numbered': numbered, 'mag-article--with-outline': hasOutline }">
    <header ref="header" class="mag-article__header">
      <div class="mag-article__masthead">
        <a :href="indexHref">{{ masthead }}</a>
        <span lang="en">JLU iOS CLUB / {{ edition }}</span>
      </div>
      <div class="mag-article__opening">
        <div>
          <p class="mag-article__category">{{ category }}</p>
          <h1><span v-for="line in titleLines" :key="line">{{ line }}</span></h1>
          <p class="mag-article__description">{{ description }}</p>
        </div>
        <div class="mag-article__edition" aria-label="文章编号">
          <span lang="en">{{ edition }}</span>
          <span class="mag-article__number">{{ issue }}</span>
        </div>
      </div>
      <div class="mag-article__byline">
        <span>{{ author }}</span>
        <time v-if="date" :datetime="date" :aria-label="`${dateLabel} ${date}`"><span v-if="dateLabel !== '活动日期'">{{ dateLabel }} · </span>{{ date.replaceAll('-', '.') }}</time>
        <span>{{ kind }}</span>
      </div>
    </header>
    <div class="mag-article__reading">
      <div class="mag-article__body"><slot /></div>
      <aside v-if="hasOutline" class="mag-article__outline" aria-label="页内导航">
        <div ref="outlinePanel" class="mag-article__outline-panel" data-state="hidden" inert>
          <VPDocAsideOutline />
        </div>
      </aside>
    </div>
    <footer class="mag-article__footer">
      <span class="mag-article__endmark" aria-hidden="true">■</span>
      <p>{{ author }} <span lang="en">/ {{ edition }} {{ issue }}</span></p>
      <nav aria-label="文章导航">
        <a :href="indexHref">{{ indexLabel }} <span aria-hidden="true">↗</span></a>
        <a v-if="next" :href="next.href"><span class="mag-article__next-label">继续阅读</span>{{ next.title }} <span aria-hidden="true">→</span></a>
      </nav>
    </footer>
  </article>
</template>

<style scoped>
.mag-article { margin: 0 auto; max-width: 1080px; color: var(--mag-text); }
.mag-article__reading { position: relative; }
.mag-article__outline { display: none; }
.mag-article__outline-panel { opacity: 0; visibility: hidden; }
.mag-article__outline :deep(ul) { list-style: none; margin: 0; padding: 0; }
.mag-article__outline :deep(li) { margin: 0; }
.mag-article__outline :deep(a) { text-decoration: none; }
.mag-article__outline :deep(.nested) { padding-left: 16px; }
.mag-article__masthead { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px 24px; padding-bottom: 16px; border-bottom: 1px solid var(--mag-text); font-size: 12px; letter-spacing: .08em; }
.mag-article__masthead a { color: inherit; text-decoration: none; }
.mag-article__masthead > span { color: var(--mag-text-secondary); font: 10px var(--mag-font-mono); letter-spacing: .1em; }
.mag-article__opening { display: grid; grid-template-columns: minmax(0, 1fr) 140px; gap: 48px; align-items: start; padding: 50px 0 36px; }
.mag-article__category { margin: 0 0 24px; color: var(--mag-accent); font-size: 13px; letter-spacing: .06em; }
.mag-article h1 { max-width: 13em; margin: 0; font-family: var(--mag-font-serif); font-size: clamp(34px, 4.6vw, 62px); font-weight: 600; line-height: 1.4; letter-spacing: -.04em; text-wrap: balance; }
.mag-article h1 > span { display: block; }
.mag-article__description { max-width: 38em; margin: 26px 0 0; color: var(--mag-text-secondary); font-size: 17px; line-height: 1.9; }
.mag-article__edition { display: grid; justify-items: end; padding-top: 5px; }
.mag-article__edition > span:first-child { font: 10px var(--mag-font-mono); letter-spacing: .13em; color: var(--mag-text-secondary); }
.mag-article__number { font: italic 112px/1.2 var(--mag-font-serif); letter-spacing: -.07em; color: var(--mag-accent); }
.mag-article__byline { display: flex; flex-wrap: wrap; gap: 12px 24px; padding: 18px 0; border-block: var(--mag-rule); color: var(--mag-text-secondary); font-size: 12px; }
.mag-article__byline time { font-family: var(--mag-font-mono); }
.mag-article__byline > :last-child { margin-left: auto; }
.mag-article__body { max-width: 680px; margin: 56px auto 64px; counter-reset: article-section; }
.mag-article__body :deep(p), .mag-article__body :deep(li) { font-size: 17px; line-height: 2; letter-spacing: .015em; }
.mag-article__body :deep(p) { margin: 20px 0; }
.mag-article__body :deep(> p:first-child) { font-family: var(--mag-font-serif); font-size: 20px; line-height: 1.95; }
.mag-article__body :deep(h2) { position: relative; margin: 56px 0 24px; padding: 0; border: 0; font-family: var(--mag-font-serif); font-size: 26px; font-weight: 600; line-height: 1.6; text-wrap: pretty; }
.mag-article--numbered .mag-article__body :deep(h2)::before { counter-increment: article-section; content: counter(article-section, decimal-leading-zero); position: absolute; left: -58px; top: 5px; color: var(--mag-accent); font: italic 24px/1.6 var(--mag-font-serif); }
.mag-article__body :deep(h3) { margin: 32px 0 12px; font-size: 18px; font-weight: 600; }
.mag-article__body :deep(strong) { font-weight: 600; }
.mag-article__body :deep(blockquote) { margin: 40px -64px; padding: 24px 40px; border-inline: 0; border-block: var(--mag-rule); text-align: center; }
.mag-article__body :deep(blockquote p) { margin: 0; color: var(--mag-accent); font: 25px/1.8 var(--mag-font-serif); text-wrap: balance; }
.mag-article__body :deep(ul) { margin: 20px 0; padding-left: 1.4em; }
.mag-article__body :deep(li + li) { margin-top: 10px; }
.mag-article__footer { max-width: 808px; margin: 0 auto; padding-bottom: 32px; }
.mag-article__endmark { display: block; color: var(--mag-accent); font-size: 8px; text-align: center; }
.mag-article__footer > p { margin: 32px 0 20px; color: var(--mag-text-secondary); font-size: 12px; }
.mag-article__footer > p span { margin-left: 8px; font: 10px var(--mag-font-mono); }
.mag-article__footer nav { display: flex; justify-content: space-between; gap: 24px; border-top: var(--mag-rule-strong); padding-top: 24px; }
.mag-article__footer nav a { color: var(--mag-text); text-decoration: none; font-size: 14px; line-height: 1.8; }
.mag-article__footer nav a:hover { color: var(--mag-accent); }
.mag-article__next-label { display: block; color: var(--mag-text-secondary); font-size: 11px; }
.mag-article__footer nav a:last-child { text-align: right; }

.mag-article__body :deep(.article-facts) { margin: 32px 0; padding: 20px 0; border-block: var(--mag-rule); color: var(--mag-text-secondary); }
.mag-article__body :deep(.article-facts p) { margin: 8px 0; font-size: 14px; line-height: 1.9; }
.mag-article__body :deep(.article-contents) { margin: 32px 0; padding: 20px 0; border-block: var(--mag-rule); }
.mag-article__body :deep(.article-contents summary) { cursor: pointer; font-size: 14px; font-weight: 500; }
.mag-article__body :deep(.article-contents ol) { padding-left: 24px; margin-bottom: 0; }
.mag-article__body :deep(.article-contents li) { font-size: 14px; line-height: 1.8; }
.mag-article__body :deep(.article-contents a) { color: var(--mag-text-secondary); text-decoration: none; }
.mag-article__body :deep(.article-contents a:hover) { color: var(--mag-accent); }
.mag-article__body :deep(figure) { margin: 32px 0; }
.mag-article__body :deep(figure img) { display: block; margin-inline: auto; width: auto; max-width: 100%; height: auto; max-height: 38rem; border: 0; border-radius: 2px; }
.mag-article__body :deep(figcaption) { margin: 12px 0 0; color: var(--mag-text-secondary); font-size: 12px; line-height: 1.7; text-align: left; }
.mag-article__body :deep(.mag-grid--media) { margin: 32px 0; }
.mag-article__body :deep(.mag-grid--media figure) { margin: 0; }
.mag-article__body :deep(.mag-grid--media img) { width: 100%; height: auto; max-height: none; }
.mag-article__body :deep(.mag-note), .mag-article__body :deep(.custom-block) { margin: 28px 0; padding: 8px 0 8px 20px; border: 0; border-left: 2px solid var(--mag-hairline-strong); border-radius: 0; background: transparent; }
.mag-article__body :deep(.mag-note p), .mag-article__body :deep(.custom-block p), .mag-article__body :deep(.mag-note li), .mag-article__body :deep(.custom-block li) { font-size: 15px; }
.mag-article__body :deep(.mag-note h3) { font-family: var(--mag-font-display); font-size: 17px; }
.mag-article__body :deep(.mag-note__title), .mag-article__body :deep(.custom-block-title) { margin-top: 0; font-weight: 600; }
.mag-article__body :deep(div[class*='language-']) { margin: 24px 0; max-width: 100%; border-radius: 2px; }
.mag-article__body :deep(table) { display: block; max-width: 100%; overflow-x: auto; font-size: 14px; }
.mag-article__body :deep(iframe), .mag-article__body :deep(video) { max-width: 100%; }
.mag-article__body :deep(.mermaid) { max-width: 100%; overflow-x: auto; }
.mag-article__body :deep(.dual-qr) { flex-wrap: wrap; }
.mag-article__body :deep(.dual-qr img) { max-width: 100%; }
.mag-article__body :deep(a), .mag-article__body :deep(:not(pre) > code) { overflow-wrap: anywhere; }

@media (max-width: 1279px) {
  .mag-article__opening { grid-template-columns: minmax(0, 1fr) 85px; gap: 24px; }
  .mag-article__number { font-size: 84px; }
  .mag-article h1 { font-size: clamp(34px, 4.6vw, 52px); }
  .mag-article__body { padding-inline: 32px; }
  .mag-article--numbered .mag-article__body :deep(h2)::before { position: static; display: block; margin-bottom: 6px; font-size: 20px; }
  .mag-article__body :deep(blockquote) { margin-inline: -24px; padding-inline: 24px; }
}
@media (max-width: 600px) {
  .mag-article__masthead { font-size: 11px; }
  .mag-article__opening { display: block; position: relative; padding: 32px 0 28px; }
  .mag-article__category { max-width: calc(100% - 36px); margin-bottom: 20px; font-size: 11px; }
  .mag-article__edition { position: absolute; top: 28px; right: 0; padding: 0; }
  .mag-article__edition > span:first-child { display: none; }
  .mag-article__number { font-size: 24px; }
  .mag-article__description { font-size: 15px; margin-top: 20px; }
  .mag-article__byline { gap: 8px 16px; font-size: 11px; }
  .mag-article__body { margin: 36px auto 48px; padding: 0; }
  .mag-article__body :deep(p), .mag-article__body :deep(li) { font-size: 16px; line-height: 1.95; }
  .mag-article__body :deep(> p:first-child) { font-size: 18px; }
  .mag-article__body :deep(h2) { margin-top: 40px; font-size: 23px; }
  .mag-article__body :deep(blockquote) { margin: 32px 0; padding: 20px 8px; }
  .mag-article__body :deep(blockquote p) { font-size: 21px; }
  .mag-article__footer nav { flex-direction: column; gap: 20px; }
}
@media print {
  .mag-article__footer nav { display: none; }
  .mag-article__opening { padding-top: 24px; }
  .mag-article__body :deep(h2), .mag-article__body :deep(h3) { break-after: avoid; }
  .mag-article__body :deep(blockquote) { break-inside: avoid; }
}
</style>

<style>
@media (min-width: 1280px) {
  .article-sidebar-collapsed .mag-article__outline { display: block; position: absolute; inset: 0 auto 0 calc(50% + 372px); width: 224px; }
  .mag-article__outline-panel { position: sticky; top: calc(var(--vp-nav-height) + 32px); max-height: calc(100svh - var(--vp-nav-height) - 64px); overflow-y: auto; }
}
@media print { .mag-article__outline { display: none !important; } }
.mag-article-page .VPDoc { padding: 40px 48px 64px; }
.mag-article-page .VPDoc > .container { max-width: 1080px; }
.mag-article-page .VPDoc > .container > .content { padding: 0; max-width: 100%; }
.mag-article-page .VPDoc .content-container { max-width: 100%; }
.mag-article-page .VPDocFooter { display: none; }
@media (max-width: 600px) {
  .mag-article-page .VPDoc { padding: 24px 24px 40px; }
}
</style>
