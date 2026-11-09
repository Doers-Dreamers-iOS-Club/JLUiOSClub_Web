<script setup lang="ts">
import { useData, type DefaultTheme } from 'vitepress'
import VPSidebarGroup from 'vitepress/dist/client/theme-default/components/VPSidebarGroup.vue'
import MagazineSidebar from './activities/MagazineSidebar.vue'

defineProps<{ items: DefaultTheme.SidebarItem[] }>()
const { frontmatter, page } = useData()
</script>

<template>
  <MagazineSidebar v-if="frontmatter.pageClass === 'mag-article-page' || page.relativePath.startsWith('resources/ai-programming/')" :items="items" />
  <VPSidebarGroup v-else :items="items" />
</template>
