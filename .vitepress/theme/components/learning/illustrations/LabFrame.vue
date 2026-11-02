<script setup lang="ts">
import './lab.css'
defineProps<{ title: string; eyebrow: string; hint: string }>()
</script>
<template>
  <section class="lesson-lab mag-no-reveal" :aria-label="title">
    <header class="lab-heading"><span class="lab-eyebrow">{{ eyebrow }}</span><h3>{{ title }}</h3><p>{{ hint }}</p></header>
    <slot />
    <div v-if="$slots.controls" class="lab-controls"><slot name="controls" /></div>
    <div v-if="$slots.observation" class="lab-observation" role="status" aria-atomic="true"><span class="lab-eyebrow">观察笔记</span><slot name="observation" /></div>
    <p v-if="$slots.footer" class="lab-footnote"><slot name="footer" /></p>
  </section>
</template>
