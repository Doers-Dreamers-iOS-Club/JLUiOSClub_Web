import { defineAsyncComponent, type Component } from 'vue'
import LearningIllustration from '../learning/LearningIllustration.vue'
import { illustrationLoaders, type Scene } from '../learning/illustrations/registry'

type Example = {
  id: string
  group: '教学演示' | '主题插画' | '文字交互'
  title: string
  description: string
  component: Component
  preload: () => Promise<unknown>
  props: Record<string, string | boolean>
  code: string
  usage: string
}

const lessons = {
  project: { title: '从规则到游戏', description: '开始、得分、碰壁与重新开始，展示一个小项目的运行过程。' },
  context: { title: '上下文与协作', description: '先看文件与现有实现，再把目标和反馈交给 Agent。' },
  pause: { title: '暂停与恢复', description: '观察暂停时保留的状态，以及恢复和重开之间的区别。' },
  timers: { title: '重复计时器', description: '对照正常计时和重复创建时钟后越跑越快的情况。' },
  versions: { title: '版本记录', description: '修改、暂存、提交与回看，说明版本如何保留作品的不同阶段。' },
  skill: { title: '复用 Skill', description: '让同一套检查步骤用于不同游戏，展示方法的复用。' },
  mcp: { title: 'MCP 工作台', description: 'Agent 发出操作，浏览器工具执行，再把观察结果返回。' },
  api: { title: 'API 请求', description: '请求打包、服务验证、回答逐段返回的完整过程。' },
  observe: { title: '先试玩，再判断', description: '打开作品、实际试玩、记录现象的三个步骤。' },
  feedback: { title: '让反馈可以复现', description: '把实际结果与预期结果并排展示，说明如何描述问题。' }
} satisfies Record<Scene, { title: string; description: string }>

const localImport = (name: string, file: string, markup = `<${name} />`) =>
  `<script setup>\nimport ${name} from '@theme/components/${file}.vue'\n</script>\n\n${markup}`

const artworkLoaders = {
  course: () => import('../learning/CourseArtwork.vue'),
  activities: () => import('../activities/ActivitiesArtwork.vue'),
  swift: () => import('../activities/WinterSwiftArtwork.vue'),
  text: () => import('../RollText.vue')
}

export const animationExamples: Example[] = [
  ...Object.entries(lessons).map(([scene, lesson]) => ({
    id: scene,
    group: '教学演示' as const,
    ...lesson,
    component: LearningIllustration,
    preload: illustrationLoaders[scene as Scene],
    props: { scene },
    code: `<LearningIllustration scene="${scene}" />`,
    usage: '直接粘贴到 Markdown。scene 选择演示内容；进入视口后播放，可用画面中的按钮暂停。'
  })),
  {
    id: 'course', group: '主题插画', title: '从想法到作品',
    description: '草稿、代码与游戏的三阶段插画。移动端逐段进入视口后播放。',
    component: defineAsyncComponent(artworkLoaders.course),
    preload: artworkLoaders.course,
    props: { compact: true }, code: '<CourseArtwork compact />',
    usage: '已全局注册。compact 调整外边距；每次挂载播放一次，适合讲义导语或课程介绍。'
  },
  {
    id: 'activities', group: '主题插画', title: '社团活动编辑台',
    description: '展开手册、绘制线条、设备与纸飞机依次出现。',
    component: defineAsyncComponent(artworkLoaders.activities),
    preload: artworkLoaders.activities,
    props: {}, code: localImport('ActivitiesArtwork', 'activities/ActivitiesArtwork'),
    usage: '需要上面的局部导入，不需要额外参数。可独立放入普通 Markdown 页面，进入视口后播放一次。'
  },
  {
    id: 'swift', group: '主题插画', title: 'SwiftUI 与 CodeBreaker',
    description: '从界面草图到手机游戏，彩色棋子逐行填入并显示匹配结果。',
    component: defineAsyncComponent(artworkLoaders.swift),
    preload: artworkLoaders.swift,
    props: {}, code: localImport('WinterSwiftArtwork', 'activities/WinterSwiftArtwork'),
    usage: '需要上面的局部导入，不需要额外参数。可在同一页面使用多个实例，每个实例独立播放。'
  },
  {
    id: 'roll-text', group: '文字交互', title: '链接文字翻动',
    description: '鼠标悬停或键盘聚焦链接时，文字逐字向上翻动。试着操作下方链接。',
    component: defineAsyncComponent(artworkLoaders.text),
    preload: artworkLoaders.text,
    props: { text: '查看社团活动' },
    code: localImport('RollText', 'RollText', '<a href="/activities/">\n  <RollText text="查看社团活动" />\n</a>'),
    usage: 'text 设置文字，reverse 反转逐字播放顺序。组件需放在链接内部，悬停与焦点事件由链接触发。'
  }
]

export const animationGroups = ['教学演示', '主题插画', '文字交互'].map(title => ({
  title,
  examples: animationExamples.map((example, index) => ({ ...example, index })).filter(example => example.group === title)
}))
