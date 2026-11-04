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

`useReveal.ts` 管理内页 GSAP 与 IntersectionObserver。`useFullPage.ts` 管理首页四屏：ASCII、学习、活动、加入。滚轮一次手势一屏，支持触摸、键盘、右侧导航及 hash 深链接。双层反向 transform 实现水平揭幕，桌面约 0.9 秒、移动端约 0.6 秒。非当前屏使用 inert；减少动态效果时立即切换；高度低于 560px 或关闭 JavaScript 时按普通长页阅读。`AsciiHero.vue` 管理 WebGL，卸载释放资源，触屏横拖旋转、竖滑翻页。首屏采用克制的封面叠印：大字 `I`、左侧 `dwell` 与右侧 `in`，以及横贯底部的细描边 `Possibility`。三行统一使用本地 Instrument Serif 400 正体；字块按末行自然宽度收缩，`in` 与末尾 `y` 的右边缘对齐。只为 `t` 与 `y` 增加局部间距，取消末字负字距，避免轮廓粘连。字体 Latin WOFF2 约 15 KB，来源与 OFL 许可在 `docs/public/fonts/instrument-serif/`；仅在首屏使用。三行取消额外行距，通过字形的可见边缘紧密堆叠；前两行按剩余高度放大，仍保持第三行大于第一行、第一行大于第二行。第三行字号及底部位置固定，竖屏采用紧凑字块以保留原字号。Logo 保持上一版的大小与位置。诗句三行接入 `useFullPage.ts` 的 GSAP 翻页时间轴：离开时错峰上移淡出，返回时依次上移显现；完成、hash 中断、减少动态效果及离开全屏断点时清除内联动效状态。最终 WebGL 合成读取场景透明度，在字形间隙绘制主题底色，遮挡随真实轮廓与转动变化，Swift 留空区域仍可透出文字。字符快照不包含底色，保留原有重组。竖屏与低高度横屏各自调整文字比例；强制颜色模式恢复实心文字。右侧导航保留悬停短线和栏目名，键盘聚焦、减少动态效果也支持。

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

## 导航、文字悬停和搜索动效

配置通过 Vite alias 替换默认主题的 `VPFlyout.vue` 与 `VPNavBarSearch.vue`，不修改依赖包。`ClubFlyout.vue` 沿用 VitePress 的菜单内容，参考 [GSAP easeReverse UI interactions](https://demos.gsap.com/demo/easereverse-ui-interactions/)：面板从 0.7 倍缩放和向上 30% 的位置弹出，箭头弹性转动，选项错峰滑入；反向使用独立缓动与 2.5 倍速度，允许中途反转。支持 hover、点击、键盘方向键、Escape、焦点移出及外部点击关闭，无 JS 时保留 CSS hover/focus 展开。

`RollText.vue` 用于主页资源、活动与加入入口，参考 [Menu Nav GSAP](https://codepen.io/moussamamadou/pen/zxYONpz?anon=true&view=pen) 的文字部分。字符上移一行，蓝色 text-shadow 接替原文字，每字间隔 20ms；相邻资源入口交替使用左右起始顺序。沿用现有字体和布局，不添加图片；屏幕阅读器仅读取一次完整标题。字符动画与原翻页容器分开，避免争用 transform。

`GooeySearch.vue` 参考 [Gooey Search](https://github.com/oguzhantufenk/gooey-search)，用现有 GSAP 实现胶囊拉伸、图标分离及结果黏连弹出。首次输入时才加载 `searchContent.ts`、MiniSearch 和本站 VitePress 索引，最多展示六个真实结果，保留标题上下文与锚点链接。支持 Cmd/Ctrl K、斜杠、方向键、Enter、Escape、点击外部及路由变化关闭；快速输入会丢弃过期响应。手机与较窄桌面在导航栏下方展开，结果列表可滚动。减少动态效果时直接切换状态；触屏 WebKit 使用无 SVG 滤镜的动效降级。

验证：`node scripts/check-navigation-motion.mjs http://localhost:4174`，截图位于 `/private/tmp/club-navigation-qa`；再运行 `scripts/check-fullpage.mjs` 检查原有首页交互。

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

### 首页 slogan intro

首页 HTML 自带轻量 CSS 翻字开场，不依赖 Vue、GSAP 或 WebGL 下载完成。`.vitepress/homeBoot.ts` 提供首帧 slogan、交错翻字和重复文字呼吸效果；挂载后接入 `useHomeIntro.ts` 的重复排版横移、交错拆字与三行收束。字体单独预加载；Mermaid 改为异步注册并移除首页的额外 modulepreload，课程和 Mag 组件按需加载，关闭导航链接预取。Swift WebGL 在挂载 750ms 后请求，后续叙事组件在挂载 1400ms 后准备，避开 logo 交接时初始化。保留 SSR 的诗句和静态字符画。

`Possibility` 的实心墨水沿水平边界从上到下退去，像水位下降；边界上方显露 ASCII，下方仍是实心。填充与纹理裁剪边界共用 50px 外扩范围，保留字母升降部。水位经过每一行时，该行字符立即显露并脱离，退墨与飞行共用同一时钟；不会等待整行转换完成。字符沿三次 Bézier 弧线汇聚到 `AsciiHero.snapshot()` 的真实字符坐标。`introAscii.ts` 生成纹理及源字符点；`introFlight.ts` 在一个 Canvas 中插值位置、字符大小与透明度，最后一批字符接近目标时就与运动中的 WebGL 交叉交接，再恢复交互。字符按水平邻域匹配目标，出生时间由水位缓动反算；飞行时长略有差异，五次缓动让起终点速度、加速度归零，字符内容也交叉淡化。结束时间按实际最长行程计算，不保留固定静止尾段。最后 550ms 已启动 WebGL 运动，运动增益柔和升起，intro 卸载前后沿用同一个运动时钟。叙事组件首次布局不再读取 GPU 字符快照。

非开场 hash、减少动态效果跳过；Escape、窗口尺寸变化、hash 导航及卸载会清理。HTML cover 兜底 6.5 秒，字体等待上限 650ms，logo 目标等待上限 1.2 秒，整体兜底 9.5 秒。慢速或失败的 WebGL 不会永久阻塞主页。播放时锁定首页翻页及 Swift 交互。

验证：生产构建后执行 `node scripts/check-home-intro.mjs http://localhost:4174`、`node scripts/check-home-loading.mjs http://localhost:4174` 和 `node scripts/check-fullpage.mjs http://localhost:4174`。覆盖字形转粒子、桌面/手机/深色、跳过路径、无 JS、阻断全部外部 JS 时的 HTML 开场、按需 Mermaid 渲染及首页资源量。截图写入 `/private/tmp/club-intro-qa`，资源清单写入 `/private/tmp/club-load-after.json`。

交接检查：`node scripts/check-intro-handoff.mjs http://localhost:4174` 验证桌面和手机上，最后字符仍在飞行时 WebGL 已运动，交接前后运动相位连续，叙事组件提前就绪；报告本机交接附近的帧间隔。

### 双手与盗火之间的流沙过渡

`ascii/sand-transition.ts` 只负责第二、三屏之间的 ASCII 转场。双手离开时，带有细微轮廓起伏的侵蚀边界从右向左推进；尚未经过边界的字符保持原位和透明度，经过的字符缩成细砂，沿下坠的 Bézier 曲线组成下方持火炬的手和火炬。指尖之间的火花仍沿原路径生长成上方火焰，火焰不参与流沙映射。反向播放同一组路径，双手从左向右逐步堆积成形。流沙使用稳定的涟漪和短尾迹，避免逐帧随机抖动；轨迹在切换时一次生成，流沙字符总数最多为双手与持炬部分较大点数的两倍，另加原有火焰字符。

沿用现有转场时长、暂停与减少动态效果处理。首屏 intro、静态场景运动、盗火与阿戈尔号之间的转场及作品标签保持原样。验证：`node scripts/check-sand-transition.mjs` 检查端点、侵蚀方向、反向成形和字符数量；`node scripts/check-ascii-motion.mjs http://localhost:4174` 检查实际浏览器中的双向转场及原有交互。前者可选传入旧版 `myth-motion.ts` 路径，逐帧比较保留的指尖生火路径、火焰与船转场。

### ASCII 作品标签

第二至四屏的 `AsciiPoster.vue` 使用 figure/figcaption 组织图像与作品标签。原文分别为 `Fiat lux`（拉丁文）、`πῦρ ἐγώ σφιν ὤπασα.`、`Ἀργὼ πᾶσι μέλουσα`（古希腊语）。出处为《创世记》1:3、[《被缚的普罗米修斯》252行](https://www.greek-language.gr/digitalResources/ancient_greek/library/browse.html?page=7&text_id=132)、[《奥德赛》12.70](https://atlas.perseus.tufts.edu/nodes/urn%3Acts%3AgreekLit%3Atlg0012.tlg002.perseus-grc2%3A12.70/)。来源说明只提供给辅助技术，视觉上仅展示原文。

标签采用 EB Garamond 400 正体，桌面 16px、手机 15px，24px 行高，沿用主题次级文字色。本地 Latin/Greek/Greek Extended 字体约 41KB，含 OFL 许可，首次悬停或聚焦才启用字体，避免增加 intro 的字体请求。标签始终预留位置，鼠标停留 120ms 后轻微上移淡入；键盘聚焦也能显示。触屏轻点显示 3.5 秒，不拦截翻页手势，离开该页清除触屏状态。翻页期间隐藏标签，减少动态效果时立即切换。

验证：`node scripts/check-ascii-captions.mjs http://localhost:4174` 检查默认隐藏、hover/focus/touch、按需字体、原文、320/390px、深色模式、几何稳定和减少动态效果；截图写入 `/private/tmp/club-caption-qa`。
