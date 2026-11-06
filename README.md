# JLU iOS Club 官网

官网地址：<https://jluios.club>

![logo](docs/public/logo-hero.png)

## 项目概览

这是 JLU iOS Club 的静态官网仓库，基于 **VitePress** 构建，主要用于：

- 展示社团介绍、新闻、活动、竞赛与学习资源；
- 承载长期沉淀型讲义（如 Winter Swift 系列）；
- 提供可维护的内容站点工作流（Markdown + Vue 组件）。

## 技术栈

- 框架：`vitepress`（本地搜索、静态构建）
- 主题增强：`medium-zoom`、自定义主题样式（`/.vitepress/theme`）
- 图表：`mermaid` + `vitepress-plugin-mermaid`
- UI 组件：Vue 自定义组件、Tabler outline 图标
- 动效：GSAP（首页与栏目入场，支持减少动态效果）
- Markdown 能力：`markdown-it-implicit-figures`

## 快速开始

### 1) 安装依赖

使用仓库中的 npm 锁文件安装：

```bash
npm ci
```


### 2) 本地开发

```bash
npm run dev
```

启动后默认由 VitePress 提供本地站点（配置里使用 `--host 0.0.0.0`）。

### 3) 构建与预览

```bash
npm run build
npm run preview
```

## 目录结构（核心）

```text
.
├─ .vitepress/
│  ├─ config.mts              # 站点配置（导航、搜索、Mermaid、Sitemap）
│  ├─ sidebar.ts              # 侧边栏与栏目路由组织
│  └─ theme/
│     ├─ index.ts             # 主题增强（图片缩放等）
│     ├─ style.css
│     └─ styles/
├─ docs/
│  ├─ index.md                # 首页
│  ├─ about-us/               # 关于我们
│  ├─ activities/             # 活动（含历次活动与专题课程）
│  ├─ competitions/           # 竞赛导航与子页面
│  ├─ news/                   # 新闻
│  ├─ resources/              # 学习资源
│  ├─ join-us/                # 加入我们
│  ├─ components/             # Markdown 中复用的 Vue 组件
│  └─ public/                 # 静态资源（logo/favicon/二维码等）
└─ README.md
```

## 内容维护指南

统一入口：[网页维护指南](docs/about-us/maintenance/index.md)（站内路径 `/about-us/maintenance/`），包含 [内容写作与组件](docs/about-us/maintenance/components.md)、[动画展示与复用](docs/about-us/maintenance/animations.md) 和 [开发与维护](docs/about-us/maintenance/development.md)。

### A. 新增普通内容页

1. 在 `docs/` 对应栏目下创建 `index.md` 或新页面；
2. 在 `/.vitepress/sidebar.ts` 对应路径下补充 `link`；
3. 若需要导航入口，再更新 `/.vitepress/config.mts` 的 `nav`。

### B. 新增活动专题（建议流程）

以 `docs/activities/260209-winter-swift/` 这种专题目录为例：

1. 新建专题目录与页面（如 `index.md`、`first.md`、`second.md`）；
2. 图片放入专题下 `imgs/` 或 `shots/`，避免跨目录引用；
3. 在 `/.vitepress/sidebar.ts` 增加专题侧栏分组；
4. 活动索引会自动收录 `docs/activities/*/index.md`；按需更新首页推荐入口。

### C. Winter Swift 专题当前组织

- 主线讲义：`first.md`、`second.md`
- 补充讲义：`bonus-ai-programming.md`
- 专题导航：`docs/activities/260209-winter-swift/index.md`

这种“主线 / 补充”分组方式，适合后续持续追加扩展内容。

## 编写约定（建议）

- 页面建议使用 Frontmatter 标注：`title`、`description`、`date`；
- 复杂讲义优先组合现成排版组件，参见 [内容写作指南](docs/about-us/maintenance/components.md)；
- 需要交互时可在 Markdown 使用 `<script setup>` + Vue 组件；
- 图示类内容优先 `mermaid`，截图类内容统一放专题子目录；
- 链接尽量使用站内绝对路径（如 `/activities/xxx/`），保证部署一致性。

## 已启用站点能力

- 本地全文搜索（`themeConfig.search.provider = 'local'`）
- 图片点击缩放（`medium-zoom`）
- Mermaid 流程图渲染
- 清爽链接（`cleanUrls: true`）
- sitemap 自动生成（域名 `https://jluios.club`）

## 部署说明

当前站点可直接使用 VitePress 静态产物部署到任意静态托管平台（如 Cloudflare Pages）。

- 构建命令：`npm run build`
- 输出目录：VitePress 默认输出目录（`.vitepress/dist`）

## 维护建议

- 定期清理无效资源（如 macOS 产生的 `._*` 文件、`.DS_Store`）；
- 新增活动会自动进入活动索引；同步检查侧栏并按需更新首页推荐入口；
- 活动和讲义可复制 `docs/public/templates/` 中的 Markdown 模板。

## License

本项目基于 [MIT License](./LICENSE) 开源。


## AI 编程入门专题

入口：`/resources/ai-programming/`。包含六章主线、API 补充、五篇随查、配套材料与连续阅读版。

- 在线正文只维护 `docs/resources/ai-programming/_content/`，分章页与连续阅读通过 Markdown include 共用。
- 页面元信息、相关阅读与小题放在 `chapters/`；交互组件位于 `.vitepress/theme/components/learning/`，专题样式为 `styles/learning.css`。
- `docs/public/ai-programming/files/` 保存可下载原文件。完整讲义 ZIP 保留原始目录；修改原材料后需要同步更新下载包。
- 静态托管会隐藏点文件，因此 API 环境变量样例通过 `files/api/env.example` 提供，下载属性保留 `.env.example` 文件名；ZIP 内保留原名。
- 阅读进度仅存于本机浏览器，交互演示不调用模型 API。
- 新入口同时维护顶栏、侧栏、首页、资源页及相关讲座。`_content` 为非独立页面，已在站点配置排除。
- 校验：`npm run build`；交互与链接回归见 `scripts/check-ai-course.mjs`。

### 章节可操作图解

八种图解与两段短分镜嵌入原正文，分别演示规则、上下文、暂停、重复计时器、版本、Skill、MCP 和 API。通过 `LearningIllustration` 按需加载，共用 `illustrations/useLabPlayback.ts` 控制生命周期；首页采用简洁的学习入口与活动列表。所有网络/版本操作均为模拟。验证脚本覆盖状态变化、故障/修复、拖拽替代、320 px 布局、暗色、减少动态效果、阅读进度与下载内容。

## 内容组件与维护检查

[组件写作指南](docs/about-us/maintenance/components.md) 提供可运行的网格、卡片、提示、步骤、配图、折叠、弹窗与轮播示例。所有 `Mag*` 组件无需 import。组件接口与模块职责见 [.vitepress/theme/README.md](.vitepress/theme/README.md)。

```bash
npm test
npm run typecheck
npm run build
```

浏览器检查：先 `npm run preview -- --port 4173`，再运行 `npm run check:components -- http://localhost:4173` 和 `npm run check:playback -- http://localhost:4173`。生产依赖以 `package-lock.json` 为准；Node 版本见 `.node-version`。
