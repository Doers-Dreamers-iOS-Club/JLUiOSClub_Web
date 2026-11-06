# 主题维护

统一入口是 [网页维护指南](../../docs/about-us/maintenance/index.md)。内容作者从 [内容写作与组件](../../docs/about-us/maintenance/components.md) 开始；动效示例见 [动画展示与复用](../../docs/about-us/maintenance/animations.md)，开发流程见 [开发与维护](../../docs/about-us/maintenance/development.md)。常用组件已全局注册，Markdown 不需要 import；活动页和讲义模板在 `docs/public/templates/`。

## 模块边界

```text
.vitepress/
+-- data/                       # 构建期记录与纯章节目录
|   +-- createRecordLoader.ts   # 三类记录的加载器工厂
|   +-- shared.ts               # 日期、排序、线性年份分组
|   +-- course.ts               # 章节目录与章节 ID
+-- plugins/icons.ts            # 构建期裁剪未引用的图标 CSS
+-- theme/
    +-- index.ts                # 主题组装入口
    +-- components/register.ts  # Markdown 组件动态注册
    +-- components/Mag*.vue     # 通用排版组件
    +-- components/activities/  # 活动专题
    +-- components/learning/    # 课程与教学图解
    +-- composables/            # 浏览器状态与资源生命周期
    +-- ascii/                  # 首页字符渲染
    +-- styles/                 # 令牌、正文、动效与专题样式
```

优先使用纯函数、Vue slots 和 composables。只有多处具有相同职责时才抽取；工厂用于统一记录加载，函数策略用于注入不同封面的入场动画。不要为单个功能建立类继承或服务容器。

## 内容与索引

活动、新闻、竞赛均从对应 `*/index.md` 的 frontmatter 构建索引。title 必填，date 使用带引号的 ISO 日期或月份；活动可以从 YYMMDD 目录推断日期。没有日期的记录归入“未归档”。数据只输出页面消费的字段；扩展字段需同时说明消费者。

`.data.mts` 是 VitePress 数据入口；浏览器只收到序列化结果。`shared.ts` 是可独立测试的纯函数，`groupByYear` 保留输入顺序，单次遍历完成分组。新增活动无需登记索引；侧栏仍在 `sidebar.ts` 维护。课程章节目录、侧栏与进度上限统一来自 `data/course.ts`，存储操作独立在 `composables/readingState.ts`。

## 通用组件

| 组件 | 有效接口 |
| --- | --- |
| MagHero | title、date、entrance；title / default 插槽 |
| MagSection | title、n |
| MagGrid | cols、media；默认插槽 |
| MagCard | title、href、compact；默认插槽，链接卡片同样支持正文 |
| MagStep | n、title；header / default 插槽 |
| MagNote | type、title、icon |
| MagFigure | src、alt、caption、maxHeight、plain；图片插槽 |
| MagDetails | summary；默认插槽；原生 open 属性 |
| MagTimeline / MagTimelineItem | 容器；节点 title、tag |
| MagBadge | type |
| MagArchive | source、limit、view、showViewToggle |
| MagButton | href、variant、block |
| MagCarousel | autoplay；直接放 img 的默认插槽 |
| MagModal | title、width；trigger(open)、default(close)、footer(close) |

新增通用组件在 `components/register.ts` 登记，在 `.vitepress/env.d.ts` 添加模板类型，并在组件指南补充实际渲染示例。业务专用组件在所属页面内导入。`LearningIllustration` 的场景注册在 `learning/illustrations/registry.ts`，多个实例共用异步组件定义。

旧版 MagHero 的 subtitle/eyebrow/issue、MagCard 的 icon/tag、MagArchive 的 highlightLatest 和 ReadingTools 的 minutes 已移除；它们在旧实现中不影响渲染。

## 动效边界

- `useRouteMotion` 管理页面切换；`usePageEnhancements` 管理路由后的图片缩放与内容揭示。
- `useCourseCover` 只负责封面/正文状态、输入、hash 和翻页；课程与活动分别传入自己的 entrance 函数。
- `observeArtworkPlayback` 管理插画视口、后台、封面状态与事件清理；各插画保留自己的 GSAP 时间轴。
- `usePlaybackVisibility` 提供元素可见、页面前台、减少动态效果状态；轮播和 `useLabPlayback` 各自管理计时器与用户暂停状态。
- `useFullPage`、`useHomeIntro`、ASCII 模块维持首页专用协议，不强行并入通用封面模块。

在挂载后访问 DOM，卸载释放监听、观察器和时钟；GSAP matchMedia 负责还原样式。SVG 长度与布局先集中读取，再创建动画。保留 SSR 可读内容及插画初态，不能让动画阻塞正文。后台/离屏暂停与异步卸载取消属于生命周期控制。

## 图标和样式

使用完整静态类名，如 `ti ti-arrow-up-right`。条件和数据表中的类名也必须是完整字符串，不能拼接 `ti-${name}`。构建插件自动扫描主题及 Markdown，删除未使用的图标规则；字体继续使用上游分片，版权信息保留。开发时新增图标会触发样式刷新。

颜色、间距、字号优先使用 `styles/tokens.css`。通用排版放组件 scoped CSS，插槽正文使用 `:deep()`；不要复制一份页面专用网格或提示框。

## 检查

```sh
npm test
npm run typecheck
npm run build
npm run preview -- --port 4173
npm run check:components -- http://localhost:4173
npm run check:playback -- http://localhost:4173
node scripts/check-overview-loading.mjs http://localhost:4173
node scripts/check-artwork-first-frame.mjs http://localhost:4173
node scripts/check-route-motion.mjs http://localhost:4173
```

复杂动效另有 `check-course-motion`、`check-fullpage`、`check-ai-course` 等浏览器检查。使用系统 Chrome。类型检查保持 strict；`vendor.d.ts` 只声明上游未提供类型的少量接口，私有 VPMenu 通过 `types/vitepress-menu.d.ts` 声明组件边界，不把依赖内部源码纳入本项目检查。

设计背景与本次审查见 [重构设计](../../docs/superpowers/specs/2026-11-06-maintainability-design.md)。旧设计记录保留在 superpowers 目录和 Git 历史中。
