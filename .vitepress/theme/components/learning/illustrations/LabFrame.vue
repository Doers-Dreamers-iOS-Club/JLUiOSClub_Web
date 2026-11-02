<script setup lang="ts">
import './lab.css'
defineProps<{ title: string; eyebrow: string; hint: string }>()
</script>
<template>
  <section class="lesson-lab mag-no-reveal" :aria-label="title">
    <header class="lab-heading"><h3>{{ title }}</h3><details class="lab-help"><summary>使用提示</summary><p>{{ hint }}</p></details></header>
    <slot />
    <div v-if="$slots.controls" class="lab-controls"><slot name="controls" /></div>
    <div v-if="$slots.observation" class="lab-observation" role="status" aria-atomic="true"><slot name="observation" /></div>
    <details v-if="$slots.footer" class="lab-footnote"><summary>关于这个演示</summary><p><slot name="footer" /></p></details>
  </section>
</template>
