<script setup lang="ts">
/**
 * MagModal —— 原生 <dialog> 弹窗（取代 el-dialog）
 *
 * 用法：
 *   <MagModal title="请确认……">
 *     <template #trigger="{ open }">
 *       <MagButton @click="open">点击报名</MagButton>
 *     </template>
 *     内容……
 *     <template #footer="{ close }">
 *       <MagButton variant="ghost" @click="close">我再看看</MagButton>
 *     </template>
 *   </MagModal>
 *
 * 原生 <dialog> 的 top-layer 机制自动处理多层叠加与 Esc 关闭，
 * 不需要任何依赖。SSR 输出的是关闭态（无 open 属性），内容仍在文档流外，
 * 不影响页面可读性。
 */
import { ref } from 'vue'

withDefaults(
  defineProps<{
    title?: string
    /** 最大宽度，默认 32rem */
    width?: string
  }>(),
  { width: '32rem' }
)

const dialog = ref<HTMLDialogElement>()

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

/** 点击遮罩（dialog 元素本身的点击，而非内容）时关闭 */
function onBackdropClick(e: MouseEvent) {
  if (e.target === dialog.value) close()
}
</script>

<template>
  <span class="mag-modal">
    <slot name="trigger" :open="open" />

    <dialog
      ref="dialog"
      class="mag-modal__dialog"
      :style="{ '--mag-modal-width': width }"
      @click="onBackdropClick"
    >
      <div class="mag-modal__head">
        <h3 v-if="title" class="mag-modal__title">{{ title }}</h3>
        <button
          type="button"
          class="mag-modal__close"
          aria-label="关闭"
          @click="close"
        >
          ×
        </button>
      </div>

      <div class="mag-modal__body">
        <slot :close="close" />
      </div>

      <div v-if="$slots.footer" class="mag-modal__foot">
        <slot name="footer" :close="close" :open="open" />
      </div>
    </dialog>
  </span>
</template>

<style scoped>
.mag-modal__dialog {
  width: min(var(--mag-modal-width), calc(100vw - 2rem));
  max-height: 85vh;
  margin: auto;
  padding: 0;
  border: 1px solid var(--mag-hairline);
  border-radius: var(--mag-radius-md);
  background: var(--mag-surface-solid);
  color: var(--mag-text);
  box-shadow: var(--mag-shadow-lg);
}

.mag-modal__dialog::backdrop {
  background: rgba(20, 18, 15, 0.45);
  backdrop-filter: blur(4px);
}

.mag-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mag-space-sm);
  padding: var(--mag-space-md) var(--mag-space-md) var(--mag-space-sm);
  border-bottom: var(--mag-rule);
}

.mag-modal__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-family: var(--mag-font-serif);
  font-size: var(--mag-fs-h3);
  letter-spacing: var(--mag-tracking-serif);
}

.mag-modal__close {
  flex: none;
  width: 1.8rem;
  height: 1.8rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--mag-text-tertiary);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background var(--mag-duration-fast) var(--mag-ease),
    color var(--mag-duration-fast) var(--mag-ease);
}

.mag-modal__close:hover {
  background: var(--mag-surface-sunken);
  color: var(--mag-text);
}

.mag-modal__body {
  padding: var(--mag-space-md);
  color: var(--mag-text-secondary);
  line-height: var(--mag-leading-body);
}

.mag-modal__body :deep(p) {
  margin: 0 0 0.5rem;
}

.mag-modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--mag-space-xs);
  padding: var(--mag-space-sm) var(--mag-space-md) var(--mag-space-md);
}
</style>
