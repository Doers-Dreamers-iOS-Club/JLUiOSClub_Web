<template>
  <div class="demo-image__placeholder">
    <div v-for="code in qrCodes" :key='code.name' class="block">
      <el-image :src="code.src" fit="contain"/>
      <span class="demonstration">{{ code.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElImage } from 'element-plus'

const qrCodes = [
  {
    name: 'QQ群',
    src: '/QR-code/qq-group.png',
  },
  {
    name: '微信公众号',
    src: '/QR-code/wechat.png',
  }
]
</script>

<style scoped>
.demo-image__placeholder .block {
  padding: 30px 0;
  text-align: center;
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
  pointer-events: none;
}

.demo-image__placeholder .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 1rem;
}

@media screen and (min-width: 641px) {
  .el-image {
    width: 14rem;
    height: 14rem;
  }
}
@media screen and (max-width: 640px) {
  .el-image {
    width: 10rem;
    height: 10rem;
  }
}

</style>
