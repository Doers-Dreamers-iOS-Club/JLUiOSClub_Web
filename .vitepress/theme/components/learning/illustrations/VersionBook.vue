<script setup lang="ts">
import { computed, ref } from 'vue'
import LabFrame from './LabFrame.vue'
import SnakeScene from './SnakeScene.vue'
const versions = [
  { name: '初始版', note: '基础移动与重新开始', date: '01', speed: false, pause: false, code: ['const speed = 180', 'start(speed)', 'restart()'], record: '建立可玩的基础游戏：固定速度、计分和重新开始。' },
  { name: '速度版', note: '增加两档速度选择', date: '02', speed: true, pause: false, code: ["mode = '轻松'", 'speed = modes[mode]', 'restart(mode)'], record: '新增轻松 / 标准；默认轻松，开始前选择；重新开始沿用所选档位。' },
  { name: '暂停版', note: '增加暂停与继续', date: '03', speed: true, pause: true, code: ["mode = '轻松'", 'speed = modes[mode]', 'restart(mode)', 'togglePause()'], record: '保留速度设置，新增暂停 / 继续，并检查暂停期间蛇身和分数不变化。' },
]
const before = ref(0)
const after = ref(1)
const split = ref(50)
const view = ref('画面')
const side = ref<'before' | 'after'>('after')
const current = ref(2)
const focus = ref<'speed' | 'pause'>('speed')
const restored = ref('')
const restoreRevision = ref(0)
const pair = computed(() => [versions[before.value], versions[after.value]])
const changedLines = computed(() => pair.value.map((version, index) => version.code.filter(line => !pair.value[1 - index].code.includes(line))))
function inFocus(line: string) { return focus.value === 'pause' ? line.includes('Pause') : /speed|mode|restart/.test(line) }
function selectedChanges(index: number) { return changedLines.value[index].filter(inFocus) }
function targetChanged(index: number, target: 'speed' | 'restart' | 'pause') {
  return selectedChanges(index).some(line => target === 'pause' ? line.includes('Pause') : target === 'restart' ? line.includes('restart') : /speed|mode/.test(line) && !line.includes('restart'))
}
const selected = computed(() => side.value === 'before' ? before.value : after.value)
const difference = computed(() => {
  if (before.value === after.value) return '两侧是同一版本，没有版本差异。'
  const changes = []
  if (pair.value[0].speed !== pair.value[1].speed) changes.push('速度选择与 mode、restart(mode) 对应：重新开始要沿用所选档位。')
  if (pair.value[0].pause !== pair.value[1].pause) changes.push('暂停 / 继续按钮与 togglePause() 对应。')
  if (pair.value[0].speed && pair.value[1].speed) changes.push('两页的速度设置保持一致。')
  return changes.join('')
})
function restore() {
  current.value = selected.value
  view.value = '画面'
  split.value = side.value === 'before' ? 100 : 0
  restoreRevision.value++
  restored.value = `示意工作区已恢复为「${versions[current.value].name}」，上方已显示该版本的完整快照。没有执行 Git 或修改项目文件。`
}
function reset() { before.value = 0; after.value = 1; split.value = 50; view.value = '画面'; side.value = 'after'; current.value = 2; focus.value = 'speed'; restored.value = ''; restoreRevision.value = 0 }
</script>

<template>
  <div class="version-book">
    <LabFrame eyebrow="VERSIONS / 版本翻页簿" title="把一次变化，放在两页之间" hint="用版本选单任意选择两页；拖动分界线，或用前页 / 后页按钮切换完整画面。">
      <div class="lab-stage">
        <div class="book-spine"><span v-for="(version,index) in versions" :key="version.name" :class="{ 'current-page': current === index }"><i>{{ version.date }}</i>{{ version.name }}<small v-if="current === index">当前示意工作区</small></span></div>
        <div class="version-select"><label>前页<select v-model.number="before" aria-label="选择前页版本"><option v-for="(version,index) in versions" :key="version.name" :value="index">{{ version.name }}</option></select></label><label>后页<select v-model.number="after" aria-label="选择后页版本"><option v-for="(version,index) in versions" :key="version.name" :value="index">{{ version.name }}</option></select></label></div>
        <div class="lab-tabs" aria-label="版本比较内容"><button v-for="tab in ['画面','代码','记录']" :key="tab" :aria-pressed="view === tab" @click="view = tab">{{ tab }}</button></div>
        <div v-if="view === '画面'" :key="`preview-${before}-${after}-${restoreRevision}`" class="book-preview version-flash">
          <div class="wipe-preview" :class="{ 'show-before': side === 'before' }">
            <div v-for="(version,index) in pair" :key="index" class="preview-page" :class="index === 0 ? 'preview-before' : 'preview-after'" :style="index === 1 ? { clipPath: `inset(0 0 0 ${split}%)` } : {}">
              <div class="page-heading"><b>{{ version.name }}</b><span>快照 {{ version.date }}</span></div>
              <SnakeScene :position="3" :score="0" :label="`${version.name}的静态游戏预览`" />
              <div class="snapshot-controls"><span :class="{ 'feature-on': version.speed }">{{ version.speed ? '轻松 / 标准' : '固定速度' }}</span><span>重新开始</span><span :class="{ 'feature-on': version.pause }">{{ version.pause ? '暂停 / 继续' : '无暂停功能' }}</span></div>
            </div>
            <div class="wipe-line" :style="{ left: `${split}%` }"><span>↔</span></div>
          </div>
          <label class="wipe-control">画面分界（左：前页，右：后页）<input v-model.number="split" type="range" min="0" max="100" :aria-valuetext="`前页显示 ${split}%，后页显示 ${100-split}%`" aria-label="拖动版本画面分界线" /></label>
          <div class="lab-tabs"><button :aria-pressed="side === 'before'" @click="side = 'before'; split = 100">看前页：{{ pair[0].name }}</button><button :aria-pressed="side === 'after'" @click="side = 'after'; split = 0">看后页：{{ pair[1].name }}</button></div>
          <p class="lab-caption">快照中的控件用于对照，不运行游戏。窄屏一次显示一页。</p>
        </div>
        <div v-else-if="view === '代码'" :key="`code-${before}-${after}`" class="code-comparison version-flash">
          <div class="lab-tabs"><button :aria-pressed="focus === 'speed'" @click="focus = 'speed'">连接速度 / 重开控件</button><button :aria-pressed="focus === 'pause'" @click="focus = 'pause'">连接暂停 / 继续控件</button></div>
          <p class="lab-caption">沿前页 → 后页阅读：− 表示移除，+ 表示加入；相同行不标记。连线只连接当前选中的差异与对应画面控件。</p>
          <div class="lab-two">
            <div v-for="(version,index) in pair" :key="index" class="lab-paper">
              <span class="lab-eyebrow">{{ index === 0 ? '前页' : '后页' }} / {{ version.name }}</span>
              <pre><code><span v-for="line in version.code" :key="`${line}-${focus}`" class="code-line" :class="{ 'code-highlight': changedLines[index].includes(line) && inFocus(line), 'code-removed': index === 0 && changedLines[index].includes(line), 'code-added': index === 1 && changedLines[index].includes(line) }"><span class="diff-mark" :aria-label="changedLines[index].includes(line) ? index === 0 ? '移除' : '加入' : '相同'">{{ changedLines[index].includes(line) ? index === 0 ? '−' : '+' : ' ' }}</span>{{ line }}</span></code></pre>
              <div v-if="selectedChanges(index).length" class="code-connector" :class="{ 'connector-removal': index === 0 }"><svg viewBox="0 0 120 42" aria-hidden="true"><path d="M60 1v30m-7-7 7 8 7-8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="3" r="3" fill="currentColor"/></svg><span>{{ index === 0 ? '移除的实现 → 原有行为' : '加入的实现 → 新的行为' }}</span></div>
              <p v-else class="no-change lab-caption">所选功能在这一页没有代码差异。</p>
              <div class="control-targets" :aria-label="`${version.name}对应控件的静态示意`">
                <span class="lab-eyebrow">对应的画面控件 / 静态示意</span>
                <template v-if="focus === 'speed'">
                  <div class="target-control" :class="{ 'target-changed': targetChanged(index, 'speed'), 'target-removed': index === 0 && targetChanged(index, 'speed') }"><small>速度设置</small><div v-if="version.speed" class="mock-selector"><span class="mock-selected">轻松</span><span>标准</span></div><span v-else class="mock-button">固定速度 · 无选择器</span></div>
                  <div class="target-control" :class="{ 'target-changed': targetChanged(index, 'restart'), 'target-removed': index === 0 && targetChanged(index, 'restart') }"><span class="mock-button">重新开始</span><small>{{ version.speed ? '沿用所选档位' : '使用固定速度' }}</small></div>
                </template>
                <div v-else class="target-control" :class="{ 'target-changed': targetChanged(index, 'pause'), 'target-removed': index === 0 && targetChanged(index, 'pause') }"><span v-if="version.pause" class="mock-button">暂停 / 继续</span><span v-else class="absent-control">此版本没有暂停控件</span><small v-if="version.pause">停止更新 / 恢复更新</small></div>
              </div>
            </div>
          </div>
          <p class="lab-caption">{{ before === after ? '两页相同，没有代码或控件差异。' : focus === 'speed' ? 'mode 保存所选档位，restart(mode) 让重新开始继续使用它。初始版没有此选择。' : 'togglePause() 对应暂停 / 继续按钮，仅暂停版包含这项变化。' }} 代码为教学节选。</p>
        </div>
        <div v-else class="lab-two"><article v-for="(version,index) in pair" :key="index" class="lab-paper record-page"><svg viewBox="0 0 80 64" aria-hidden="true"><path d="M16 6h38l12 12v40H16Z M54 6v14h12 M26 30h30m-30 9h30m-30 9h19" fill="none" stroke="currentColor" stroke-width="2" /></svg><span class="lab-eyebrow">{{ index === 0 ? '前页' : '后页' }} / {{ version.date }}</span><h4>{{ version.name }}</h4><p>{{ version.record }}</p></article></div>
        <div class="restore-slip lab-paper"><span class="lab-eyebrow">模拟恢复 / 仅此插图</span><p>要恢复哪一页？</p><div class="lab-tabs"><button :aria-pressed="side === 'before'" @click="side = 'before'">前页：{{ pair[0].name }}</button><button :aria-pressed="side === 'after'" @click="side = 'after'">后页：{{ pair[1].name }}</button></div><p class="restore-warning">真实项目恢复旧版本前应先保存当前工作；某些恢复操作会丢失未提交的修改。</p><button @click="restore">模拟恢复为{{ versions[selected].name }}</button><p v-if="restored" role="status" class="lab-caption">{{ restored }}</p></div>
      </div>
      <template #controls><button @click="reset">重置翻页簿</button></template>
      <template #observation><p>{{ difference }}</p><p>当前示意工作区：{{ versions[current].name }}。比较页面不会自动改变它。</p></template>
      <template #footer>这里的快照与恢复均为教学模拟，不读取仓库、不执行 Git、不修改文件。</template>
    </LabFrame>
  </div>
</template>

<style scoped>
.book-spine { display:flex; gap:0; border-bottom:var(--mag-rule-strong); margin-bottom:1rem; }
.version-flash { animation:version-change .65s ease-out; }
@keyframes version-change { from { background-color:var(--mag-accent-soft); } to { background-color:transparent; } }
.book-spine>span { flex:1; padding:.6rem .4rem .85rem; color:var(--mag-text-secondary); font-size:.75rem; position:relative; }
.book-spine i { display:block; font: .7rem/1.6 var(--mag-font-mono); color:var(--mag-accent); }
.book-spine small { display:block; font-size:.6rem; }.book-spine .current-page { border-bottom:3px solid var(--mag-accent); color:var(--mag-text); }
.version-select { display:grid; grid-template-columns:1fr 1fr; gap:.7rem; }.version-select label { display:flex; align-items:center; gap:.6rem; font-size:.8rem; }.version-select select { flex:1; min-width:0; }
.wipe-preview { position:relative; max-width:520px; margin:0 auto; overflow:hidden; border:var(--mag-rule-strong); border-radius:var(--mag-radius-sm); }
.preview-page { padding:1rem; background:var(--mag-surface); }.preview-after { position:absolute; inset:0; }
.page-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:.75rem; font-size:.85rem; }.page-heading>span { color:var(--mag-text-secondary); font: .7rem/1.6 var(--mag-font-mono); }
.snapshot-controls { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.4rem; margin-top:.7rem; }
.snapshot-controls span { border:var(--mag-rule); border-radius:var(--mag-radius-sm); padding:.5rem .15rem; font-size:.7rem; text-align:center; color:var(--mag-text-secondary); }
.snapshot-controls .feature-on { color:var(--mag-accent); background:var(--mag-accent-soft); border-color:var(--mag-accent-border); }
.wipe-line { position:absolute; top:0; bottom:0; border-left:2px solid var(--mag-accent); pointer-events:none; }.wipe-line span { position:absolute; top:45%; left:-15px; background:var(--mag-accent); color:var(--mag-surface); border-radius:var(--mag-radius-pill); width:28px; text-align:center; }
.wipe-control { display:block; font-size:.75rem; color:var(--mag-text-secondary); margin:.75rem 0; }
.code-comparison pre { min-height:140px; padding:.75rem .5rem; }.code-line { display:block; padding:0 .2rem; }.diff-mark { display:inline-block; width:1.3em; font-weight:700; }.code-added .diff-mark { color:var(--mag-accent); }.code-removed .diff-mark { color:var(--mag-warn); }.code-highlight { background:var(--mag-accent-soft); color:var(--mag-accent); outline:1px solid var(--mag-accent-border); animation:code-change .65s ease-out; }.code-highlight.code-removed { color:var(--mag-warn); background:var(--mag-warn-soft); outline-color:var(--mag-warn-border); }
@keyframes code-change { from { background:var(--mag-accent-border); } to { background:var(--mag-accent-soft); } }
.code-connector { color:var(--mag-accent); text-align:center; font-size:.68rem; margin:-.3rem 0 .7rem; }.code-connector svg { width:90px; margin:0 auto; }.connector-removal { color:var(--mag-warn); }.no-change { min-height:67px; display:flex; align-items:center; justify-content:center; text-align:center; }.control-targets { border:var(--mag-rule); border-radius:var(--mag-radius-sm); padding:.7rem; background:var(--mag-surface-sunken); }.control-targets>.lab-eyebrow { font-size:.6rem; letter-spacing:0; }.target-control { margin-top:.6rem; padding:.6rem; border:1px solid transparent; border-radius:var(--mag-radius-sm); }.target-changed { border-color:var(--mag-accent); background:var(--mag-accent-soft); }.target-removed { border-color:var(--mag-warn); background:var(--mag-warn-soft); }.target-control small { display:block; color:var(--mag-text-secondary); font-size:.65rem; margin:.3rem 0; }.mock-selector { display:flex; border:var(--mag-rule-strong); border-radius:var(--mag-radius-sm); overflow:hidden; font-size:.75rem; background:var(--mag-surface); }.mock-selector span { padding:.5rem; flex:1; text-align:center; }.mock-selected { background:var(--mag-accent-soft); color:var(--mag-accent); }.mock-button { display:block; text-align:center; padding:.5rem; font-size:.75rem; border:var(--mag-rule-strong); border-radius:var(--mag-radius-sm); background:var(--mag-surface); }.absent-control { display:block; color:var(--mag-text-secondary); font-size:.75rem; padding:.5rem 0; }
.record-page svg { width:65px; color:var(--mag-accent); margin-bottom:.6rem; }.record-page h4 { margin:.6rem 0; }.record-page p,.restore-slip p { font-size:.8rem; line-height:1.9; }.restore-slip { margin-top:1rem; }.restore-slip .restore-warning { color:var(--mag-warn); padding:.7rem; background:var(--mag-warn-soft); border-radius:var(--mag-radius-sm); }
@media(max-width:600px) { .preview-after { position:relative; clip-path:none !important; }.preview-before { display:none; }.show-before .preview-before { display:block; }.show-before .preview-after { display:none; }.wipe-line,.wipe-control { display:none; }.version-select label { flex-direction:column; align-items:stretch; gap:.35rem; }.preview-page { padding:.7rem; }.snapshot-controls { grid-template-columns:1fr; }.snapshot-controls span { padding:.3rem; } }
</style>
