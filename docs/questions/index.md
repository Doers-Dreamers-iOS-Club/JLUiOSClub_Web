---
title: 转正答题
---

# 参与答题 成为正式社员

点击下方按钮，开始答题吧~

我们会在收到您的答题情况后，通过您留下的联系方式联系您，请保持联系方式畅通~

<br>
<el-button type="primary" size="large" @click="router.go('/questions/test')" round>
  👉 开始答题
</el-button>
<el-button type="info" size="large" @click="router.go('/join-us/')" round>
  了解更多
</el-button>


<script setup>
import {ElButton} from 'element-plus';
import {useRouter} from 'vitepress';

const router = useRouter();
</script>
