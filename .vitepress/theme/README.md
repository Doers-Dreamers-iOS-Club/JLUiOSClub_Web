# 主题与组件说明

本主题把原先散落在各页面 `<style scoped>` 里的版式，收敛成一套全局注册的 Vue 组件。

**新增一个页面时不需要写任何 CSS**，也不需要 `import`——直接用下面的组件即可。

视觉方向为克制阅读：保留白灰蓝配色与深浅模式，以统一无衬线字体、400/500 字重、细描边和留白组织内容。正文标题为 22/18/16px，首页开场采用海报式大字与 ASCII 叠印，其余栏目标题保持 22px。代码使用等宽字体。卡片无阴影、无纸角，仅展示标题与入口；链接立即跳转。首页保留全屏可拖拽 ASCII Swift 标识，取消装饰性说明小字。图标使用 Tabler outline。

设计令牌在 `styles/tokens.css`，默认主题覆写在 `styles/base.css`，教学交互在 `components/learning/illustrations/lab.css`。背景、文字与边框只消费主题变量。

## 目录结构

```
.vitepress/
├── theme/
│   ├── index.ts              # 全局注册组件、挂载 GSAP 动效及图片缩放
│   ├── styles/
│   │   ├── tokens.css        # 设计令牌（颜色/字阶/间距/阴影/动效曲线）
│   │   ├── base.css          # VitePress 默认主题覆写
│   │   └── motion.css        # 减少动态效果和打印样式
│   ├── composables/
│   │   ├── useReveal.ts      # GSAP 入场 + IntersectionObserver 栏目揭示
│   │   ├── useMotionReady.ts # SSG 安全的动效开关（水合 + prefers-reduced-motion）
│   └── components/           # 下表中的所有组件
└── data/
    ├── shared.ts             # RecordEntry 类型 + toEntries() 派生（year/issue）
    ├── activities.data.mts   # 活动索引（自动收集）
    ├── news.data.mts         # 新闻索引（自动收集）
    └── competitions.data.mts # 竞赛索引（自动收集）
```

> 数据加载器必须用 `.data.mts` 后缀。本项目的 `package.json` 没有 `"type": "module"`，
> `.data.ts` 会被当成 CJS 加载，而 `vitepress` 是 ESM 包，构建会直接失败。

## 新增一个活动页

1. 建目录 `docs/activities/<YYMMDD-slug>/index.md`，目录名的 `YYMMDD` 前缀会被用来推断日期；
2. 写 frontmatter：

```yaml
---
title: "活动标题"
description: "一句话简介，会作为索引页的摘要"
date: 2026.03.01          # 可省略，省略时从目录名推断
cover: "/example.jpg"     # 可选的活动照片
tags: [Swift, 工作坊]
---
```

3. 正文用下面的组件拼版式。

**索引页会自动收录，不需要手动登记。** 但侧边栏导航仍由 `.vitepress/sidebar.ts` 控制，
如果希望它出现在侧栏，需要在那里加一条。

## 索引页怎么来的（数据层）

`createContentLoader` 收集各类目录下的 `*/index.md`，`toEntries()` 排序后派生两个字段：

- `year`：由 `date`/`timestamp` 推断，用于时间线按年份分组；无日期的归到「未归档」；
- `issue`：按期数自动编号（`№ 01` 递增，最新一期号最大），新增文章后所有期号自动重排。

竞赛页（`competitions/*/index.md`）想要出现在索引里，同样需要 `date`/`icon`/`tags` frontmatter。

## 组件一览

| 组件 | 用途 | 主要 props |
| --- | --- | --- |
| `ClubHome` | 首页介绍、学习入口、活动和社团入口 | 无 |
| `MagHero` | 阅读页页头（短淡入） | `title` `subtitle` `eyebrow` `issue` `date` `entrance` |
| `MagSection` | 章节分隔标题 | `title` `n`（轻量编号） |
| `MagGrid` | 响应式网格容器 | `cols`（桌面列数）`media`（图集模式） |
| `MagCard` | 卡片（icon 参数兼容保留，不展示装饰 emoji） | `title` `tag` `href` `compact` |
| `MagStep` | 编号步骤 | `n` `title`（都省略时退化为普通内容块） |
| `MagNote` | 提示 / 强调块 | `type`: `highlight` \| `tip` \| `warn`，`title` `icon` |
| `MagFigure` | 配图 | `caption` `maxHeight` `plain`（无装裱，用于 logo）；相对路径图片放插槽，见下 |
| `MagTimeline` / `MagTimelineItem` | 纵向时间线 | `tag` `title` |
| `MagBadge` | 行内胶囊标签 | `type`: `default` \| `accent` \| `warn` |
| `MagArchive` | 杂志式索引（时间线 / 网格双视图） | `source`: `activities` \| `news` \| `competitions`，`limit` `view` `showViewToggle` `highlightLatest` |
| `MagButton` | 按钮（替代 el-button） | `href` `variant`: `primary` \| `ghost`，`block` |
| `MagCarousel` | 轮播图（替代 el-carousel） | `autoplay`（间隔毫秒）；图片放插槽 |
| `MagModal` | 弹窗（原生 `<dialog>`） | `title` `width`；插槽 `trigger`（拿 `open`）/ 默认 / `footer`（拿 `close`） |

## 写法示例

```html
<MagHero title="Vibe Coding" subtitle="AI 时代的开发新方式" date="2025.10.18" />

<MagSection n="01" title="活动信息" />

<MagGrid :cols="4">
  <MagCard icon="🗓️" title="活动日期">2025年10月18日</MagCard>
  <MagCard icon="📍" title="活动地点">南区计算机楼 B110</MagCard>
</MagGrid>

<MagStep :n="1" title="打开 Xcode 并创建新项目">
  <p>说明文字。</p>
</MagStep>

<MagFigure caption="图 1：启动界面">
  <img src="./shots/1.png" alt="Xcode 启动界面" />
</MagFigure>

<MagNote type="tip" title="小提示">正文……</MagNote>

<MagButton href="https://example.com" block>立即报名</MagButton>

<MagModal title="请选择场次">
  <template #trigger="{ open }">
    <MagButton @click="open">报名</MagButton>
  </template>
  <p>弹窗内容</p>
</MagModal>
```

### 三个容易踩的点

- **站内相对路径的图片必须放进 `MagFigure` 的插槽**，不能写成 `src` prop：

  ```html
  <!-- 对 -->
  <MagFigure caption="图 1">
    <img src="./imgs/1.png" alt="说明" />
  </MagFigure>

  <!-- 错：构建产物里会缺图 -->
  <MagFigure src="./imgs/1.png" caption="图 1" />
  ```

  因为 VitePress 只重写 markdown 中 `<img src>` 的路径；写成 prop 后它只是一个
  普通字符串，Vite 不会把这张图当作资源打包。`/public` 下的绝对路径不受影响，
  可以直接用 `src` prop。

- **插槽里想写 markdown，前后要留空行**，否则会被当成纯 HTML：

  ```html
  <MagCard title="示例">

  这里可以用 **markdown**。

  </MagCard>
  ```

- **组件的 `<style scoped>` 管不到插槽内容**（插槽带的是父组件的 scope id）。
  给插槽内容加样式必须用 `:deep()`，各组件里已经处理了常见的 `p` / `ul` / `h3` / `a`。

## 动效

`useReveal.ts` 管理内页 GSAP 与 IntersectionObserver。`useFullPage.ts` 管理首页四屏：ASCII、学习、活动、加入。滚轮一次手势一屏，支持触摸、键盘、右侧导航及 hash 深链接。双层反向 transform 实现水平揭幕，桌面约 0.9 秒、移动端约 0.6 秒。非当前屏使用 inert；减少动态效果时立即切换；高度低于 560px 或关闭 JavaScript 时按普通长页阅读。`AsciiHero.vue` 管理 WebGL，卸载释放资源，触屏横拖旋转、竖滑翻页。首屏采用克制的封面叠印：大字 `I`、左侧完整词组 `dwell in`，以及横贯底部的细描边 `Possibility`。三行统一使用本地 Instrument Serif 400 字体，取消分散在左右两侧的大斜体。字体 Latin WOFF2 约 15 KB，来源与 OFL 许可在 `docs/public/fonts/instrument-serif/`；仅在首屏使用。Logo 保持上一版的大小与位置。最终 WebGL 合成读取场景透明度，在字形间隙绘制主题底色，遮挡随真实轮廓与转动变化，Swift 留空区域仍可透出文字。字符快照不包含底色，保留原有重组。竖屏与低高度横屏各自调整文字比例；强制颜色模式恢复实心文字。右侧导航保留悬停短线和栏目名，键盘聚焦、减少动态效果也支持。

首页以 ASCII 串起创造主题：Swift 开场、相触的双手、笔尖与画布、生长的树。`AsciiNarrative.vue` 使用共享二维 Canvas，在翻页时让字符散开后重组，约 1.45 秒后进入各屏动作。首屏通过 `AsciiHero.snapshot()` 读取当前 WebGL 字符单元，保留原字形和位置；后续三个形状来自本地字符矩阵。过渡时隐藏原首屏画布，避免重复显示，反向翻页同样支持重组。

双手全宽延伸至屏幕边缘，轮廓保持原位，以字符和透明度波动呈现流动；纸笔采用轻微倾斜、二维透视映射与小幅摆动；树先长枝干，再从六个枝头展开叶片，约 4.5 秒后停止。叶片归属和生长锚点在采样时由原 SVG 计算。共享帧循环限制为 30fps，仅运行当前可见屏，后台或离屏暂停；底部暂停图标控制字符动效，用户暂停状态跨屏保留。减少动态效果时展示完整静态轮廓，纸笔仍保留倾斜构图。

`AsciiPoster.vue` 在服务端直接输出字符 SVG，供关闭 JavaScript、二维 Canvas 不可用和短屏自然滚动使用。桌面与手机分别采样字符密度，避免窄屏过密。深浅模式切换重绘，后台暂停，减少动态效果直接切换终态，路由卸载清理 GSAP、观察器和监听。学习页四个入口横排；活动页作品图与日期档案分列；加入页居中，保持原有链接与简短文案。

字符底稿在 `docs/public/ascii-creation/`：双手为内置图片工具生成，笔尖和树为原生 SVG；首页只使用 `.vitepress/theme/ascii/creation/*.json` 的字符数据，不请求底稿图片。执行 `node scripts/build-ascii-creation.mjs` 可重新采样。旧摄影和几何组件保留在仓库，首页不再使用。

运行 `node scripts/check-ascii-motion.mjs` 检查手臂边缘覆盖、流动时指尖位置稳定、持续流动、暂停和后台停止、纸笔与文字的间距、分阶段生长及窄屏链接可见性。截图输出到 `output/design-ascii-motion-2026-11-02`。

| 标记 | 行为 |
| --- | --- |
| `data-mag-line` | 首页整行上移显现，0.75 秒 |
| `data-mag-enter` | 页头短淡入，0.55 秒、8px |
| `data-mag-reveal` | 栏目滚动入场，0.55 秒、12px |
| `data-mag-stagger` | 子项滚动入场，批次错开最多 0.14 秒 |

`gsap.matchMedia` 响应运行时减少动态效果偏好；路由变化时 revert 动画并断开观察器。页面卸载时释放动画与图片缩放实例。不要同时动画父子节点，不对正文逐段隐藏，不增加 blur 或循环背景动效。

官方参考：[gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)。

验证：`npm run build` 后运行 `npm run preview -- --port 4173`，再执行 `node scripts/check-fullpage.mjs`、`node scripts/check-design.mjs`。课程交互另用 `node scripts/check-ai-course.mjs http://localhost:4173`。整屏截图输出到 `output/design-ascii-creation-2026-11-02`，通用设计截图输出到 `/private/tmp/club-design-qa`。

## AI 编程入门：内容交互

`components/learning/` 提供静态封面、阅读标记、六轮对话和章节小题。新增图解统一通过 `<LearningIllustration scene="..." />` 按需加载，章节只引用需要的场景，首页不加载这些图解。

| scene | 内容 |
| --- | --- |
| project | 开始、碰壁与清零的自动分镜 |
| context | 定位文件、读取代码，再补齐需求与实际反馈 |
| pause | 暂停、继续、结束与重开的状态剖面 |
| timers | 正常与重复计时器的对照实验 |
| versions | 游戏加速、暂停，暂存提交后回看历史 |
| skill | 同一套检查方法用于贪吃蛇与打砖块 |
| mcp | 浏览器打开游戏、点击开始与暂停，再返回观察结果 |
| api | 对话请求打包、服务验证与回答逐段返回 |
| observe / feedback | 试玩与反馈的短分镜 |

组件位于 `components/learning/illustrations/`，均为辅助正文的自动图解，不再提供选项、拖拽、下拉框或任务操作。`LabFrame` 与 `lab.css` 管理简洁外框和唯一的暂停图标，`useLabPlayback` 管理进入视口后的单时钟循环，`SnakeScene` 提供共用 SVG。至少 15% 可见时运行，离屏与后台暂停，返回后继续；用户主动暂停会保持。结束画面停留后重播。减少动态效果时显示有代表性的静态帧，不运行计时器；卸载时释放全部监听与计时器。标题与标签尽量简短，解释保留在正文，图解不播报每一帧。

所有场景都是教学模拟，不发送模型请求、连接真实 MCP 服务或操作仓库。旧 SnakeLab / FlowExplorer 文件保留作参考，已不在章节或全局组件注册中使用。验证入口：`node scripts/check-ai-course.mjs <本地预览地址>`。

`DemoGame` 提供新分镜中的蛇与砖块运动。上述五幅情境动画另用 `node scripts/check-contextual-demos.mjs` 验证文件读取、提交历史保留、跨游戏复用、工具操作前后状态与响应顺序。截图保存在 `output/design-contextual-demos-2026-11-02`。
