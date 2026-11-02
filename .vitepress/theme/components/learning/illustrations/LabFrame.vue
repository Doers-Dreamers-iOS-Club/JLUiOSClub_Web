<script setup lang="ts">
import './lab.css'
defineProps<{ title: string; eyebrow: string; hint: string }>()
</script>
<template>
  <section class="lesson-lab mag-no-reveal" :aria-label="title" :aria-description="hint">
    <header class="lab-heading"><h3>{{ title }}</h3></header>
    <slot />
    <div v-if="$slots.controls" class="lab-controls"><slot name="controls" /></div>
    <div v-if="$slots.observation" class="lab-observation" role="status" aria-atomic="true"><slot name="observation" /></div>
  </section>
</template>
