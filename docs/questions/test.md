---
title: 转正答题
search: false
---

<script setup>
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
onMounted(() => {
  const target = withBase('/questions/')
  history.replaceState(history.state, '', target)
  router.go(target)
})
</script>

<MagHero title="参与答题 成为正式社员" />

<MagButton href="/questions/">👉 开始答题</MagButton>
<MagButton variant="ghost" href="/join-us/">了解更多</MagButton>
