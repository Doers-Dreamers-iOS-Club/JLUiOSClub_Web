<script setup lang="ts">
import { illustrations, type Scene } from './illustrations/registry'
defineProps<{ scene: Scene }>()
</script>
<template>
  <div class="learning-illustration mag-no-reveal" :data-scene="scene">
    <component :is="illustrations[scene]" :kind="scene === 'observe' || scene === 'feedback' ? scene : undefined" />
  </div>
</template>
