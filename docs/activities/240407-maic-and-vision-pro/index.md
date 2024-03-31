---
title: MAIC & Vision Pro
---

::: warning 注意
此页面还在建设中，请晚些时候再来查看～
:::

# 移动应用创新赛宣讲会暨 Vision Pro 体验会

> 🗓️ 日期：2024年04月06日-07日
>
> 🕑 6日时间：14:00-17:00
>
> 🕕 7日时间：18:00-21:00
>
> 🏢 地点：南区计算机楼 B110苹果机房
>
> 👩🏻‍💻 主讲人：相开原 张天翼 陈悦华
>
> ✋ 报名方式：请阅读本篇活动说明，申请表在页面底部




## 报名方式

即将离开本站，前往腾讯文档填写活动报名表……

<el-button type="primary" @click="outerVisible = true" size="large" round>
  🎉 点击报名
</el-button>
<el-button type="info" size="large" round>
  <a href="/competitions/maic/">👉 了解更多竞赛信息</a>
</el-button>

<el-dialog v-model="outerVisible" title="请确认……" width="80%">
  <span>您是否已完整阅读本次活动说明，并了解提交App想法的要求？</span>
  <el-dialog
    v-model="innerVisible"
    title="请选择您要报名的场次"
    append-to-body
    width="80%"
  >
    <p>4月6日场：14:00-17:00</p>
    <p>4月7日场：18:00-21:00</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary">
          <a href="https://docs.qq.com/form/page/DTFVvQWlxRlN2eFhL" target="_blank">4月6日场</a>
        </el-button>
        <el-button type="primary">
          <a href="https://docs.qq.com/form/page/DTHdnRVN1b0J4cG54" target="_blank">4月7日场</a>
        </el-button>
      </div>
    </template>
  </el-dialog>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="outerVisible = false">我再看看</el-button>
      <el-button type="primary" @click="innerVisible = true">
        开始报名
      </el-button>
    </div>
  </template>
</el-dialog>

<script setup>
import {ref} from 'vue'; 
import {ElButton, ElDialog} from 'element-plus';

const outerVisible = ref(false);
const innerVisible = ref(false);

</script>

<style scoped>
.el-button a {
    color: var(--el-color-white);
    text-decoration: none;
}
</style>