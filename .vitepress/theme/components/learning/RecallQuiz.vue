<script setup lang="ts">
import type { ChapterId } from '../../../data/course'
import { computed, nextTick, ref, watch } from 'vue'

type Chapter = ChapterId | 'api-setup'
const props = withDefaults(defineProps<{ chapter?: Chapter }>(), { chapter: '01' })
const questions: Record<Chapter, { question: string; choices: string[]; answer: number; explanation: string }> = {
  '01': { question: 'AI 说“已经完成”，接下来应该做什么？', choices: ['直接认为需求已经实现', '查看改动并按需求验证结果', '让 AI 再说一次完成'], answer: 1, explanation: 'AI 的回答是工作说明。你还需要阅读实际改动、运行项目并检查预期行为，才能确认交付。' },
  '02': { question: '哪种提示词最适合推进“增加速度选择”这项需求？', choices: ['“你自己看着办，越强大越好”', '“全部重写一遍”', '明确轻松、标准两档，默认轻松、开始前选择，重新开始沿用所选速度'], answer: 2, explanation: '六轮对话先建立上下文，再明确需求、确认计划、小步实现、提供反馈和验证。具体可观察的行为，比模糊的“优化一下”更容易执行和验收。' },
  '03': { question: '暂停贪吃蛇时，怎样处理计时与状态更合理？', choices: ['停止计时并保留蛇的位置；恢复时只保留一个计时器', '把蛇移回起点，再继续计时', '只隐藏画面，让计时器继续运行'], answer: 0, explanation: '暂停保留当前状态，重置才回到初始位置。暂停和重建计时器时要清理旧计时器，避免重复计时导致越跑越快。' },
  '04': { question: '多次点击重新开始后，蛇越跑越快。怎样反馈并确认修复？', choices: ['只说“还是不对”，然后直接保存', '提供操作顺序、实际与预期结果，修复后回归验证并检查差异', '只要 AI 说成功就提交'], answer: 1, explanation: '例如“保持同一速度档，连续重新开始三次；实际越跑越快，预期速度不变”。先复现并定位是否重复创建计时器，再小步修复、回归验证，最后检查差异并保存。' },
  '05': { question: '什么内容更适合写进可复用的 Skill？', choices: ['某次运行时临时出现的报错行号', '假定所有项目都采用相同文件名', '先理解代码、限定修改范围、运行验证的通用方法'], answer: 2, explanation: 'Skill 提供可复用的方法和检查约定。项目文件、当前实现和运行结果仍需现场读取，不能把一次项目中的事实当成所有任务的前提。具体操作也需要可用工具与授权。' },
  '06': { question: '通过 MCP 让 Agent 操作浏览器，哪条链路更准确？', choices: ['Agent 选择工具，宿主客户端连接服务端，工具执行并返回结果', 'MCP 自己决定需求并替用户完成所有验证', '只要连接成功，就证明网页行为正确'], answer: 0, explanation: 'MCP 规范客户端与服务端通信，浏览器工具执行实际操作。Agent 还要检查返回的页面状态与操作结果，确认它们符合用户要求。' },
  'api-setup': { question: '客户端配置已经填完，怎样确认 API 确实连通？', choices: ['看到保存成功就结束', '核对服务商、Base URL、Key、模型的对应关系，再发一条实际请求', '公开 API Key，让其他人替你测试'], answer: 1, explanation: '配置保存成功不等于请求成功。服务地址、密钥和模型必须匹配服务商支持的用法，再通过实际响应确认连通；不要公开密钥。' },
}
const quiz = computed(() => questions[props.chapter])
const selected = ref<number | null>(null)
const choices = ref<HTMLButtonElement[]>([])
const correct = computed(() => selected.value === quiz.value.answer)
async function retry() { selected.value = null; await nextTick(); choices.value[0]?.focus() }
watch(() => props.chapter, () => { selected.value = null })
</script>

<template>
  <section class="recall-quiz mag-no-reveal" aria-label="一分钟回忆检查">
    <p class="recall-quiz__eyebrow">RECALL / 一分钟回忆</p>
    <fieldset class="recall-quiz__fieldset">
      <legend>{{ quiz.question }}</legend>
      <div class="recall-quiz__choices">
        <button v-for="(choice, index) in quiz.choices" :key="choice" ref="choices" type="button" :aria-pressed="selected === index" :disabled="selected !== null" :class="{ 'recall-quiz__chosen': selected === index, 'recall-quiz__answer': selected !== null && index === quiz.answer }" @click="selected = index"><span>{{ String.fromCharCode(65 + index) }}</span>{{ choice }}</button>
      </div>
    </fieldset>
    <div class="recall-quiz__feedback" role="status" aria-atomic="true">
      <template v-if="selected !== null"><strong>{{ correct ? '答对了。' : '再想一步：' }}{{ !correct ? `正确答案是 ${String.fromCharCode(65 + quiz.answer)}。` : '' }}</strong><p>{{ quiz.explanation }}</p></template>
      <p v-else>先凭自己的理解选一项，再看解释。</p>
    </div>
    <button v-if="selected !== null" type="button" class="recall-quiz__retry" @click="retry">再试一次</button>
  </section>
</template>

<style scoped>
.recall-quiz { margin: var(--mag-space-xl) 0; padding: var(--mag-space-lg); border: var(--mag-rule); border-radius: var(--mag-radius-lg); background: var(--mag-surface); color: var(--mag-text); }
.recall-quiz__eyebrow { margin-top: 0; color: var(--mag-text-secondary); font: var(--mag-fs-micro) var(--mag-font-display); letter-spacing: .06em; }
.recall-quiz__fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
.recall-quiz__fieldset legend { font-weight: 500; padding: 0; }
.recall-quiz__choices { display: grid; gap: var(--mag-space-xs); margin-top: var(--mag-space-md); }
.recall-quiz button { min-height: 44px; padding: 12px; border: var(--mag-rule-strong); border-radius: var(--mag-radius-sm); background: var(--mag-surface); color: var(--mag-text); font: inherit; cursor: pointer; }
.recall-quiz__choices button { display: flex; gap: var(--mag-space-sm); align-items: baseline; text-align: left; font-size: var(--mag-fs-small); line-height: 1.7; }
.recall-quiz__choices button span { font-family: var(--mag-font-display); }
.recall-quiz button:hover:not(:disabled) { border-color: var(--mag-accent); }
.recall-quiz button:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 3px; }
.recall-quiz__choices button:disabled { cursor: default; }
.recall-quiz__choices .recall-quiz__chosen { border-color: var(--mag-text); }
.recall-quiz__choices .recall-quiz__answer { border-color: var(--mag-accent); background: var(--mag-accent-soft); }
.recall-quiz__feedback { margin-top: var(--mag-space-md); font-size: var(--mag-fs-small); color: var(--mag-text-secondary); }
.recall-quiz__feedback strong { color: var(--mag-text); }
.recall-quiz__feedback p { margin: var(--mag-space-xs) 0 var(--mag-space-sm); }
@media (max-width: 480px) { .recall-quiz { padding: var(--mag-space-md); } }
</style>
