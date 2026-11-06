# 代码审查与渐进重构设计

用户已于 2026-11-06 批准渐进重构：保持页面与动效体验，统一数据与播放生命周期，完善 Markdown 组件与示例，清理冗余并缩减图标样式。

## 审查结论与基线

- `MagCarousel.vue` 的自动播放仅在启动时检查减少动态效果。浏览器实测切换偏好或模拟后台后，4000ms 计时器仍存在。
- `MagArchive.vue` 分组时反复复制数组，同年份记录的总成本为 O(n²)；`ActivitiesLanding.vue` 另有一套分组算法。
- 竞赛日期 `2024.02`、`2024.04` 被 YAML 解析为数字，数据转换忽略它们，导致年份错误。
- `CourseProgress.vue` 和 `ReadingTools.vue` 把六章硬编码；目录、浏览器存储与组件职责混合。
- `MagHero` 的 subtitle/eyebrow/issue、`MagCard` 的 icon/tag、`MagArchive` 的 highlightLatest、`ReadingTools` 的 minutes 为无效参数。链接卡片的正文默认不显示，需要明确 API 并清理旧内容。
- 课程、活动插画重复管理可见性、后台状态、封面事件和监听清理。通用封面翻页 composable 内包含课程专用排版选择器。
- `CursorWave`、`HomeGeometry`、`SnakeLab`、`FlowExplorer`、`useMotionReady` 共 651 行，没有运行时引用。`motion-v` 没有消费者。
- 全局 Tabler CSS 240540 字节，包含 5266 条图标选择器。新闻页实测主样式 487819 字节，附加图标样式 900 字节（均为解码后），图标字体实际仅请求 core 子集 41476 字节，不能把整个字体包大小当成首屏下载量。
- `npm run build` 通过（30.40s）。栏目加载检查通过，三个封面初始 JS 分别为 285936 / 288135 / 285791 字节。
- `check-design.mjs` 基线失败于 SVG 小字号判断，同时仍查询活动页已移除的归档切换器与课程页旧类名。`check-artwork-first-frame.mjs` 基线在深链接阶段超时，重构后需要定位并复验。

## 架构与职责

```text
docs/*.md --> content components --> feature components
                    |                     |
                    v                     v
               pure helpers         Vue composables

frontmatter --> loader factory --> typed records --> archive views
chapter catalog -------------------------------> progress + navigation
```

- 数据：加载器工厂统一 createContentLoader 配置；纯函数完成日期、排序、分组。修正原始日期数据，内部只接受明确格式，不增加猜测式兼容解析。
- 组件：保持 Mag 前缀与已有组件位置，主题注册表集中声明动态导入。通用组件只关心 props/slots，不直接依赖业务目录；归档组件为明确的业务组件。
- 动效：封面机制通过函数参数接收入场策略。共享观察器机制统一后台、可见性和清理，具体 SVG 编排仍在功能模块内。保留 SSR 初态、减少动态效果、延迟加载与路由卸载语义。
- 课程：章节目录独立为无浏览器依赖的模块，数量与成员关系由目录派生；持久化独立于目录。
- 图标：构建期从实际源文件提取静态图标类，仅保留用到的 CSS 规则，沿用上游字体分片与许可证；新增图标无需手工维护白名单。
- 内容作者：新增站内组件指南、活动和讲义模板，展示网格、提示、步骤、图片、轮播、弹窗及 Markdown 插槽空行规则。轻量折叠块使用原生 details。

不引入类继承、服务容器或通用插件框架。TypeScript 联合类型、函数工厂、Vue slots/composables 已足以表达边界。内部契约不使用静默 catch、重复验证或猜测式 fallback；生命周期条件不是异常兜底。

## 验收

1. 构建、类型检查与数据转换测试通过。
2. 轮播切换减少动态效果、后台、离屏、聚焦时停止，卸载无计时器。
3. 课程/活动封面、插画首帧、懒加载和路由回归通过；基线失败有明确处理结果。
4. 组件指南能直接编译，移动宽度无横向溢出，图片路径正确。
5. 对比同一路由的解码后 CSS/JS，报告真实变化，不把删除未使用文件称为运行速度提升。
6. 分支为 `Hean-Yi/refactor-docs-architecture`；提交作者和提交者均为 Hean-Yi。


## 实施结果

已完成批准的渐进重构。记录加载器使用函数工厂；年份分组为单次遍历；章节目录为侧栏、进度和成员判断的唯一来源。主题入口只组装注册与行为，通用组件使用 props/slots，动效使用 composables 与函数策略。

删除五个无引用模块（651 行）及未使用的直接依赖。构建期裁剪 Tabler 图标规则，保留字体分片与许可证；活动和新闻索引不再生成未消费的摘要、标签、图标与期号。竞赛月份日期已修正为字符串，归档年份恢复为 2024。

### 加载成本

在同一生产预览环境、同一新闻路由 `/news/an-nuo-xi/`，按浏览器 Resource Timing 的 decodedBodySize 对比；最终测量禁用缓存。

| 指标 | 重构前 | 重构后 |
| --- | ---: | ---: |
| CSS 解码后字节 | 488719 | 288074 |
| CSS 减少 | — | 200645 字节 / 41.06% |
| 年份分组最坏复杂度 | O(n²) | O(n) |

栏目封面仍不加载首页、Mermaid 和 ScrollTrigger 运行时，保留原有延迟加载。未把删除无引用模块、一次构建耗时差异或缓存差异当作用户侧运行速度提升。

### 修复与验证

- 轮播在后台、离屏、悬停、键盘聚焦、减少动态效果时停止，路由卸载清理计时器；教学动画保留用户暂停意图。
- 可见性观察器处理同一回调内的全部状态记录，修复深链接插画一直停在 waiting 的问题。
- 插画准备先批量读取布局，再创建动画，保留原有时间轴和首帧姿态。
- `MagCard` 的插槽契约已明确，新增原生 `MagDetails`；组件指南、活动模板和讲义模板可直接使用。
- 新增 strict 类型检查及 4 项数据/图标测试，均通过；生产构建通过。
- 浏览器检查全部通过：`check-components`、`check-playback`、`check-overview-loading`、`check-artwork-first-frame`、`check-course-motion`、`check-design`、`check-ai-course`、`check-route-motion`。
- 覆盖 8 个代表页面、10 个教学场景、320/390px、深浅色、SSR、减少动态效果、阅读进度、测验、图片、模板下载、弹窗焦点与路由历史。
- 修正已有测试中过期的活动归档/课程选择器；字号断言只检查 HTML 正文，SVG 自身坐标下的字号不等同于页面正文像素；滚动断言选择实际绑定动效的元素；路由偏好切换测试先等待上一轮媒体事件完成再开始跳转。
- 独立架构符合性审查与代码质量审查通过，`git diff --check` 通过。

作者入口：`docs/guide/components.md`。维护入口：`.vitepress/theme/README.md`。下载模板：`docs/public/templates/activity.md`、`lesson.md`。
