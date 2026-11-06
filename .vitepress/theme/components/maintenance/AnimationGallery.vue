<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { animationExamples, animationGroups } from './animationExamples'

const id = useId()
const selected = ref(0)
const replay = ref(0)
const copied = ref('')
const example = computed(() => animationExamples[selected.value])
const instanceKey = computed(() => `${example.value.id}-${replay.value}`)

let mounted = true
let warmup: ReturnType<typeof setTimeout>
let preloading: Promise<void> | undefined

async function preloadExamples() {
  await animationExamples[0].preload()
  for (const item of animationExamples.slice(1)) {
    if (!mounted) return
    await item.preload()
  }
}

function startPreloading() {
  clearTimeout(warmup)
  preloading ??= preloadExamples()
}

onMounted(() => { warmup = setTimeout(startPreloading, 400) })
onBeforeUnmount(() => { mounted = false; clearTimeout(warmup) })

async function copy() {
  const code = example.value.code
  await navigator.clipboard.writeText(code)
  copied.value = code
}
</script>

<template>
  <section class="animation-gallery mag-no-reveal" :aria-labelledby="`${id}-title`">
    <div class="animation-gallery__controls">
      <label :for="`${id}-select`">选择动画
        <select :id="`${id}-select`" v-model="selected" @focus="startPreloading" @pointerenter="startPreloading">
          <optgroup v-for="group in animationGroups" :key="group.title" :label="group.title">
            <option v-for="item in group.examples" :key="item.id" :value="item.index">{{ item.title }}</option>
          </optgroup>
        </select>
      </label>
      <button type="button" class="animation-gallery__replay" @click="replay++">重新播放</button>
    </div>
    <h3 :id="`${id}-title`">{{ example.title }}</h3>
    <p class="animation-gallery__description">{{ example.description }}</p>
    <div class="animation-gallery__preview" :data-example="example.id" :data-instance="instanceKey">
      <a v-if="example.id === 'roll-text'" class="animation-gallery__link" href="/activities/">
        <component :is="example.component" :key="instanceKey" v-bind="example.props" />
        <span aria-hidden="true">↗</span>
      </a>
      <component :is="example.component" v-else :key="instanceKey" v-bind="example.props" />
    </div>
    <p class="animation-gallery__usage">{{ example.usage }}</p>
    <div class="animation-gallery__code">
      <div class="animation-gallery__code-bar">
        <span>Markdown 中的写法</span>
        <button type="button" @click="copy">复制代码</button>
        <span class="animation-gallery__copied" role="status">{{ copied === example.code ? '已复制' : '' }}</span>
      </div>
      <pre tabindex="0" aria-label="动画复用代码"><code>{{ example.code }}</code></pre>
    </div>
    <noscript>当前显示第一种动画的静态画面。启用 JavaScript 后可切换和播放全部示例；下方说明与代码仍可阅读。</noscript>
  </section>
</template>

<style scoped>
.animation-gallery { margin: 28px 0; min-width: 0; }
.animation-gallery__controls { display: flex; align-items: end; gap: 12px; }
.animation-gallery__controls label { display: grid; flex: 1; gap: 8px; min-width: 0; color: var(--mag-text-secondary); font-size: 13px; }
.animation-gallery select, .animation-gallery button { border: var(--mag-rule); border-radius: 8px; background: var(--mag-surface); color: var(--mag-text); font: inherit; min-height: 40px; }
.animation-gallery select { width: 100%; padding: 8px 12px; }
.animation-gallery button { padding: 8px 12px; cursor: pointer; white-space: nowrap; }
.animation-gallery button:hover { border-color: var(--mag-accent); color: var(--mag-accent); }
.animation-gallery :is(button, select, pre):focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.animation-gallery h3 { margin: 24px 0 8px; }
.animation-gallery__description, .animation-gallery__usage { color: var(--mag-text-secondary); font-size: 14px; line-height: 1.8; }
.animation-gallery__preview { min-width: 0; min-height: 240px; display: grid; align-items: center; }
.animation-gallery__preview > * { min-width: 0; }
.animation-gallery__preview :deep(.learning-illustration), .animation-gallery__preview :deep(.lesson-lab) { margin: 0; }
.animation-gallery__link { display: flex; justify-content: center; align-items: center; gap: 16px; padding: 80px 12px; font-size: 22px; text-decoration: none; border-block: var(--mag-rule); }
.animation-gallery__usage { margin: 16px 0; }
.animation-gallery__code { border: var(--mag-rule); border-radius: 10px; overflow: hidden; }
.animation-gallery__code-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; padding: 8px 12px; border-bottom: var(--mag-rule); color: var(--mag-text-secondary); font-size: 12px; }
.animation-gallery__code-bar > span:first-child { margin-right: auto; }
.animation-gallery__copied { color: var(--mag-accent); }
.animation-gallery__code pre { margin: 0; padding: 16px; overflow-x: auto; background: var(--vp-code-block-bg); }
.animation-gallery__code code { padding: 0; background: none; color: var(--mag-text); font-size: 13px; line-height: 1.8; }
.animation-gallery noscript { display: block; margin-top: 16px; font-size: 14px; }
@media (max-width: 480px) {
  .animation-gallery__controls { flex-wrap: wrap; }
  .animation-gallery__controls label { flex-basis: 100%; }
  .animation-gallery__replay { margin-left: auto; }
}
</style>
