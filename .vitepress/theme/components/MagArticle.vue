<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  date: string
  issue: string
  category: string
  next?: { title: string; href: string }
}>()
const titleLines = computed(() => props.title.replaceAll('，', '，\n').split('\n'))
</script>

<template>
  <article class="mag-article">
    <header class="mag-article__header">
      <div class="mag-article__masthead">
        <a href="/activities/#activity-content">社团活动 · 现场手记</a>
        <span lang="en">JLU iOS CLUB / FIELD NOTES</span>
      </div>
      <div class="mag-article__opening">
        <div>
          <p class="mag-article__category">{{ category }}</p>
          <h1><span v-for="line in titleLines" :key="line">{{ line }}</span></h1>
          <p class="mag-article__description">{{ description }}</p>
        </div>
        <div class="mag-article__edition" aria-label="文章编号">
          <span lang="en">FIELD NOTES</span>
          <span class="mag-article__number">{{ issue }}</span>
        </div>
      </div>
      <div class="mag-article__byline">
        <span>大学生创新应用工坊</span>
        <time :datetime="date">{{ date.replaceAll('-', '.') }}</time>
        <span>活动回顾</span>
      </div>
    </header>
    <div class="mag-article__body"><slot /></div>
    <footer class="mag-article__footer">
      <span class="mag-article__endmark" aria-hidden="true">■</span>
      <p>大学生创新应用工坊 <span lang="en">/ FIELD NOTES {{ issue }}</span></p>
      <nav aria-label="文章导航">
        <a href="/activities/#activity-content">返回活动目录 <span aria-hidden="true">↗</span></a>
        <a v-if="next" :href="next.href"><span class="mag-article__next-label">继续阅读</span>{{ next.title }} <span aria-hidden="true">→</span></a>
      </nav>
    </footer>
  </article>
</template>

<style scoped>
.mag-article { margin: 0 auto; max-width: 1080px; color: var(--mag-text); }
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
.mag-article__body :deep(h2)::before { counter-increment: article-section; content: counter(article-section, decimal-leading-zero); position: absolute; left: -58px; top: 5px; color: var(--mag-accent); font: italic 24px/1.6 var(--mag-font-serif); }
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
@media (max-width: 959px) {
  .mag-article__opening { grid-template-columns: minmax(0, 1fr) 85px; gap: 24px; }
  .mag-article__number { font-size: 84px; }
  .mag-article__body { padding-inline: 32px; }
  .mag-article__body :deep(h2)::before { position: static; display: block; margin-bottom: 6px; font-size: 20px; }
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
.mag-article-page .VPDoc { padding: 40px 48px 64px; }
.mag-article-page .VPDoc > .container { max-width: 1080px; }
.mag-article-page .VPDoc .content { padding: 0; max-width: 100%; }
.mag-article-page .VPDoc .content-container { max-width: 100%; }
.mag-article-page .VPDocFooter { display: none; }
@media (max-width: 600px) {
  .mag-article-page .VPDoc { padding: 24px 24px 40px; }
}
</style>
