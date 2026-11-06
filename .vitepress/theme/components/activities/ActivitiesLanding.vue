<script setup lang="ts">
import { groupByYear } from '../../../data/shared'
import { data as activities } from '../../../data/activities.data.mts'
import ActivityOverview from './ActivityOverview.vue'
import ActivitiesArtwork from './ActivitiesArtwork.vue'
import ActivitiesCover from './ActivitiesCover.vue'
const groups = groupByYear(activities)
const latest = activities[0]
const earlier = ['解锁 iPad 生产力', '2023 冬季 WWDC · Swift 特训营', '购买 Mac / iPad 迎接高校生活', 'macOS 初体验']
</script>

<template>
  <ActivityOverview :title="['社团', '活动。']" label="ACTIVITIES" :primary="{ title: '最近一期活动', href: latest?.url || '#activity-content' }" :secondary="{ title: 'AI 编程入门', href: '/resources/ai-programming/' }">
    <template #cover><ActivitiesCover /></template>
    <template #artwork><ActivitiesArtwork /></template>
    <section class="overview-section" aria-labelledby="activities-contents">
      <div class="journal-section__head"><h2 id="activities-contents">活动目录</h2><span class="overview-index-label" aria-hidden="true">The archive</span></div>
      <section v-for="group in groups" :key="group.year" class="overview-year" :aria-labelledby="'activities-year-' + group.year">
        <h3 :id="'activities-year-' + group.year">{{ group.year || '未归档' }}</h3>
        <nav class="overview-list" :aria-label="group.year + ' 年活动'">
          <a v-for="entry in group.entries" :key="entry.url" class="journal-chapter" :href="entry.url">
            <time class="overview-date" :datetime="entry.date.replaceAll('.', '-')">{{ entry.date.slice(5).replace('.', '/') }}</time>
            <h3>{{ entry.title }}</h3><span class="overview-arrow" aria-hidden="true">↗</span>
          </a>
        </nav>
      </section>
    </section>
    <section class="overview-section" aria-labelledby="activities-earlier">
      <div class="journal-section__head"><h2 id="activities-earlier">更早的相聚</h2><span id="activities-earlier-status" class="overview-status">暂无记录页</span></div>
      <div class="overview-legacy" aria-describedby="activities-earlier-status"><span v-for="title in earlier" :key="title">{{ title }}</span></div>
    </section>
    <section class="overview-section" aria-label="AI 编程入门">
      <a class="overview-feature journal-feature" href="/resources/ai-programming/">
        <svg viewBox="0 0 420 210" fill="none" aria-hidden="true"><rect x="66" y="24" width="270" height="158" rx="8" stroke="var(--mag-hairline-strong)" /><path d="M66 51H336" stroke="var(--mag-hairline-strong)" /><circle cx="80" cy="37" r="3" fill="var(--mag-text-tertiary)" /><circle cx="91" cy="37" r="3" fill="var(--mag-text-tertiary)" /><path d="M108 148H161V111H235V81H281" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" /><circle cx="282" cy="79" r="2" fill="white" /><path d="M292 137V157M282 147H302" stroke="currentColor" stroke-width="1.5" /></svg>
        <div><span class="overview-caption">AI 编程入门</span><h3>从想法到作品。</h3><span class="overview-arrow" aria-hidden="true">↗</span></div>
      </a>
    </section>
  </ActivityOverview>
</template>
