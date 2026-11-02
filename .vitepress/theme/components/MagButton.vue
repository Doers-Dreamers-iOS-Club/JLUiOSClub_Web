<script setup lang="ts">
/**
 * MagButton —— 行动按钮（取代 el-button）
 * 有 href 渲染为 <a>（站内链接交给 VitePress 的路由拦截，外链自动新窗口），
 * 无 href 渲染为 <button>（配合 MagModal 的 trigger 插槽等场景，click 事件透传）。
 */
withDefaults(
  defineProps<{
    href?: string
    variant?: 'primary' | 'ghost'
    /** 块级居中（取代原 .mag-cta 的居中场景） */
    block?: boolean
  }>(),
  { variant: 'primary', block: false }
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href?.startsWith('http') ? '_blank' : undefined"
    :rel="href?.startsWith('http') ? 'noreferrer' : undefined"
    :type="href ? undefined : 'button'"
    class="mag-btn"
    :class="[`mag-btn--${variant}`, { 'mag-btn--block': block }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.mag-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 1.4rem;
  border-radius: var(--mag-radius-pill);
  font-size: var(--mag-fs-body);
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  text-decoration: none;
  transition:
    transform var(--mag-duration-fast) var(--mag-ease),
    background var(--mag-duration-fast) var(--mag-ease),
    border-color var(--mag-duration-fast) var(--mag-ease),
    color var(--mag-duration-fast) var(--mag-ease);
}

.mag-btn:hover {
  transform: translateY(-2px);
}

.mag-btn--primary {
  border: 1px solid var(--mag-accent);
  background: var(--mag-accent);
  color: #fff;
}

.mag-btn--primary:hover {
  border-color: var(--mag-accent-hover);
  background: var(--mag-accent-hover);
}

.mag-btn--ghost {
  border: 1px solid var(--mag-hairline-strong);
  background: transparent;
  color: var(--mag-text);
}

.mag-btn--ghost:hover {
  border-color: var(--mag-accent);
  color: var(--mag-accent);
}

/* 内部若包了 <a>（迁移期的写法），颜色跟随按钮 */
.mag-btn :deep(a) {
  color: inherit;
  text-decoration: none;
}

.mag-btn--block {
  display: flex;
  width: 12rem;
  margin: 0 auto;
}
</style>
