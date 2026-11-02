<script setup lang="ts">
defineProps<{ icon?: string; title?: string; tag?: string; href?: string; compact?: boolean }>()
</script>

<template>
  <component :is="href ? 'a' : 'div'" :href="href"
    :target="href?.startsWith('http') ? '_blank' : undefined"
    :rel="href?.startsWith('http') ? 'noreferrer' : undefined"
    class="mag-card" :class="{ 'mag-card--compact': compact, 'mag-card--link': href }">
    <div v-if="title || href" class="mag-card__heading"><h3 v-if="title" class="mag-card__title">{{ title }}</h3><i v-if="href" class="ti ti-arrow-up-right mag-card__arrow" aria-hidden="true" /></div>
    <div v-if="!href || !title" class="mag-card__body"><slot /></div>
  </component>
</template>

<style scoped>
.mag-card { position: relative; display: block; min-width: 0; padding: 1.25rem; border: var(--mag-rule); border-radius: 12px; background: var(--mag-surface); color: var(--mag-text); text-decoration: none; transition: border-color .22s, background-color .22s; }
.mag-card--link:hover { border-color: var(--mag-hairline-strong); background: var(--mag-surface-sunken); }
.mag-card--compact { padding: 1rem; }
.mag-card__heading { display: flex; justify-content: space-between; align-items: center; gap: .75rem; margin-bottom: 0; }
.mag-card__heading .mag-card__title { margin: 0; }
.mag-card__arrow { color: var(--mag-text-secondary); font-size: 18px; transition: transform .4s var(--mag-ease), color .2s; }
.mag-card--link:hover .mag-card__arrow { transform: translate(2px, -2px); color: var(--mag-accent); }
.mag-card__title, .mag-card__body :deep(h3), .mag-card__body :deep(h4) { margin: 0 0 .5rem; padding: 0; border: 0; color: var(--mag-text); font-size: 16px; font-weight: 500; line-height: 1.5; }
.mag-card__body { color: var(--mag-text-secondary); font-size: 14px; line-height: 1.7; }
.mag-card__body :deep(p) { margin: 0 0 .5rem; }
.mag-card__body :deep(p:last-child) { margin-bottom: 0; }
.mag-card__body :deep(ul) { margin: .5rem 0 0; padding-left: 1.2rem; }
.mag-card__body :deep(a) { color: var(--mag-accent); }
.mag-card__body :deep(.mag-icon) { display: none; }
.mag-card:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 4px; }
</style>
