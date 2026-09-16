<template>
  <div class="dual-qr">
    <div v-for="code in qrCodes" :key="code.name" class="dual-qr__block">
      <img class="dual-qr__img" :src="code.src" :alt="code.name" loading="lazy" />
      <span class="dual-qr__name">{{ code.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const qrCodes = [
  {
    name: 'QQ群',
    src: '/QR-code/qq-group.png'
  },
  {
    name: '微信公众号',
    src: '/QR-code/wechat.png'
  }
]
</script>

<style scoped>
.dual-qr {
  display: flex;
  justify-content: center;
  gap: var(--mag-space-lg, 2rem);
  padding: var(--mag-space-lg, 1.75rem) 0;
}

.dual-qr__block {
  text-align: center;
}

.dual-qr__img {
  width: 14rem;
  height: 14rem;
  object-fit: contain;
}

.dual-qr__name {
  display: block;
  margin-top: 0.5rem;
  color: var(--mag-text-secondary, #555);
  font-size: 1rem;
}

@media screen and (max-width: 640px) {
  .dual-qr__img {
    width: 10rem;
    height: 10rem;
  }
}
</style>
