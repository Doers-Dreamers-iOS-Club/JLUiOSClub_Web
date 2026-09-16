<script setup lang="ts">
/** MagTimeline —— 纵向时间线容器（取代 .timeline-stack） */
</script>

<template>
  <div class="mag-timeline mag-no-reveal" data-mag-stagger>
    <slot />
  </div>
</template>

<style scoped>
.mag-timeline {
  position: relative;
  margin: var(--mag-space-lg) 0;
  padding-left: var(--mag-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--mag-space-sm);
}

/* 贯穿的竖线：纸面上用素色细线，不做渐变 */
.mag-timeline::before {
  content: '';
  position: absolute;
  top: 0.4rem;
  bottom: 0.4rem;
  left: 0.32rem;
  width: 1px;
  background: var(--mag-hairline-strong);
}

@media (max-width: 700px) {
  .mag-timeline {
    padding-left: var(--mag-space-md);
  }
}
</style>
