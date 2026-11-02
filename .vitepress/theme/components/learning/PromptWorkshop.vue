<script setup lang="ts">
import { computed, ref } from 'vue'

const rounds = [
  { title: '定位', prompt: '先不要修改代码。请找到贪吃蛇的运行入口、移动速度与开始和重开逻辑分别在哪里，说明每次开局怎样设置速度，并列出相关文件。', explanation: '先让 AI 建立代码上下文。你需要知道它准备修改哪里，以及判断依据是什么。' },
  { title: '定义速度', prompt: '我想增加“轻松”和“标准”两档速度，默认轻松，只允许在游戏开始前选择。重新开始时沿用当前选择的速度。请先复述这些行为，并指出还需要明确的细节。', explanation: '用可观察的行为描述需求。先明确选项、默认值、选择时机和重新开始的行为，再讨论具体实现。' },
  { title: '确认计划', prompt: '请给出最小修改计划：涉及哪些文件，怎样保存当前速度，何时清理并重建计时器，怎样避免多个计时器同时运行。先给计划，等我确认再改。', explanation: '把修改范围和风险写在动手前。检查计划是否围绕计时器和状态展开，而不是无关的重构。' },
  { title: '小步实现', prompt: '按刚才确认的计划，只实现轻松、标准两档速度和开始前的选择逻辑。沿用现有样式与依赖，不重构无关代码。完成后列出修改位置，并解释重新开始时如何沿用所选速度。', explanation: '一次只改一件事。让 AI 说明关键逻辑，你才能判断它是否真的实现了计划。' },
  { title: '提供反馈', prompt: '我复现了一个问题：选择标准 → 开始游戏 → 重新开始，速度却变回了轻松。预期是重新开始沿用标准。请先定位原因，再做最小修复，并补查轻松模式和默认选项。', explanation: '反馈包含操作顺序、实际结果和预期结果。这样的证据比“还是不对”更容易定位问题。' },
  { title: '验证与保存', prompt: '请检查差异并验证：只有轻松、标准两档；默认轻松；只能在开始前选择；两档实际速度不同；重新开始沿用当前选择；原有操作仍正常。区分已实际执行和仍需手动验证的项目，最后给出保存改动的建议。', explanation: '验收标准要回到原始需求。阅读差异、亲自操作，再保存或提交；不要把 AI 的完成声明当成测试证据。' },
]
const selected = ref(0)
const round = computed(() => rounds[selected.value])
const copyStatus = ref('')
const copying = ref(false)
function select(index: number) { selected.value = index; copyStatus.value = '' }
async function copy() {
  const text = round.value.prompt
  const index = selected.value
  copying.value = true
  copyStatus.value = ''
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(text)
    if (selected.value === index) copyStatus.value = '已复制，可以粘贴到 AI 对话中。'
  } catch {
    if (selected.value === index) copyStatus.value = '复制未成功。请选中上方提示词，使用系统复制功能。'
  } finally { copying.value = false }
}
</script>

<template>
  <section class="prompt-workshop mag-no-reveal" aria-label="六轮提示词工作坊">
    <div class="prompt-workshop__heading"><strong>把“加个速度”拆成六轮对话</strong></div>
    <p class="prompt-workshop__intro">点击轮次查看示例。把项目文件名和实际观察补进去，再交给 AI。</p>
    <div class="prompt-workshop__rounds" role="group" aria-label="选择对话轮次">
      <button v-for="(item, index) in rounds" :key="item.title" type="button" :aria-pressed="selected === index" @click="select(index)"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ item.title }}</button>
    </div>
    <div class="prompt-workshop__content">
      <p class="prompt-workshop__label">第 {{ selected + 1 }} 轮 · {{ round.title }}</p>
      <blockquote class="prompt-workshop__prompt" tabindex="0" aria-label="可选中复制的示例提示词">{{ round.prompt }}</blockquote>
      <p class="prompt-workshop__explanation">{{ round.explanation }}</p>
      <button type="button" class="prompt-workshop__copy" :disabled="copying" @click="copy">{{ copying ? '复制中…' : '复制这一轮提示词' }}</button>
      <p class="prompt-workshop__status" role="status">{{ copyStatus }}</p>
    </div>
  </section>
</template>

<style scoped>
.prompt-workshop { margin: var(--mag-space-xl) 0; padding: var(--mag-space-lg); background: var(--mag-surface); color: var(--mag-text); border: var(--mag-rule); border-radius: var(--mag-radius-lg); }
.prompt-workshop__heading { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--mag-space-xs); }
.prompt-workshop__heading span { font: var(--mag-fs-micro) var(--mag-font-display); color: var(--mag-text-secondary); }
.prompt-workshop__intro, .prompt-workshop__explanation, .prompt-workshop__status { color: var(--mag-text-secondary); font-size: var(--mag-fs-small); }
.prompt-workshop__rounds { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--mag-space-xs); margin: var(--mag-space-lg) 0; }
.prompt-workshop button { min-height: 44px; padding: 10px 12px; border: var(--mag-rule-strong); border-radius: var(--mag-radius-sm); background: var(--mag-surface); color: var(--mag-text); font: inherit; cursor: pointer; }
.prompt-workshop__rounds button { font-size: var(--mag-fs-small); }
.prompt-workshop__rounds span { display: block; font: var(--mag-fs-micro) var(--mag-font-display); color: var(--mag-text-secondary); }
.prompt-workshop button[aria-pressed="true"] { border-color: var(--mag-accent); color: var(--mag-accent); background: var(--mag-accent-soft); }
.prompt-workshop button:hover { border-color: var(--mag-accent); }
.prompt-workshop button:focus-visible, .prompt-workshop__prompt:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.prompt-workshop button:disabled { opacity: .55; cursor: default; }
.prompt-workshop__label { font: var(--mag-fs-small) var(--mag-font-display); }
.prompt-workshop .prompt-workshop__prompt { margin: var(--mag-space-sm) 0; padding: var(--mag-space-md); color: var(--mag-text); background: var(--mag-surface-sunken); border-left: 3px solid var(--mag-accent); border-radius: 0 var(--mag-radius-sm) var(--mag-radius-sm) 0; line-height: 1.8; user-select: text; overflow-wrap: anywhere; }
.prompt-workshop__status { min-height: 1.7em; margin-bottom: 0; }
@media (max-width: 480px) { .prompt-workshop { padding: var(--mag-space-md); } .prompt-workshop__rounds { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
