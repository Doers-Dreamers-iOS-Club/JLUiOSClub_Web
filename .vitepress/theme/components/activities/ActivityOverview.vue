<script setup lang="ts">
import { ref } from 'vue'
import { useCourseCover } from '../../composables/useCourseCover'
import { useCourseScrollMotion } from '../../composables/useCourseScrollMotion'
import { animateOverviewEntrance } from './overviewMotion'

withDefaults(defineProps<{
  title: [string, string]
  english?: [string, string]
  label: string
  primary: { title: string; href: string }
  secondary?: { title: string; href: string }
  contentsLabel?: string
}>(), { contentsLabel: '活动目录' })
const journal = ref<HTMLElement | null>(null)
useCourseCover(journal, { contentId: 'activity-content', coverId: 'activity-cover', animateEntrance: animateOverviewEntrance })
useCourseScrollMotion(journal)
</script>

<template>
  <div ref="journal" class="activity-journal">
    <header id="activity-cover" class="journal-cover">
      <div class="overview-cover__inner">
        <div class="overview-masthead"><span class="overview-rule" aria-hidden="true" /><span>JLU iOS CLUB</span><span>{{ label }}</span></div>
        <div class="overview-spread">
          <div class="overview-story">
            <h1 tabindex="-1"><span v-for="(line, index) in title" :key="line" class="overview-title-line" :class="{ 'is-accent': index === 1 }"><span>{{ line }}</span></span></h1>
            <a class="overview-start" :href="primary.href">{{ primary.title }}<span aria-hidden="true">↗</span></a>
            <a v-if="secondary" class="overview-secondary" :href="secondary.href">{{ secondary.title }}<span aria-hidden="true">↗</span></a>
          </div>
          <div class="overview-type" :class="{ 'overview-type--art': $slots.cover }" aria-hidden="true">
            <slot name="cover">
            <div class="overview-english"><span v-for="word in english" :key="word" class="overview-word"><span v-for="(letter, i) in word" :key="i" class="overview-letter">{{ letter }}</span></span></div>
            <svg class="overview-mark" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="1" /><path d="M32 1V63M1 32H63M10 10L54 54M54 10L10 54" stroke="currentColor" stroke-width="1.5" /></svg>
            </slot>
          </div>
        </div>
        <a class="journal-cover__next overview-next" href="#activity-content" :aria-label="'浏览' + contentsLabel"><span>{{ contentsLabel }}</span><span aria-hidden="true">↓</span></a>
      </div>
    </header>
    <div id="activity-content" class="journal-body" tabindex="-1" :aria-label="contentsLabel">
      <div class="overview-body__inner">
        <div class="overview-running-head"><span>{{ label }}</span><span>{{ contentsLabel }}</span></div>
        <slot name="artwork" />
        <slot />
        <footer class="overview-colophon"><span>JLU iOS CLUB</span><span>{{ label }}</span></footer>
      </div>
    </div>
  </div>
</template>

<style src="./overview.css"></style>
