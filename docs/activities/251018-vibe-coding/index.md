---
title: "Vibe Coding，与 AI 一起开发"
description: "探索AI辅助开发，用Qoder与AI一起编写代码，体验未来的编程方式！"
icon: "💻"
tags: [AI, 开发工具, 工作坊]
date: "2025-10-18"
sidebar: true
aside: false
articleOutline: true
outline: [2, 3]
prev: false
next: false
lastUpdated: false
editLink: false
pageClass: mag-article-page
---

<MagArticle :title="$frontmatter.title" :description="$frontmatter.description" :date="$frontmatter.date" issue="03" category="开发实战 · 2025" kind="活动讲义" author="JLU iOS Club" date-label="记录日期" :next="{ title: '零代码 AI Agent，日常记录小能手', href: '/activities/251102-AI-Agent/' }">

这份讲义保留了 2025 年 10 月 18 日工作坊的实战路线。从认识 Xcode 开始，使用 Qoder 辅助开发，再完成调试、网页部署与 API 接入。

<details class="article-contents">
<summary>阅读目录 · 9 节</summary>
<ol>
<li><a href="#活动概述">活动概述</a></li>
<li><a href="#part-1-认识xcode">Part 1: 认识Xcode</a></li>
<li><a href="#part-2-ai辅助开发实战">Part 2: AI辅助开发实战</a></li>
<li><a href="#part-3-调试与完善">Part 3: 调试与完善</a></li>
<li><a href="#part-4-静态网页开发与部署">Part 4: 静态网页开发与部署</a></li>
<li><a href="#part-5-api使用指南">Part 5: API使用指南</a></li>
<li><a href="#总结与思考">总结与思考</a></li>
<li><a href="#相关资源">相关资源</a></li>
<li><a href="#期待你的作品">期待你的作品！</a></li>
</ol>
</details>

<MagNote type="tip" title="继续学习 · 新的入门讲义">

这篇保留了 2025 年工作坊的内容。如果希望沿一个完整案例学习与 Agent 协作，可以接着读 [从想法到作品](/resources/ai-programming/)，试试里面的动态图与练习。

</MagNote>

<div class="article-facts">

**活动日期。** 2025年10月18日

**活动地点。** 南区计算机楼 B110苹果机房

**主要内容。** AI辅助开发实战

**适合人群。** 所有对编程感兴趣的同学

</div>

## 活动概述 {#活动概述}

欢迎来到 **Vibe Coding** 工作坊！在这个AI时代，编程的方式正在发生革命性的变化。本次活动将带你探索如何使用**Qoder**等AI辅助开发工具，让AI成为你的编程伙伴，大幅提升开发效率。

无论你是想开发iOS应用、搭建个人网站，还是创建有趣的小项目，AI都能帮助你快速实现想法。即使是零基础的同学，也能在AI的帮助下完成令人惊叹的作品！

:::tip 💡 你将学到什么？
- ✅ 如何使用Qoder进行AI辅助开发
- ✅ 认识Xcode及其项目结构
- ✅ 如何编写高效的AI提示词（Prompt）
- ✅ iOS应用开发基础流程
- ✅ 静态网页开发与部署
- ✅ API的使用与集成
:::

## Part 1: 认识Xcode

Xcode是苹果官方的集成开发环境（IDE），是iOS开发的核心工具。虽然我们主要使用Qoder进行开发，但了解Xcode的项目结构对于理解iOS开发至关重要。

### 创建你的第一个Xcode项目

#### 1. 打开Xcode并创建新项目

<MagFigure>
<img src="./shots/1.png" alt="Xcode启动界面" width="1472" height="906" loading="eager" decoding="async" />
</MagFigure>

打开Xcode后，你会看到一个简洁的欢迎界面。点击 **Create New Project** 开始创建你的第一个iOS项目。

#### 2. 选择项目模板

<MagFigure>
<img src="./shots/2.png" alt="选择App模板" width="1520" height="1090" loading="lazy" decoding="async" />
</MagFigure>

选择默认的 **App** 模板，这是最基础的iOS应用模板。

#### 3. 配置项目信息

<MagFigure>
<img src="./shots/3.png" alt="输入项目名称" width="1516" height="1082" loading="lazy" decoding="async" />
</MagFigure>

输入你的项目名称，这里演示使用 `test` 作为项目名。建议使用有意义的英文名称。

#### 4. 选择保存位置

<MagFigure>
<img src="./shots/4.png" alt="选择保存位置" width="1610" height="902" loading="lazy" decoding="async" />
</MagFigure>

选择一个合适的文件夹保存项目，也可以点击左下角的 **New Folder** 创建新文件夹。

### 理解Xcode项目结构

<MagFigure>
<img src="./shots/5.png" alt="Xcode项目界面" width="2784" height="1792" loading="lazy" decoding="async" />
</MagFigure>

创建完成后，你会看到Xcode的主界面，包含了许多文件和配置选项。现阶段我们不需要深入了解每个文件的作用，重点是理解项目的整体结构。

<MagNote>
<h3>重要发现：xcodeproj文件</h3>

<MagFigure>
<img src="./shots/6.png" alt="Finder中的项目文件" width="1828" height="858" loading="lazy" decoding="async" />
</MagFigure>

在Finder中打开项目文件夹，你会发现一个 `.xcodeproj` 文件。这个文件是什么呢？

<MagFigure>
<img src="./shots/8.png" alt="项目文件夹内容" width="1822" height="860" loading="lazy" decoding="async" />
</MagFigure>

**xcodeproj文件是Xcode项目的大脑**，它定义了：
- 项目中包含哪些源文件
- 资源文件的位置
- 使用的frameworks
- 编译配置
- 子项目关系

双击这个文件，就能打开Xcode并加载整个项目！
</MagNote>

:::tip 💡 快速定位文件
如果找不到保存的项目位置，按下 **Command + 空格** 打开聚焦搜索，直接搜索项目文件夹名即可！

<MagFigure>
<img src="./shots/7.png" alt="使用聚焦搜索" width="2426" height="1732" loading="lazy" decoding="async" />
</MagFigure>
:::

## Part 2: AI辅助开发实战

### 构思你的项目

在开始动手之前，我们需要明确想要创建什么。但作为初学者，我们可能不清楚需要哪些技术栈、开发流程是怎样的。这时候，**AI就是你最好的老师**！

<MagNote type="tip">
<h3>编写高效的Prompt模板</h3>

一个好的Prompt应该包含以下要素：

```text
你现在是[角色/身份]
+ 我现在想要做[目标]
+ 我的想法是[详细描述]
+ 限制条件：[约束]
+ 我需要你[具体要求]
```

**完整模板示例：**

```text
你是一个 [角色/身份]。
你的任务是 [要完成的目标或任务]。

以下是我提供的信息或材料：
[输入内容，例如文本、数据、问题描述等]

请你：
1. [具体要求1]
2. [具体要求2]
3. [具体要求3]

输出时请遵循以下格式/风格：
[输出格式或风格说明]

限制条件：
- [比如：语言简洁、字数不超过××]
- [风格、受众定位等]
```
</MagNote>

:::info 🎓 深入学习Prompt工程
想要系统学习Prompt编写技巧？推荐观看吴恩达的提示词工程教程：
[【吴恩达】2025年公认最好的【提示词工程】教程](https://www.bilibili.com/video/BV1173jzNELG/)
:::

### 使用Qoder开始开发

#### 1. 打开Qoder并创建项目

<MagFigure>
<img src="./shots/10.png" alt="Qoder启动界面" width="2384" height="1594" loading="lazy" decoding="async" />
</MagFigure>

打开Qoder，选择 **打开项目**，选择一个文件夹作为项目存储位置（建议使用英文命名）。

#### 2. 信任作者

<MagFigure>
<img src="./shots/11.png" alt="信任此作者" width="2378" height="1584" loading="lazy" decoding="async" />
</MagFigure>

首次打开时，选择 **信任此作者** 以启用完整功能。

#### 3. 了解Qoder工作区

<MagFigure>
<img src="./shots/12.png" alt="Qoder工作区" width="2378" height="1592" loading="lazy" decoding="async" />
</MagFigure>

Qoder的界面分为三个主要区域：
- **左侧**：文件资源管理器
- **中间**：代码预览区域
- **右侧**：AI对话框

:::tip ⚡ 提升效率小技巧
厌倦了每次都要手动点击确认？

<MagFigure>
<img src="./shots/13.png" alt="Qoder设置" width="360" height="514" loading="lazy" decoding="async" />
</MagFigure>

点击右上角用户头像 → **Qoder设置** → **智能会话** → 将终端和Web工具改为 **自动执行**，让AI帮你自动处理！
:::

#### 4. 输入Prompt开始创建

将你精心准备的Prompt粘贴到对话框中，按Enter发送。接下来，就是见证奇迹的时刻——AI会为你自动生成完整的项目代码！

**示例：创建俄罗斯方块游戏的完整Prompt**

```text
请生成一个完整、可编译的 Xcode iOS/iPadOS（Universal）项目，名为 "TetraPlay"（俄罗斯方块小游戏）。要求如下：

总体与技术栈：
- 使用 Swift 5.9+，Xcode 15+。
- 游戏渲染使用 SpriteKit，主 UI 使用 SwiftUI + 一个承载 SKView 的桥接（或 SwiftUI 的 SpriteKit 支持）。
- 项目应是一个标准 Xcode 项目（.xcodeproj），包含 app target 与 tests target。

核心功能（必做）：
1. 基本俄罗斯方块玩法：
   - 七种标准 Tetrimino（I, O, T, S, Z, J, L），包含旋转与边界检测（SRS 或简化旋转规则均可，但请注明）。
   - 方块自动下落、软降（按住向下增速）、硬降（快速到底）。
   - 左右移动、旋转（顺/逆时针可选），碰撞检测。
   - 检测并消除满行、更新分数并显示行数与等级（level）。
   - 下一块预览（至少显示下 1 个方块）。

2. 控制方法：
   - 触摸控制：左右滑或点击移动，轻扫下落，顶部/右侧按钮用于旋转（请实现触控友好方案）。
   - 键盘支持（在 iPad 上）：左右箭头、上键/空格旋转或硬降、下键软降。
   - 手柄支持（GCController）：左右/按钮映射移动/旋转/下落/暂停。

3. UI：
   - 主菜单（开始、继续、设置、排行榜/最高分）、暂停面板、游戏结束画面。
   - HUD 显示当前分数、最高分、当前等级、下一块。
   - 设置面板（音量开关、振动开关、控制模式选择：触摸/滑动/按钮）。

4. 持久化：
   - 使用 UserDefaults 保存最高分、设置项。
   - README 中注明如何启用 Game Center 排行榜（可选，若实现则加注释说明）。

5. 音效与资源：
   - 提供示例音效（或占位文件）和占位美术资源（Assets.xcassets）。
   - AudioManager 封装播放背景音乐和音效（开启/关闭开关）。

6. 测试：
   - 包含至少 3 个 Unit Test：行消除（Board 的消行函数）、得分计算、方块旋转与边界检测。
   - 测试应使用 XCTest 并能通过 `xcodebuild test` 运行。

工程质量与交付：
- 代码风格清晰、模块化，包含注释与文档注释（重要函数、旋转规则、得分公式）。
- 包含 README.md，写明：运行方法、Xcode 版本、iOS / iPadOS 目标、常用快捷键、项目结构说明、如何运行测试。
- 提供简单的 Git 仓库结构（.gitignore），可选提供 GitHub Actions CI 配置（macos-latest，xcode 15，运行 build & test）。

额外说明（可选实现但需标注）：
- 可选：Game Center 排行榜与成就。
- 可选：iCloud 同步最高分（若实现请说明所用 API）。
- 可选：多语言 (en/zh) 本地化支持（若实现请一并生成 Localizable.strings）。

交付格式：
- 请直接生成完整 Xcode 项目文件与源码（可在 zip 中）。  
- 在 README 里列出"如何在本地编译并运行"的命令（例如：`open TetraPlay.xcodeproj`，然后在 Xcode 选择 target，或使用 `xcodebuild -scheme TetraPlay -destination 'platform=iOS Simulator,name=iPhone 15 Pro,OS=17.5' build`）。
- 在 README 里列出"验收测试步骤"。例如：
  1. 在 iPhone Simulator 运行并验证触摸控制。
  2. 在 iPad Simulator 使用键盘操作验证键盘映射。
  3. 运行 `xcodebuild test` 并确保所有测试通过。

请在实现前先生成一个简短的开发说明（≤ 200 字），说明核心实现思路（例如：方块表示、旋转规则、碰撞检测、渲染更新节奏），接着开始生成代码文件。谢谢。
```

## Part 3: 调试与完善

AI虽然强大，但生成的代码可能存在一些问题。这时候就需要我们进行调试和优化。

### 构建项目

当AI完成代码生成后，直接告诉它：

```text
请你帮我构建这个项目，直到项目构建成功。
```

AI会自动进行编译并修复可能出现的错误。

### 使用Xcode进行微调

有些视觉效果和交互细节，我们可以在Xcode中进行精细调整。

<MagFigure>
<img src="./shots/14.png" alt="发现问题" width="870" height="1878" loading="lazy" decoding="async" />
</MagFigure>

比如发现了一些UI布局问题：文字位置偏移、大小不合适、颜色不喜欢等。

#### 1. 定位问题代码

<MagFigure>
<img src="./shots/15.png" alt="查找ContentView" width="2256" height="1754" loading="lazy" decoding="async" />
</MagFigure>

打开主文件，找到 `ContentView()`，右键选择 **Jump to Definition** 跳转到定义位置。

#### 2. 使用实时预览

<MagFigure>
<img src="./shots/17.png" alt="Xcode界面布局" width="2794" height="1784" loading="lazy" decoding="async" />
</MagFigure>

Xcode的界面分为四个区域：
- **左侧**：文件资源管理器
- **中间**：代码编辑器
- **右侧中**：实时预览
- **右侧右**：属性面板

<MagFigure>
<img src="./shots/18.png" alt="实时预览" width="912" height="1356" loading="lazy" decoding="async" />
</MagFigure>

点击重试按钮启动实时预览，可以实时看到UI效果。

#### 3. 使用选择工具定位组件

左下角有三个工具按钮：
1. **交互模式**：直接与UI交互
2. **选择模式**：点击组件查看对应代码
3. **更多选项**

使用选择模式点击有问题的UI元素，代码编辑器会自动高亮对应代码。

<MagFigure>
<img src="./shots/23.png" alt="调整属性" width="520" height="896" loading="lazy" decoding="async" />
</MagFigure>

在右侧属性面板中可以直接调整大小、颜色、字体等属性，代码会自动更新！

<MagNote>
<h3>Xcode界面微调教程</h3>

以下是完整的SwiftUI界面调整方法和示例，让你轻松掌握Xcode的界面微调技巧。

#### 1. 控件的基本组成：View + 修饰符 {#🟢-1-控件的基本组成-view-修饰符}

SwiftUI 里的界面控件都以 `View` 为单位，例如：

```swift
Text("分数")
```

这是一个文字控件。在 SwiftUI 里，我们不会去拖"按钮"或"文本框"，而是直接用代码堆积"积木"，每个积木都有外观修饰语句，叫做 **修饰符（Modifier）**。

例如：

```swift
Text("分数")
    .font(.system(size: 14, weight: .medium)) // 字体大小 + 粗细
    .foregroundColor(.white)                  // 字体颜色
```

#### 2. 修改字体大小与粗细 {#🔠-2-修改字体大小与粗细}

Xcode 中修改字体有三种常见方法：

| 写法 | 效果 |
|------|------|
| `.font(.title)` | 使用系统预设的大号标题 |
| `.font(.system(size: 20))` | 手动设置字体大小 |
| `.font(.system(size: 20, weight: .bold))` | 同时设置字体粗细（bold / medium / light） |

举例：

```swift
Text("分数")
    .font(.system(size: 14, weight: .medium))
```

#### 3. 设置文字或图形颜色 {#🎨-3-设置文字或图形颜色}

使用 `.foregroundColor()` 或 `.fill()`：

```swift
Text("分数")
    .foregroundColor(.white)

Rectangle()
    .fill(Color.blue)
```

如果希望颜色透明一点，可以加 `.opacity(0.5)`：

```swift
Color.blue.opacity(0.5)
```

#### 4. 设置背景色和圆角 {#🟧-4-设置背景色和圆角}

任何 View 都可以加背景：

```swift
Text("继续游戏")
    .padding()
    .background(Color.blue)      // 背景颜色
    .foregroundColor(.white)     // 前景色（文字颜色）
    .cornerRadius(10)            // 圆角
```

也可以用 `RoundedRectangle` 更精细控制：

```swift
RoundedRectangle(cornerRadius: 10)
    .fill(Color.black.opacity(0.6))
```

#### 5. 设置控件的大小与位置 {#📏-5-设置控件的大小与位置}

##### （1）固定尺寸：

```swift
.frame(width: 100, height: 50)
```

##### （2）相对布局（固定比例）：

使用 `GeometryReader` 可以获取屏幕的宽高，然后根据比例设置大小：

```swift
GeometryReader { geometry in
    let width = geometry.size.width * 0.5 // 宽度占屏幕一半
    Rectangle()
        .frame(width: width, height: width)
}
```

##### （3）用坐标（x, y）指定位置：

```swift
.position(x: 100, y: 200)
```

:::warning 📍 注意
坐标是相对于父容器左上角计算的。例如 `.position(x: 100, y: 200)` 表示距离左边 100 像素、上边 200 像素的位置。

在俄罗斯方块项目的 `NextTetriminoView` 中就是这么用的：

```swift
.position(
    x: centerOffset + CGFloat(position.x) * blockSize,
    y: centerOffset - CGFloat(position.y) * blockSize
)
```

这代表每个俄罗斯方块小格子的位置是通过计算出来的。
:::

#### 6. 布局容器：VStack / HStack / ZStack {#💠-6-布局容器-vstack-hstack-zstack}

SwiftUI 通过"堆叠"控件来决定排版：

- `VStack { ... }`：竖着排
- `HStack { ... }`：横着排
- `ZStack { ... }`：叠放（上下一层层堆）

示例：

```swift
ZStack {
    Color.black                // 最底层背景
    VStack {
        Text("分数")
        Text("1000")
    }
}
```

这表示有一个黑色背景，然后在上面放了两行文字。

#### 7. 在 Xcode 预览中实时调整 {#📱-7-在-xcode-预览中实时调整}

在 Xcode 右上角点击 **Canvas（画布）**，你会看到代码右侧出现"实时预览"。任何修改（字体、颜色、位置）都会立即更新。

例如：

```swift
#Preview {
    GameView(gameManager: GameManager())
}
```

如果你想改颜色或字体，只需要改代码，右边的预览马上变化。

#### 8. 常用控件与修饰符速查表 {#🧭-8-常用控件与修饰符速查表}

| 功能 | 修饰符 | 示例 |
|------|--------|------|
| 字体大小 | `.font(.system(size:))` | `.font(.system(size:18))` |
| 字体粗细 | `.fontWeight(.bold)` | `.fontWeight(.semibold)` |
| 字体颜色 | `.foregroundColor()` | `.foregroundColor(.white)` |
| 背景颜色 | `.background()` | `.background(Color.blue)` |
| 圆角 | `.cornerRadius()` | `.cornerRadius(10)` |
| 宽高 | `.frame(width:height:)` | `.frame(width:100,height:50)` |
| 透明度 | `.opacity()` | `.opacity(0.5)` |
| 位置 | `.position(x:y:)` | `.position(x:150,y:200)` |
| 内边距 | `.padding()` | `.padding(10)` |
| 边框 | `.border(Color,width:)` | `.border(.white,width:2)` |

</MagNote>

## Part 4: 静态网页开发与部署

除了iOS开发，我们还可以创建静态网页项目。这对于不熟悉Mac或想要快速搭建个人主页的同学特别友好！

<div class="article-facts">

**项目一：个人主页。**

<p>创建一个炫酷的个人主页，展示你的作品集、技能和联系方式。</p>
<p><strong>技术栈：</strong>HTML + CSS + JavaScript</p>
<p><strong>部署平台：</strong>GitHub Pages（免费！）</p>

**项目二：AI Quiz。**

<p>基于AI的智能问答系统，可以上传PDF/PPT自动生成测验题目。</p>
<p><strong>技术栈：</strong>Next.js + TypeScript + AI API</p>
<p><strong>特色：</strong>集成智谱AI API</p>

</div>

### 使用GitHub Pages部署网站

#### 1. 创建GitHub仓库

<MagFigure>
<img src="./shots/24.png" alt="GitHub新建仓库" width="2620" height="1264" loading="lazy" decoding="async" />
</MagFigure>

登录GitHub，点击 **new** 创建新仓库。

<MagFigure>
<img src="./shots/25.png" alt="配置仓库" width="2134" height="1552" loading="lazy" decoding="async" />
</MagFigure>

输入仓库名称，点击 **Create repository** 创建。

#### 2. 上传项目文件

<MagFigure>
<img src="./shots/26.png" alt="上传文件选项" width="2554" height="1508" loading="lazy" decoding="async" />
</MagFigure>

点击 **uploading an existing file** 上传现有文件。

<MagFigure>
<img src="./shots/29.png" alt="拖拽上传" width="2488" height="1270" loading="lazy" decoding="async" />
</MagFigure>

将项目文件拖入上传区域。**重要：确保包含 `index.html` 文件！**

<MagFigure>
<img src="./shots/30.png" alt="上传示例" width="1810" height="810" loading="lazy" decoding="async" />
</MagFigure>

:::warning ⚠️ 必须包含的文件
- `index.html` - 网站入口文件（**必须**）
- `README.md` - 项目说明（推荐）
- 其他CSS、JS、图片等资源文件
:::

#### 3. 配置GitHub Pages

<MagFigure>
<img src="./shots/32.png" alt="进入Settings" width="2568" height="1704" loading="lazy" decoding="async" />
</MagFigure>

上传完成后，点击 **Settings** 进入设置页面。

<MagFigure>
<img src="./shots/33.png" alt="配置Pages" width="2598" height="1730" loading="lazy" decoding="async" />
</MagFigure>

在左侧菜单找到 **Pages**，选择 **GitHub Actions** 作为部署方式。

<MagFigure>
<img src="./shots/34.png" alt="选择Static HTML" width="2612" height="1548" loading="lazy" decoding="async" />
</MagFigure>

选择 **Static HTML** 模板，点击 **Configure**。

<MagFigure>
<img src="./shots/35.png" alt="提交配置" width="2612" height="1744" loading="lazy" decoding="async" />
</MagFigure>

直接点击 **Commit changes** 保存配置。

#### 4. 访问你的网站

<MagFigure>
<img src="./shots/37.png" alt="网站已部署" width="2510" height="1578" loading="lazy" decoding="async" />
</MagFigure>

等待几分钟后，你的网站就部署成功了！点击 **Visit site** 访问，分享给朋友吧！🎉

## Part 5: API使用指南

对于AI Quiz等需要调用AI服务的项目，我们需要获取API密钥。这里以智谱AI为例。

### 获取智谱AI API密钥

#### 1. 注册并登录

访问 [智谱AI开放平台](https://open.bigmodel.cn)，注册并登录账号。

<MagFigure>
<img src="./shots/38.png" alt="进入API Key页面" width="446" height="686" loading="lazy" decoding="async" />
</MagFigure>

鼠标移动到右上角头像，选择 **API Key**。

#### 2. 创建API Key

<MagFigure>
<img src="./shots/39.png" alt="API Key管理" width="2582" height="898" loading="lazy" decoding="async" />
</MagFigure>

点击 **添加新的API Key**，给密钥取个名字，然后复制生成的API Key。

#### 3. 查看API文档

<MagFigure>
<img src="./shots/39.png" alt="API文档" width="2582" height="898" loading="lazy" decoding="async" />
</MagFigure>

在主页的 **开发者** 部分可以找到详细的API调用文档。

:::tip 💡 让AI帮你调用API
你不需要自己编写API调用代码！只需要：
1. 将API密钥提供给AI
2. 告诉AI你想实现什么功能
3. AI会自动生成完整的API调用代码

<MagFigure>
<img src="./shots/40.png" alt="告诉AI使用API" width="2626" height="1660" loading="lazy" decoding="async" />
</MagFigure>
:::

### AI Quiz项目完整Prompt示例

以下是创建AI Quiz项目的完整prompt，你可以直接复制使用：

```text
系统角色说明（给 Qoder 的指令）：

你是负责实现「基于上传的 PDF/PPT 自动生成测验(Quiz)」功能的后端/逻辑组件。请严格按下列规范工作 —— 所有题目与答案**必须**以用户上传的文件内容为准，不得加入文件外的假设或通用常识。生成的项目需包含前端 (Next.js App Router + TypeScript + Tailwind) 与后端 API 路由（Next.js route handlers），并可直接运行。

***项目必须同时生成一个 run.sh 脚本，用户在 macOS 上执行 `chmod +x run.sh && ./run.sh` 即可安装依赖并启动开发服务器。***

---

## 智谱 API (Zhipu) 配置（已为你填入 Key）
在生成的 `.env.local` 中请包含以下内容（Qoder 代为生成）：

ZHIPU_API_KEY=你的API密钥
ZHIPU_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions

> 如果你希望不把 key 明文放在仓库，请在生产说明中写明如何通过环境变量注入（例如 CI / Docker secrets）。

---

## 功能要点（必实现）

1. 文件解析：
   - 接收用户上传的 PDF/PPT（多页、多幻灯片）。
   - 将文件切分为页/幻灯片单元，提取每页纯文本及文字位置信息（用于前端高亮/预览）。对扫描件执行 OCR，并返回 `is_ocr` 与 `ocr_confidence`。
   - 若某页解析失败，返回 `parse_error` 并列出失败页码与错误原因，前端显示可重试提示。

2. 题目生成：
   - 可按指定页范围或整份文件生成题目。
   - 题型：多项选择题（MCQ）与开放式问答题（Short/Long answer）。
   - 可配置题量与难度（例如 5/10/20，simple/medium/hard），可配置 MCQ 比例。
   - 每题必须返回：题干、题型、（MCQ）选项列表（≥3）、正确答案（选项 key）、正确答案的**精确摘录**（来自文件）、答案页码、页内字符起止位置或坐标、用于高亮的短片段（≤200 字）。

3. 答题反馈（选择题）：
   - 用户答题后即时返回 `is_correct`。
   - 若错误：返回 `correct`、基于文件的 AI 解析（逐句/逐点说明并引用文件句子或段落）、以及"定位信息"（页码 + 用于高亮的文本片段，包含前后 30–80 字）。
   - 返回 `preview_html` 或 `preview_text` 字段用于前端高亮展示。

4. 问答题处理：
   - 后端不自动判分（除非选择人工审核或特殊配置），用户提交后显示"参考答案"。
   - 参考答案必须为文件摘录或严格基于文件的摘要，并标注页码与片段。
   - 若问题在文件中对应多个相关段落，返回所有段落与页码。

5. 可审核与可溯源：
   - 每题和每条解析都必须包含溯源字段：`page`, `char_start`, `char_end`, `snippet`（≤200 字），方便管理员核对与编辑。

6. 安全与边界：
   - 对 OCR 置信度低的页标注 `ocr_low_confidence` 并建议人工校验。
   - 若源信息不足以生成唯一正确答案，响应 `insufficient_source`，切勿编造答案。

---

## API/路由与数据契约（Qoder 请按此实现）

### 1) `/api/upload` （前端 -> 后端 文件上传，后端负责解析/OCR）
Request: multipart/form-data 包含文件与选项
Response:
{
  "status":"ok",
  "pages":[
    {"page":1,"text":"...","text_snippets":[{"start":100,"end":180,"text":"..."}],"is_ocr":false},
    {"page":2,"parse_error": "图片解析失败或OCR低置信度", "is_ocr": true, "ocr_confidence": 0.62}
  ]
}

### 2) `/api/generate` （前端 -> 后端 -> 智谱 API ）

Request:
{
  "pages":[1,2,3],
  "num_questions":10,
  "mcq_ratio":0.6,
  "difficulty":"medium",
  "format":"strict_source_based"
}

后端实现须：
- 将被请求页的纯文本（含每段字符索引）传入智谱模型输入，并在 system/user 指令中**严格限定"仅可使用所提供文本作为知识源"**。
- 要求智谱返回 JSON 严格按照指定模式。

### 3) `/api/verify` （前端 -> 后端，用于 MCQ 即时判分）

Request:
{ "question_id":"q_001", "selected":"A", "user_id":"stu_123" }

Response:
{
  "is_correct": false,
  "correct":"B",
  "explanation":"引用页5，句子：\"...\"，说明为什么B对A错",
  "source":{"page":5,"snippet":"...", "char_start":..., "char_end":...}
}

---

## 错误码与边界返回（后端必实现）

- `insufficient_source` — 指定页信息不足以生成唯一答案
- `parse_error` — 智谱返回无法解析或后端 JSON 解析失败
- `ocr_low_confidence` — OCR 置信度低，需人工校验
- `quota_exceeded` — 智谱/网络调用返回配额错误

---

## 前端 UI 建议（Qoder 请生成页面）

- `/` 上传页面：文件缩略预览、OCR 标识、选择页码范围、题量、难度、MCQ 比例、生成按钮
- `/quiz` 题目页：显示题目列表，MCQ 选择后即时显示结果与解析折叠面板（包含"查看原文"高亮功能）；问答题提交后显示参考答案卡片
- 审核模式页面：管理员可以查看每题的原文引用并编辑修正题干/选项

---

## run.sh 要求（Qoder 必须生成）

生成一个 `run.sh`，内容如下（在项目根）：

#!/bin/bash
set -e
echo "🚀 Installing dependencies..."
npm install
echo "✅ Dependencies installed."
echo "🔁 Building..."
npm run build || true
echo "🌐 Starting Next.js dev server..."
npm run dev

并在生成说明里写明：
- 运行前请执行 `chmod +x run.sh`
- 或者直接：`bash run.sh`

---

## 输出要求（Qoder 返回给我）

1. 项目文件树（主要文件与目录）
2. 主要文件代码（至少包含：`app/page.tsx`, `app/quiz/page.tsx`, `app/api/upload/route.ts`, `app/api/generate/route.ts`, `app/api/verify/route.ts`, `run.sh`, `.env.local` 样例）
3. 运行说明（如何启动、如何替换 Key、如何切换模型名）
4. 简短的调试建议（如何查看智谱返回的原始响应、如何在本地 mock 智谱返回用于调试）

---

## 其他实现细节（给后端/工程师的提示）

- 给智谱的请求尽量把 `temperature: 0.0`，并强制要求 JSON 输出，以便保证可重复性与易解析性。
- 对于长文档，采用"检索 + 片段摘要 + 题目生成"流程：先检索最相关段落，再让智谱基于这些段落生成题目并返回引用。
- 所有返回必须包含字符级位置或坐标，便于前端精确高亮。
- 对智谱返回做严格的 JSON schema 校验；若不合法返回 `parse_error` 并记录原始响应以备审计。

---

请基于以上完整 prompt 为我生成项目骨架与文件内容（Qoder 执行端）。谢谢。
```

### AI Quiz项目特别说明

这个项目需要本地服务器运行，建议让Qoder生成启动脚本：

```text
请为这个项目生成一个 run.sh 启动脚本，
并告诉我如何在 macOS/Windows 上运行这个项目。
```

<MagNote>
<h3>安装Node.js (macOS)</h3>

如果你的电脑还没有安装Node.js，可以使用以下命令安装：

```bash
# 安装Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 配置Homebrew环境
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# 安装Node.js
brew install node

# 验证安装
node -v
npm -v
```

当看到版本号输出时，说明安装成功！
</MagNote>

<MagNote>
<h3>安装Node.js (Windows)</h3>

Windows用户推荐直接下载安装包：

1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载 **LTS版本** 的 `.msi` 安装包
3. 运行安装向导（确保勾选 `Add to PATH`）
4. 打开PowerShell验证安装：

```powershell
node -v
npm -v
```
</MagNote>

## 总结与思考

<MagNote type="tip">
<h3>AI能否完全替代程序员？</h3>

通过这次活动，你可能会产生一个疑问：既然AI这么强大，我们还需要学习编程吗？

**答案是：AI是工具，不是替代品。**

AI确实能够：
- ✅ 快速生成基础代码
- ✅ 帮助理解技术文档
- ✅ 提供实现思路和建议
- ✅ 加速开发流程

但AI目前还无法：
- ❌ 理解复杂的业务逻辑
- ❌ 进行创新性的架构设计
- ❌ 保证代码的最优性和安全性
- ❌ 完全按照你的审美偏好设计UI

**AI是你的助手，而不是你的老板。** 你需要：
- 📚 掌握基础的编程知识，才能判断AI生成的代码是否正确
- 🎨 具备设计思维，才能指导AI创造出符合需求的作品
- 🔍 培养问题分析能力，才能提出准确的需求
- 💡 保持创新精神，AI只能辅助，创意来源于你
</MagNote>

<MagNote>
<h3>下一步学习建议</h3>

**如果你对iOS开发感兴趣：**
- 学习Swift语言基础
- 掌握SwiftUI框架
- 了解iOS人机界面设计规范
- 参加移动应用创新赛（MAIC）

**如果你对Web开发感兴趣：**
- 学习HTML/CSS/JavaScript基础
- 尝试React、Vue等现代框架
- 了解API调用与后端交互
- 部署更多个人项目

**如果你对AI应用感兴趣：**
- 学习Prompt工程技巧
- 了解常见AI模型的能力边界
- 尝试集成多种AI服务
- 探索AI在不同领域的应用

记住：**AI是放大器，它会放大你的能力。** 你懂得越多，AI能帮你实现的就越多！
</MagNote>

## 相关资源

<div class="article-facts">

**学习资源。** <a href="/resources/">查看完整学习资源库</a>

**竞赛信息。** <a href="/competitions/">了解MAIC等竞赛</a>

**加入我们。** <a href="/join-us/">成为iOS Club成员</a>

**问题求助。** <a href="/join-us/#成为普通社员">加入社团群</a>

</div>

## 期待你的作品！

<p style="margin-top: 1rem; font-size: 1rem;">有任何问题？欢迎在活动群或社团群内讨论～</p>

</MagArticle>
