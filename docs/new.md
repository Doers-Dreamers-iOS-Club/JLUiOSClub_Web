---
title: 跳转中……
---

# 跳转中，请稍等～

<script setup>
import {useRouter} from 'vitepress';
import {onMounted} from "vue";

let router = useRouter();
onMounted(() => {
    router.go('activities/240407-maic-and-vision-pro/')
})
</script>