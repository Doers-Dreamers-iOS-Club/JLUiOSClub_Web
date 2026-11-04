<script setup lang="ts">
import ActivityOverview from './ActivityOverview.vue'
import WinterSwiftArtwork from './WinterSwiftArtwork.vue'
import WinterResourceArt from './WinterResourceArt.vue'
const base = '/activities/260209-winter-swift/'
const lessons = [
  { number: '01', title: 'SwiftUI 入门', subtitle: 'CodeBreaker 基础界面', href: base + 'first/' },
  { number: '02', title: 'Swift 进阶', subtitle: 'CodeBreaker 实战', href: base + 'second/' }
]
const resources = [
  { title: '第一讲视频', href: 'https://www.bilibili.com/video/BV1geFmzvEgj/', kind: 'video' as const },
  { title: 'GitHub 源码', href: 'https://github.com/Hean-Yi/CodeBreaker.git', kind: 'code' as const },
  { title: 'Gitee 镜像', href: 'https://gitee.com/Hean-Yi/CodeBreaker', kind: 'mirror' as const }
]
</script>

<template>
  <ActivityOverview :title="['冬季', 'Swift。']" :english="['Code.', 'Create.']" label="WINTER / 2026" contents-label="培训目录" :primary="{ title: '开始第一讲', href: base + 'first/' }" :secondary="{ title: '全部活动', href: '/activities/' }">
    <template #artwork><WinterSwiftArtwork /></template>
    <section class="overview-section" aria-labelledby="winter-contents">
      <div class="journal-section__head"><h2 id="winter-contents">培训目录</h2><span class="overview-index-label" aria-hidden="true">Learn by making</span></div>
      <nav class="overview-list" aria-label="冬季 Swift 培训讲义">
        <a v-for="lesson in lessons" :key="lesson.number" :href="lesson.href" class="journal-chapter">
          <span class="overview-number" aria-hidden="true">{{ lesson.number }}</span><div><h3>{{ lesson.title }}</h3><span class="overview-caption">{{ lesson.subtitle }}</span></div><span class="overview-arrow" aria-hidden="true">↗</span>
        </a>
      </nav>
    </section>
    <section class="overview-section" aria-labelledby="winter-bonus">
      <a class="overview-feature journal-feature" :href="base + 'bonus-ai-programming/'">
        <WinterResourceArt kind="ai" />
        <div><span class="overview-caption">补充讲座</span><h3 id="winter-bonus">现代 AI 编程全景</h3><span class="overview-arrow" aria-hidden="true">↗</span></div>
      </a>
    </section>
    <section class="overview-section" aria-labelledby="winter-resources">
      <div class="journal-section__head"><h2 id="winter-resources">配套资源</h2><span class="overview-index-label" aria-hidden="true">Watch &amp; build</span></div>
      <div class="overview-resources">
        <a v-for="resource in resources" :key="resource.href" :href="resource.href" class="overview-resource journal-feature" target="_blank" rel="noopener noreferrer">
          <WinterResourceArt :kind="resource.kind" /><div class="overview-item-title"><h3>{{ resource.title }}</h3><span class="overview-arrow" aria-hidden="true">↗</span></div>
        </a>
      </div>
    </section>
    <section class="overview-section overview-crosslink" aria-label="继续学习">
      <a href="/resources/ai-programming/" class="journal-chapter"><span class="overview-number" aria-hidden="true">＋</span><div><h3>从想法到作品</h3><span class="overview-caption">AI 编程入门</span></div><span class="overview-arrow" aria-hidden="true">↗</span></a>
    </section>
  </ActivityOverview>
</template>
