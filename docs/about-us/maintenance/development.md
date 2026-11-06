---
title: 开发与维护
description: 官网本地开发、目录职责、内容发布前检查与动画扩展约定。
---

<MagHero title="开发与维护">

官网基于 VitePress 与 Vue。普通内容维护从 Markdown 开始；共享组件、数据加载和动效分别维护在主题与数据目录中。

</MagHero>

## 本地运行与检查

Node 版本以仓库根目录的 `.node-version` 为准，依赖以 `package-lock.json` 为准。在仓库根目录执行：

```sh
npm ci
npm run dev
```

完成修改后运行检查，再构建并预览静态产物：

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 根据锁文件安装依赖 |
| `npm run dev` | 启动本地开发站点，修改后实时预览 |
| `npm test` | 执行 `tests/` 下的 Node 测试 |
| `npm run typecheck` | 检查 Vue 与 TypeScript 类型 |
| `npm run build` | 生成 `.vitepress/dist/` 静态产物并检查页面链接 |
| `npm run preview` | 预览已构建的静态产物 |

检查正文、图片、下载链接和代码块，并在手机宽度、深色模式和减少动态效果模式下查看页面。组件或动效有改动时，先运行 `npm run preview -- --port 4173`，再在另一个终端运行相应浏览器检查：

```sh
npm run check:components -- http://localhost:4173
npm run check:playback -- http://localhost:4173
node scripts/check-maintenance.mjs http://localhost:4173
```

## 目录与职责

| 路径 | 维护内容 |
| --- | --- |
| `docs/` | Markdown 页面与所属专题的图片 |
| `docs/public/` | 按原路径提供的静态资源与下载文件 |
| `docs/public/templates/` | 活动页与讲义的 Markdown 模板 |
| `.vitepress/config.mts` | 站点配置、顶部导航、搜索与构建插件 |
| `.vitepress/sidebar.ts` | 侧栏入口与专题分组 |
| `.vitepress/data/` | 活动、新闻、竞赛索引及共享章节目录 |
| `.vitepress/theme/index.ts` | 主题组装入口 |
| `.vitepress/theme/components/` | Mag 排版组件、页面组件及教学图解 |
| `.vitepress/theme/components/register.ts` | Markdown 全局组件注册 |
| `.vitepress/theme/composables/` | 路由动效、可见性、播放与浏览器状态 |
| `.vitepress/theme/styles/` | 颜色与排版令牌、正文和专题样式 |
| `tests/`、`scripts/` | 自动测试与浏览器检查脚本 |

构建期索引通过 `.data.mts` 输出序列化数据；日期解析、排序和年份分组放在 `data/shared.ts`，浏览器交互放在组件或 composable 中。AI 编程课程目录统一来自 `data/course.ts`，共用正文维护在 `docs/resources/ai-programming/_content/`。

## 新增活动或讲义

1. 从 [活动页模板](/templates/activity.md){download="activity.md"} 或 [讲义模板](/templates/lesson.md){download="lesson.md"} 开始。在 `docs/activities/YYMMDD-slug/index.md` 创建活动入口，将讲义与图片放入同一专题。
2. 填写 frontmatter 的 `title`、`description` 与 `date`。日期使用带引号的 `"YYYY-MM-DD"`；只知道月份时使用 `"YYYY-MM"`。活动可以省略日期，由 `YYMMDD-` 目录名推断；无日期记录归入“未归档”。
3. 使用 [现有组件](/about-us/maintenance/components) 排版。`docs/public/` 中的资源使用 `/` 开头的路径；专题内图片使用相对路径，并为图片填写有意义的替代文字。
4. 活动详情统一使用 `MagArticle`，启用杂志侧栏，检查当前文章标记、文内目录与继续阅读链接；侧栏条目和专题分组统一维护在 `.vitepress/sidebar.ts`。活动、新闻与竞赛的 `*/index.md` 会自动进入各自索引，无需手动登记；其他栏目需要侧栏时在 `.vitepress/sidebar.ts` 配置。首页推荐与顶部导航仅在确有入口需求时更新。
5. 本地预览并执行前述检查，确认专题入口、讲义之间的链接及下载文件都可访问。

## 扩展组件与动画

先在 [动画展示与复用](/about-us/maintenance/animations) 选择已有示例。普通页面无需重新实现封面切换或首页滚动协议。

- 通用排版组件放在 `components/`，通过 `components/register.ts` 注册，并在 `.vitepress/env.d.ts` 补充模板类型；同时在组件指南添加可运行示例。专题专用组件在所属页面显式导入。
- 教学图解放在 `components/learning/illustrations/`，在 `registry.ts` 中登记场景，再通过 `LearningIllustration` 的 `scene` 使用。多个实例共用异步组件定义；同步在 `components/maintenance/animationExamples.ts` 添加展示名称、用途和复用代码。
- 分步播放沿用 `useLabPlayback`，提供本场景的推进、重置和静态状态。它通过 `usePlaybackVisibility` 处理离屏、后台与减少动态效果状态，不要在每个场景重复复制定时器和监听器。
- 其他需要可见性控制的组件复用 `composables/usePlaybackVisibility.ts`；封面插画沿用 `observeArtworkPlayback`，保留各自的 GSAP 时间轴。挂载后访问 DOM，卸载时释放监听、观察器与时钟。
- 首页专用逻辑由 `useFullPage`、`useHomeIntro` 与 ASCII 模块维护。新增动画应保留可读的静态初态，不能依赖播放完成才能阅读正文。

## 图标与样式

图标使用完整、静态的类名，例如 `class="ti ti-arrow-up-right"`。条件分支和数据表中的图标也必须写成完整字符串，不能运行时拼接类名；构建插件会扫描源码并裁剪未引用图标。

颜色、间距和字号优先使用 `.vitepress/theme/styles/tokens.css` 的现有令牌。布局优先组合 Mag 组件；通用排版放在组件 scoped CSS 中，插槽正文按需使用 `:deep()`。

更完整的组件接口、动效边界与专项检查见仓库中的 `.vitepress/theme/README.md`。
