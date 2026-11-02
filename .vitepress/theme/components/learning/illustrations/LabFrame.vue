<script setup lang="ts">
import { inject } from 'vue'
import { labPlaybackKey } from './useLabPlayback'
import './lab.css'
defineProps<{ title: string; hint?: string }>()
const playback = inject(labPlaybackKey)
</script>
<template>
  <section class="lesson-lab mag-no-reveal" :aria-label="title" :aria-description="hint" :data-playing="playback?.playing.value">
    <header class="lab-heading">
      <h3>{{ title }}</h3>
      <button v-if="playback && !playback.reduced.value" class="lab-playback" type="button" :aria-label="playback.playing.value ? '暂停演示' : '播放演示'" :title="playback.playing.value ? '暂停演示' : '播放演示'" @click="playback.toggle"><i :class="['ti', playback.playing.value ? 'ti-player-pause' : 'ti-player-play']" aria-hidden="true" /></button>
    </header>
    <slot />
  </section>
</template>
