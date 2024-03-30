---
title: 跳转中……
---

<script setup>
import {useRouter} from 'vitepress';
import {onMounted} from "vue";

let router = useRouter();
onMounted(() => {
    router.go('activities/240407_maic_and_vision_pro/')
})
</script>