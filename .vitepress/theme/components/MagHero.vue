<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  eyebrow?: string
  issue?: string | number
  date?: string
  entrance?: boolean
}>(), { entrance: true })
</script>

<template>
  <header class="mag-hero" :data-mag-enter="entrance ? '' : undefined">
    <div class="mag-hero__inner">
      <p v-if="eyebrow || issue !== undefined" class="mag-hero__eyebrow">
        <span v-if="issue !== undefined" class="mag-hero__issue">{{ issue }}</span>
        {{ eyebrow }}
      </p>
      <h1 v-if="title" class="mag-hero__title">{{ title }}</h1>
      <slot name="title" />
      <p v-if="subtitle" class="mag-hero__subtitle">{{ subtitle }}</p>
      <p v-if="date" class="mag-hero__date"><time>{{ date }}</time></p>
      <div v-if="$slots.default" class="mag-hero__body"><slot /></div>
    </div>
  </header>
</template>

<style scoped>
.mag-hero { margin: 0 0 2.5rem; padding: 1.5rem 0 2rem; border-bottom: var(--mag-rule); }
.mag-hero__eyebrow { display: flex; gap: .75rem; margin: 0 0 1rem; color: var(--mag-text-secondary); font-size: 13px; }
.mag-hero__issue { font-variant-numeric: tabular-nums; }
.mag-hero__title { margin: 0; padding: 0; border: 0; font-size: 22px; font-weight: 500; line-height: 1.5; letter-spacing: -.02em; }
.mag-hero__subtitle { max-width: 42rem; margin: 1rem 0 0; color: var(--mag-text-secondary); font-size: 16px; line-height: 1.7; }
.mag-hero__date { margin: 1rem 0 0; color: var(--mag-text-secondary); font-size: 13px; }
.mag-hero__body { margin-top: 1rem; color: var(--mag-text-secondary); line-height: 1.7; }
</style>
