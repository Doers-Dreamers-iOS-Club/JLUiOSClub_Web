<script setup lang="ts">
import { ref } from 'vue'
import { useCourseScrollMotion } from '../../composables/useCourseScrollMotion'
import { useCourseCover } from '../../composables/useCourseCover'
import { animateCourseEntrance } from '../../composables/courseEntrance'
const journal = ref<HTMLElement | null>(null)
useCourseScrollMotion(journal)
useCourseCover(journal, { animateEntrance: animateCourseEntrance })
import { chapters, courseBase } from '../../../data/course'
import CourseArtwork from './CourseArtwork.vue'
import CourseSpot from './CourseSpot.vue'

const features = [
  { title: '在 DSH 中接入模型', href: 'chapters/api-setup', art: 'model' as const },
  { title: '用 Python 调用 API', href: 'reference/python-api', art: 'python' as const }
]
const references = [
  { title: '工具准备', href: 'tools' },
  { title: '常用操作', href: 'operations' },
  { title: '术语与例子', href: 'glossary' },
  { title: '案例与文档', href: 'sources' }
]
const related = [
  { title: '现代 AI 编程全景', href: '/activities/260209-winter-swift/bonus-ai-programming', art: 'panorama' as const },
  { title: 'Vibe Coding 工作坊', href: '/activities/251018-vibe-coding/', art: 'workshop' as const },
  { title: 'AI Agent 实战', href: '/activities/251102-AI-Agent/', art: 'agent' as const }
]
</script>

<template>
  <div ref="journal" class="course-journal">
    <header class="journal-cover">
      <div class="journal-cover__inner">
      <div class="journal-masthead"><span class="journal-masthead__rule" aria-hidden="true"></span><span>JLU iOS CLUB</span><span>AI 编程入门</span></div>
      <div class="journal-cover__spread">
        <div class="journal-cover__story">
          <h1 tabindex="-1"><span class="journal-title-line journal-title-line--idea"><span><span class="journal-title-prefix">从</span><span class="journal-title-keyword journal-title-keyword--idea">想法</span></span></span><span class="journal-title-line journal-title-line--work"><span><span class="journal-title-prefix">到</span><span class="journal-title-keyword journal-title-keyword--work">作品<span class="journal-period">。</span></span></span></span></h1>
          <a class="journal-start" :href="courseBase + 'chapters/01'">开始第一章 <span aria-hidden="true">↗</span></a>
          <div class="journal-cover__links">
            <a :href="courseBase + 'reference/tools'">工具准备 <span aria-hidden="true">↗</span></a>
            <a :href="courseBase + 'read-all'">连续阅读 <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div class="journal-cover__type" aria-hidden="true">
          <svg class="journal-liquid-defs" aria-hidden="true" width="0" height="0"><defs><clipPath id="course-world-liquid-clip" clipPathUnits="objectBoundingBox"><path d="M0 .04 C.083 0 .167 0 .25 .04 S.417 .08 .5 .04 S.667 0 .75 .04 S.917 .08 1 .04 V1 H0Z" /></clipPath></defs></svg>
          <div class="journal-cover__english"><span class="journal-word journal-word--hello"><span v-for="(letter, index) in 'Hello,'" :key="index" class="journal-glyph">{{ letter }}</span></span><span class="journal-word journal-word--world"><span v-for="(letter, index) in 'world.'" :key="index" class="journal-glyph"><span class="journal-glyph-outline">{{ letter }}</span><span class="journal-glyph-size">{{ letter }}</span><span class="journal-liquid-window"><span class="journal-glyph-fill">{{ letter }}</span></span></span></span></div>
          <span class="journal-cover__asterisk">✳</span>
        </div>
      </div>
      <a class="journal-cover__next" href="#course-content" aria-label="浏览课程内容"><span aria-hidden="true">↓</span></a>
      </div>
    </header>

    <div id="course-content" class="journal-body" tabindex="-1" aria-label="课程内容">
    <div class="journal-body__inner">
    <CourseArtwork />

    <section class="journal-section" aria-labelledby="course-contents-title">
      <div class="journal-section__head"><h2 id="course-contents-title">课程目录</h2><a class="journal-text-link" :href="courseBase + 'read-all'">连续阅读 <span aria-hidden="true">↗</span></a></div>
      <nav class="journal-chapters" aria-label="主线课程目录">
        <a v-for="chapter in chapters" :key="chapter.id" :href="courseBase + 'chapters/' + chapter.id" class="journal-chapter">
          <span class="journal-chapter__number" aria-hidden="true">{{ chapter.id }}</span><h3>{{ chapter.title }}</h3><span class="journal-arrow" aria-hidden="true">↗</span>
        </a>
      </nav>
    </section>

    <section class="journal-section" aria-labelledby="course-further-title">
      <div class="journal-section__head"><h2 id="course-further-title">延伸教程</h2></div>
      <div class="journal-features">
        <a v-for="feature in features" :key="feature.href" :href="courseBase + feature.href" class="journal-feature">
          <CourseSpot :kind="feature.art" /><div class="journal-item-title"><h3>{{ feature.title }}</h3><span class="journal-arrow" aria-hidden="true">↗</span></div>
        </a>
      </div>
    </section>

    <section class="journal-section journal-desk" aria-labelledby="course-reference-title">
      <div>
        <h2 id="course-reference-title">参考</h2>
        <nav class="journal-reference" aria-label="课程参考资料">
          <a v-for="reference in references" :key="reference.href" :href="courseBase + 'reference/' + reference.href"><span>{{ reference.title }}</span><span class="journal-arrow" aria-hidden="true">↗</span></a>
        </nav>
      </div>
      <aside class="journal-materials" aria-labelledby="course-materials-title">
        <h2 id="course-materials-title">配套材料</h2>
        <a class="journal-text-link" :href="courseBase + 'materials/'">查看材料 <span aria-hidden="true">↗</span></a>
        <a class="journal-download" href="/ai-programming/ai-programming-handbook.zip" download>下载完整讲义包 <span aria-hidden="true">↓</span></a>
      </aside>
    </section>

    <section class="journal-section" aria-labelledby="course-related-title">
      <div class="journal-section__head"><h2 id="course-related-title">继续探索</h2></div>
      <div class="journal-related">
        <a v-for="item in related" :key="item.href" :href="item.href"><CourseSpot :kind="item.art" /><div class="journal-item-title"><h3>{{ item.title }}</h3><span class="journal-arrow" aria-hidden="true">↗</span></div></a>
      </div>
    </section>
    <footer class="journal-colophon"><span>JLU iOS Club</span><a :href="courseBase + 'reference/sources'">资料来源 <span aria-hidden="true">↗</span></a></footer>
    </div>
    </div>
  </div>
</template>

<style scoped>
@font-face { font-family: 'Club Instrument Serif'; src: url('/fonts/instrument-serif/instrument-serif-latin.woff2') format('woff2'); font-style: normal; font-weight: 400; font-display: swap; }
.course-journal { --journal-serif: 'Club Instrument Serif', Georgia, serif; position: relative; overflow: clip; }
.journal-cover, .journal-body { position: relative; overflow: clip; background: var(--vp-c-bg); }
.course-journal[data-course-page="cover"] > .journal-body,
.course-journal[data-course-page="content"] > .journal-cover { position: absolute; inset: 0 0 auto; visibility: hidden; pointer-events: none; }
.course-journal[data-cover-transition] > .journal-cover,
.course-journal[data-cover-transition] > .journal-body { pointer-events: none; }
.journal-cover__inner { display: flex; flex-direction: column; min-height: calc(100svh - var(--vp-nav-height, 64px)); padding-top: 24px; }
.journal-body:focus { outline: none; }
.journal-body__inner { padding-top: 24px; }
.journal-cover__next { display: grid; place-items: center; width: 44px; height: 44px; flex: none; align-self: center; margin: 0 0 18px; color: var(--mag-accent) !important; font-size: 24px; }
.journal-cover__next > span { transition: transform .25s ease; }
.journal-cover__next:hover > span { transform: translateY(3px); }
.course-journal :is(h1,h2,h3,p) { margin: 0; padding: 0; border: 0; }
.course-journal a { color: inherit; text-decoration: none; }
.course-journal a:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 5px; }
.journal-masthead { position: relative; display: flex; justify-content: space-between; gap: 16px; padding: 16px 0; font-size: 12px; line-height: 1.6; letter-spacing: .04em; }
.journal-masthead__rule { position: absolute; inset: 0 0 auto; height: 1px; background: var(--mag-text); transform-origin: left; }
.journal-cover__spread { flex: 1; align-content: center; display: grid; grid-template-columns: 1.15fr 1fr; gap: 6%; padding: 48px 0 52px; }
.journal-cover__story { display: flex; flex-direction: column; justify-content: center; }
.course-journal h1 { font-size: clamp(64px, 7vw, 96px); font-weight: 400; line-height: 1.2; letter-spacing: -.06em; margin-bottom: 30px; }
.journal-cover h1 > span { display: block; }
.journal-title-line { overflow: clip; padding: .05em .12em; margin: -.05em -.12em; }
.journal-title-line > span { display: flex; align-items: center; gap: .12em; transform-origin: left bottom; }
.journal-title-line--work { margin-left: .3em; }
.journal-title-prefix { flex: none; color: var(--mag-text-secondary); font-family: var(--mag-font-display); font-size: .25em; font-weight: 400; letter-spacing: 0; }
.journal-title-keyword--idea { font-family: var(--mag-font-serif); font-weight: 400; letter-spacing: -.08em; }
.journal-title-keyword--work { color: var(--mag-accent); font-weight: 500; letter-spacing: -.07em; }
.journal-title-keyword .journal-period { font-size: .55em; }
.journal-period { color: var(--mag-accent); }
.course-journal .journal-start { display: flex; align-items: center; justify-content: space-between; width: min(300px, 100%); min-height: 68px; padding: 18px 0; border-bottom: 1px solid var(--mag-accent); color: var(--mag-accent); font-size: 20px; font-weight: 500; }
.journal-start > span { font-size: 30px; transition: transform .25s ease; }
.journal-start:hover > span { transform: translate(3px,-3px); }
.journal-cover__links { display: flex; gap: 28px; margin-top: 13px; font-size: 12px; color: var(--mag-text-secondary); }
.journal-cover__links a { display: inline-flex; gap: 16px; align-items: center; min-height: 36px; }
.journal-cover__links a:hover { color: var(--mag-accent); }
.journal-cover__type { display: flex; flex-direction: column; justify-content: center; border-left: var(--mag-rule); padding-left: 12%; }
.journal-cover__english { font-family: var(--journal-serif); font-size: clamp(100px, 12.5vw, 180px); font-weight: 400; letter-spacing: -.04em; line-height: .82; padding: 12px 0 26px; }
.journal-cover__english > span { display: block; }
.journal-word { overflow: clip; padding: .12em .08em .2em; margin: -.12em -.08em -.2em; perspective: 800px; }
.journal-glyph { position: relative; display: inline-block; transform-origin: 50% 100%; }
.journal-glyph-outline { position: absolute; inset: 0; color: transparent; -webkit-text-stroke: .65px var(--mag-accent); opacity: 0; }
.journal-liquid-defs { position: absolute; pointer-events: none; }
.journal-glyph-size { display: block; visibility: hidden; }
.journal-liquid-window { position: absolute; left: -100%; top: 0; width: 300%; height: 200%; pointer-events: none; }
.journal-glyph-fill { position: absolute; left: 33.333333%; top: 0; width: 33.333333%; height: 50%; display: block; }
.journal-cover__english > span:last-child { color: var(--mag-accent); }
.journal-cover__asterisk { align-self: end; color: var(--mag-accent); font-size: 42px; line-height: 1; font-weight: 300; }
.journal-section { margin-top: 72px; }
.journal-section__head { display: flex; justify-content: space-between; align-items: center; gap: 24px; border-top: 1px solid var(--mag-text); padding-top: 22px; margin-bottom: 28px; }
.course-journal h2 { font-size: 28px; line-height: 1.4; font-weight: 400; letter-spacing: -.035em; }
.course-journal .journal-text-link { display: inline-flex; align-items: center; gap: 28px; font-size: 13px; color: var(--mag-accent); min-height: 40px; }
.journal-text-link:hover { text-decoration: underline; text-underline-offset: 6px; }
.journal-chapters { border-bottom: var(--mag-rule); }
.journal-chapter { display: grid; grid-template-columns: 78px 1fr 24px; align-items: center; gap: 24px; padding: 22px 0; border-top: var(--mag-rule); }
.journal-chapter__number { font-family: var(--journal-serif); font-size: 42px; line-height: 1; color: var(--mag-text-tertiary); transition: color .25s ease; }
.course-journal h3 { font-size: 20px; line-height: 1.5; font-weight: 400; letter-spacing: -.025em; }
.journal-arrow { display: inline-block; font-size: 20px; line-height: 1.4; color: var(--mag-accent); transition: transform .25s ease; }
.course-journal a:hover .journal-arrow { transform: translate(2px,-2px); }
.course-journal a:hover h3, .journal-chapter:hover .journal-chapter__number { color: var(--mag-accent); }
.journal-features { display: grid; grid-template-columns: 1fr 1fr; }
.journal-feature { padding: 0 44px 8px 0; }
.journal-feature + .journal-feature { border-left: var(--mag-rule); padding: 0 0 8px 44px; }
.journal-item-title { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding-top: 16px; }
.journal-item-title > .journal-arrow { flex-shrink: 0; }
.journal-feature :deep(.course-spot) { max-height: 190px; }
.journal-desk { display: grid; grid-template-columns: 1.35fr 1fr; gap: 8%; border-top: 1px solid var(--mag-text); padding-top: 28px; }
.course-journal .journal-desk h2 { margin-bottom: 28px; }
.journal-reference a { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: var(--mag-rule); padding: 17px 0; font-size: 15px; }
.journal-reference a:last-child { border-bottom: var(--mag-rule); }
.journal-reference a:hover { color: var(--mag-accent); }
.journal-materials { padding-left: 36px; border-left: var(--mag-rule); }
.course-journal .journal-download { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 0; border-bottom: 1px solid var(--mag-accent); color: var(--mag-accent); font-size: 13px; margin-top: 4px; }
.journal-download > span { font-size: 22px; }
.journal-related { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 28px; }
.journal-related > a { border-top: var(--mag-rule); padding-top: 12px; }
.course-journal .journal-related h3 { font-size: 18px; }
.journal-colophon { display: flex; justify-content: space-between; gap: 20px; font-size: 11px; color: var(--mag-text-secondary); border-top: 1px solid var(--mag-text); padding: 22px 0 0; margin-top: 70px; }
.journal-colophon a:hover { color: var(--mag-accent); }
@media (max-width: 960px) {
  .journal-cover__spread { gap: 5%; padding-top: 32px; }
  .journal-cover__english { font-size: clamp(96px, 13vw, 140px); }
  .journal-chapter { grid-template-columns: 58px 1fr 20px; gap: 18px; }
  .journal-feature { padding-right: 28px; }
  .journal-feature + .journal-feature { padding-left: 28px; }
  .journal-desk { gap: 5%; }
  .journal-materials { padding-left: 24px; }
}
@media (max-width: 640px) {
  .journal-cover__inner { padding-top: 16px; }
  .journal-cover__next { margin-bottom: 12px; }
  .journal-masthead { font-size: 11px; }
  .journal-cover__spread { grid-template-columns: 1fr; padding: 30px 0 20px; gap: 36px; }
  .course-journal h1 { font-size: clamp(60px, 16vw, 80px); margin-bottom: 21px; }
  .course-journal .journal-start { width: min(250px, 100%); min-height: 62px; font-size: 18px; padding: 15px 0; }
  .journal-cover__type { border-left: 0; border-top: var(--mag-rule); padding: 22px 0 0; }
  .journal-cover__english { display: flex; flex-wrap: wrap; column-gap: .16em; font-size: clamp(66px, 16vw, 100px); padding: 5px 0 20px; }
  .journal-cover__asterisk { font-size: 26px; }
  .journal-section { margin-top: 48px; }
  .journal-section__head { gap: 16px; margin-bottom: 22px; padding-top: 16px; }
  .course-journal h2 { font-size: 25px; }
  .journal-section__head > .journal-text-link { gap: 8px; font-size: 12px; }
  .journal-chapter { grid-template-columns: 34px 1fr 18px; gap: 12px; padding: 20px 0; }
  .journal-chapter__number { font-size: 34px; }
  .course-journal .journal-chapter h3 { font-size: 16px; }
  .journal-features { grid-template-columns: 1fr; }
  .journal-feature { padding: 0 0 26px; }
  .journal-feature + .journal-feature { border-left: 0; border-top: var(--mag-rule); padding: 20px 0 0; }
  .journal-feature :deep(.course-spot) { max-height: 155px; }
  .course-journal .journal-feature h3 { font-size: 20px; }
  .journal-desk { grid-template-columns: 1fr; gap: 36px; }
  .journal-materials { padding: 24px 0 0; border-left: 0; border-top: var(--mag-rule); }
  .journal-related { grid-template-columns: 1fr; gap: 24px; }
  .journal-related :deep(.course-spot) { max-height: 145px; }
  .journal-colophon { margin-top: 48px; }
}
@media (min-width: 641px) and (max-height: 760px) {
  .journal-cover__spread { padding: 20px 0 24px; }
  .course-journal h1 { font-size: clamp(44px, 8vh, 60px); }
  .journal-cover__english { font-size: clamp(96px, 18vh, 140px); padding: 8px 0 20px; }
  .journal-cover__asterisk { font-size: 30px; }
}
@media (max-width: 640px) and (min-height: 560px) and (max-height: 740px) {
  .journal-cover__spread { gap: 20px; padding: 20px 0 12px; }
  .course-journal h1 { font-size: 44px; margin-bottom: 12px; }
  .course-journal .journal-start { min-height: 54px; padding: 11px 0; }
  .journal-cover__english { font-size: 64px; padding-bottom: 10px; }
  .journal-cover__type { padding-top: 16px; }
  .journal-cover__asterisk { font-size: 22px; }
  .journal-cover__links { margin-top: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .journal-cover__next > span { transition: none; }
  .journal-cover__next:hover > span { transform: none; }
  .journal-arrow, .journal-start > span, .journal-chapter__number { transition: none; }
  .course-journal a:hover .journal-arrow, .journal-start:hover > span { transform: none; }
}
</style>
