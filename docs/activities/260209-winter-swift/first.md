---
title: "冬季 Swift 培训 · 第一讲：SwiftUI 入门与 CodeBreaker 基础界面"
description: "第一讲讲义：SwiftUI 结构、布局、修饰符、ForEach 与 enum 状态建模。"
date: 2026.02.09
outline: [2, 3]
---


<MagHero title="SwiftUI 入门讲义 · CodeBreaker UI 从 0 到 1" />

<MagGrid :cols="4">
  <MagCard>
    <span class="mag-icon">🧭</span>
    <h3>学习目标</h3>
    <p>理解 SwiftUI 的声明式与状态驱动模型</p>
  </MagCard>
  <MagCard>
    <span class="mag-icon">🧱</span>
    <h3>核心能力</h3>
    <p>布局容器、修饰符顺序、组件封装、枚举建模</p>
  </MagCard>
  <MagCard>
    <span class="mag-icon">🧪</span>
    <h3>实践方式</h3>
    <p>以 CodeBreaker UI 为主线，边讲边改边预览</p>
  </MagCard>
  <MagCard>
    <span class="mag-icon">📱</span>
    <h3>适配要求</h3>
    <p>iPhone 运行正常，Light / Dark Mode 都可读</p>
  </MagCard>
</MagGrid>

<MagNote type="tip">
  <strong>阅读建议：</strong> 按章节顺序走一遍，并在 Xcode 同步跟敲。每一节里都给了最小可运行写法。
  <br />
  <strong>项目 GitHub：</strong>
  <a href="https://github.com/Hean-Yi/CodeBreaker.git" target="_blank" rel="noreferrer">https://github.com/Hean-Yi/CodeBreaker.git</a>
</MagNote>

## 目录

1. Swift 与 SwiftUI 的一句话理解  
2. Xcode 三大区域：左中右怎么用  
3. SwiftUI 核心结构：App / Scene / View / struct / protocol  
4. 布局容器：VStack / HStack / ZStack  
5. modifier 修饰符：顺序为何会改变结果  
6. CodeBreaker 页面拆解  
7. 数据与珠子视图：let/var 与可扩展 Pegs  
8. ForEach：循环与 id 的坑  
9. MatchPegs：黑钉/白钉/空 + 深色模式  
10. enum：让状态表达更清楚  
11. 常见错误清单  
12. 任务与挑战  
13. 实现约束

## 1) Swift 与 SwiftUI 的一句话理解

<MagStep>
  <p><strong>Swift</strong> 是现代多范式语言，支持面向对象、面向协议和函数式特性。</p>
  <p><strong>SwiftUI</strong> 是声明式、状态驱动的 UI 框架。你描述“当前状态下界面应该是什么样”，状态变了，界面自动同步刷新。</p>
  <p>直观对比：UIKit 更像手工搬砖，SwiftUI 更像配置目标效果。</p>
</MagStep>


## 2) Xcode 三大区域：左中右怎么用


<MagStep>
  <ul>
    <li><strong>左侧 Project Navigator：</strong> 文件与资源管理，如 `Assets.xcassets` 与 Swift 文件。</li>
    <li><strong>中间 Editor：</strong> 代码编辑与报错定位。</li>
    <li><strong>右侧 Canvas Preview：</strong> 实时预览 UI，学习阶段建议常开。</li>
  </ul>
</MagStep>


## 3) SwiftUI 核心结构：App / Scene / View / struct / protocol


<MagStep n="1" title="从入口到视图：先理解“层级关系”">
  <p>`@main` 声明应用入口，`App` 提供 `Scene`，`Scene` 承载页面，页面由 `View` 组成，通常以 `struct` 实现。</p>
  <MagFigure caption="图 1：App / Scene / View / Struct 的层级和职责。">
    <img src="./imgs/2.png" alt="App Scene View Struct 层级关系" />
  </MagFigure>
  <p>关键理解：`some View` / `some Scene` 是不透明返回类型。你返回的是具体类型，但对外隐藏类型细节。</p>
</MagStep>


## 4) 布局容器：VStack / HStack / ZStack


<MagStep n="2" title="容器决定方向，修饰符决定观感">
  <ul>
    <li>`VStack`：从上到下排。</li>
    <li>`HStack`：从左到右排。</li>
    <li>`ZStack`：前后叠放，后写的盖在前面。</li>
  </ul>
  <MagFigure caption="图 2：容器三兄弟对应三种排布模型。">
    <img src="./imgs/3.png" alt="VStack HStack ZStack 三种容器" />
  </MagFigure>
</MagStep>


## 5) modifier 修饰符：顺序为何会改变结果


<MagStep n="3" title="修饰符是“逐层包裹”，不是独立开关">
  <p>同一组修饰符，顺序不同，最终渲染不同。最常见是 `padding` 与 `background`。</p>
  <MagFigure caption="图 3：`padding` 与 `background` 顺序变化会改变背景覆盖范围。">
    <img src="./imgs/4.png" alt="修饰符顺序影响显示范围" />
  </MagFigure>
  <p>进阶组合也一样：`clipShape`、`shadow`、`frame`、`onTapGesture` 的先后会影响视觉与交互命中范围。</p>
  <MagFigure caption="图 4：修饰器链路会影响阴影是否可见、点击区域是否正确。">
    <img src="./imgs/5.png" alt="修饰符组合常见陷阱" />
  </MagFigure>
</MagStep>


## 6) CodeBreaker 页面拆解


<MagStep>
  <p>本次课堂先实现基础版 UI，可拆成两块：</p>
  <ul>
    <li>一排猜测珠子（Pegs Row）。</li>
    <li>一组反馈钉子（MatchPegs，2x2 布局）。</li>
  </ul>
</MagStep>


## 7) 数据与珠子视图：let/var 与可扩展 Pegs


<MagStep n="4" title="变量语义：优先 let，必要时再 var">
  <p>不变数据优先 `let`，变化数据再用 `var`。这会直接减少状态错误和误改。</p>
  <MagFigure caption="图 5：常量与变量职责分离，有助于代码稳定性。">
    <img src="./imgs/1.png" alt="let 与 var 区别" />
  </MagFigure>
  <p>珠子行建议写成可扩展函数或组件，支持 3~6 个甚至更多：</p>

```swift
func pegsView(colors: [Color]) -> some View {
    HStack {
        ForEach(colors.indices, id: \.self) { index in
            RoundedRectangle(cornerRadius: 10)
                .foregroundStyle(colors[index])
                .aspectRatio(1, contentMode: .fit)
        }
    }
}
```
</MagStep>


## 8) ForEach：循环与 id 的坑


<MagStep n="5" title="重复元素不要直接用 `id: \.self`">
  <p>当数组内元素可能重复（例如两个相同颜色），`id: \.self` 可能导致身份冲突。更稳妥的是用下标或 `Identifiable`。</p>
  <MagFigure caption="图 6：ForEach 的核心不是“循环”，而是“稳定身份识别”。">
    <img src="./imgs/6.png" alt="ForEach 与 id 的坑" />
  </MagFigure>
</MagStep>


## 9) MatchPegs：黑钉/白钉/空 + 深色模式


<MagStep>
  <ul>
    <li>`exact`：黑钉（颜色对、位置对）。</li>
    <li>`inexact`：白钉（颜色对、位置错）。</li>
    <li>`noMatch`：空钉（透明占位，保留布局）。</li>
  </ul>
  <p>配色建议使用语义色（如 `.primary`），让 Light / Dark 自动适配，避免手写颜色在深色模式失真。</p>
</MagStep>


## 10) enum：让状态表达更清楚


<MagStep n="6" title="不要用魔法数字表达状态">
  <p>用 `enum` 明确状态语义，`switch` 分发行为，可读性和可维护性都更高。</p>
  <MagFigure caption="图 7：枚举能把“看不懂的数字状态”升级为“可读的业务状态”。">
    <img src="./imgs/7.png" alt="Enum 管理状态" />
  </MagFigure>

```swift
enum Match {
    case exact
    case inexact
    case noMatch
}
```
</MagStep>


## 11) 常见错误清单


<MagStep>
  <ol>
    <li>返回视图的函数请写 `-> some View`，不要写 `-> View`。</li>
    <li>统计计数通常用 `filter { ... }.count`。</li>
    <li>ForEach 的 `id` 要稳定，不要盲目 `\.self`。</li>
    <li>深色模式尽量使用语义色（`.primary`、`.secondary`）。</li>
  </ol>
</MagStep>


## 12) 任务与挑战


<MagGrid :cols="2">
  <MagCard>
    <h3>任务 1-3（基础必做）</h3>
    <ul>
      <li>完成 CodeBreaker UI 原型：Pegs + MatchMarkers。</li>
      <li>做原生场景 Preview：dummy pegs + MatchMarkers 组合预览。</li>
      <li>让 MatchMarkers 支持 3~6 个结果，不写死 4 个。</li>
    </ul>
  </MagCard>
  <MagCard>
    <h3>任务 4-6（验证完整性）</h3>
    <ul>
      <li>Preview 覆盖 3/4/5/6 以及混合状态组合。</li>
      <li>dummy pegs 数量需与 matches 数量一致。</li>
      <li>Light / Dark 都要验证可读性与边界表现。</li>
    </ul>
  </MagCard>
  <MagCard>
    <h3>挑战 1-2（组件化）</h3>
    <ul>
      <li>`PegsRow` 与 `MatchMarkers` 组件化，外部只传数据。</li>
      <li>peg 数量参数化（3~6），Preview 里做参数扫描。</li>
    </ul>
  </MagCard>
  <MagCard>
    <h3>挑战 3-4（工程化 + 视觉）</h3>
    <ul>
      <li>做异常输入保护（截断/断言/可读 debug 信息）。</li>
      <li>尝试 Material 拟态玻璃效果并保持深浅色可读。</li>
    </ul>
  </MagCard>
</MagGrid>


## 13) 实现约束


<MagNote>
  <ul>
    <li>状态表达：`enum Match { case exact, inexact, noMatch }`。</li>
    <li>ForEach：提供稳定 id（下标或 `Identifiable`）。</li>
    <li>允许在 View 里用 `if` 分支处理显示逻辑（`@ViewBuilder` 语义下）。</li>
    <li>项目里至少体现一次“修饰符顺序影响结果”的正确实践。</li>
  </ul>
</MagNote>

<MagHero title="这节课真正要带走的能力" />

<script setup>
import { useData } from 'vitepress'

const { page } = useData()

page.value.headers = [
  { level: 2, title: '1) Swift 与 SwiftUI 的一句话理解', slug: '_1-swift-与-swiftui-的一句话理解', children: [] },
  { level: 2, title: '2) Xcode 三大区域：左中右怎么用', slug: '_2-xcode-三大区域-左中右怎么用', children: [] },
  { level: 2, title: '3) SwiftUI 核心结构：App / Scene / View / struct / protocol', slug: '_3-swiftui-核心结构-app-scene-view-struct-protocol', children: [] },
  { level: 2, title: '4) 布局容器：VStack / HStack / ZStack', slug: '_4-布局容器-vstack-hstack-zstack', children: [] },
  { level: 2, title: '5) modifier 修饰符：顺序为何会改变结果', slug: '_5-modifier-修饰符-顺序为何会改变结果', children: [] },
  { level: 2, title: '6) CodeBreaker 页面拆解', slug: '_6-codebreaker-页面拆解', children: [] },
  { level: 2, title: '7) 数据与珠子视图：let/var 与可扩展 Pegs', slug: '_7-数据与珠子视图-let-var-与可扩展-pegs', children: [] },
  { level: 2, title: '8) ForEach：循环与 id 的坑', slug: '_8-foreach-循环与-id-的坑', children: [] },
  { level: 2, title: '9) MatchPegs：黑钉/白钉/空 + 深色模式', slug: '_9-matchpegs-黑钉-白钉-空-深色模式', children: [] },
  { level: 2, title: '10) enum：让状态表达更清楚', slug: '_10-enum-让状态表达更清楚', children: [] },
  { level: 2, title: '11) 常见错误清单', slug: '_11-常见错误清单', children: [] },
  { level: 2, title: '12) 任务与挑战', slug: '_12-任务与挑战', children: [] },
  { level: 2, title: '13) 实现约束', slug: '_13-实现约束', children: [] }
]
</script>
