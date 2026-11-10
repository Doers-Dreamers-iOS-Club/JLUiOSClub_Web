---
title: 跳转中……
lastUpdated: false
search: false
---

# 跳转中，请稍等～

**Welcome to JLU iOS Club!**

如果此页长时间显示，请刷新本网页，或检查您的网络连接🥺

<MagButton :href="latestActivity">社团活动</MagButton>

<script setup>
import { useRouter, withBase } from 'vitepress'
import { onMounted } from 'vue'
import { data as activities } from '../.vitepress/data/activities.data.mts'

const router = useRouter()
const latestActivity = activities[0]?.url ?? '/activities/'
onMounted(() => {
  const target = withBase(latestActivity)
  history.replaceState(history.state, '', target)
  router.go(target)
})
</script>
