---
title: 跳转中……
lastUpdated: false
---

# 跳转中，请稍等～

**Welcome to JLU iOS Club!**

如果此页长时间显示，请刷新本网页，或检查您的网络连接🥺

<script setup>
import {useRouter, useData} from 'vitepress';
import {onBeforeMount} from "vue";

const router = useRouter();
const {theme} = useData();
const link = theme.value.sidebar['/activities/'].items[0].items[0].link;
onBeforeMount(() => {
    router.go('activities/' + link)
})
</script>