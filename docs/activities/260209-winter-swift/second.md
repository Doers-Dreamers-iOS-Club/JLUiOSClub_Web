---
title: "冬季 Swift 培训 · 第二讲：Swift 进阶与 CodeBreaker 实战"
description: "第二讲讲义：MVVM、Struct/Class、Enum/Optional、Closure、状态管理与匹配算法。"
date: 2026.02.16
outline: [2, 3]
---


<MagHero title="第二讲 · Swift 进阶与 CodeBreaker 实战" />

<MagGrid :cols="4">
  <MagCard>
    <h3>学习重心</h3>
    <p>把“会写代码”升级为“能组织结构并解释设计”。</p>
  </MagCard>
  <MagCard>
    <h3>核心能力</h3>
    <p>值类型思维、状态驱动 UI、可维护算法实现。</p>
  </MagCard>
  <MagCard>
    <h3>项目主线</h3>
    <p>围绕 CodeBreaker：从 Model 到交互再到反馈计算。</p>
  </MagCard>
  <MagCard>
    <h3>课后方向</h3>
    <p>模式扩展、参数化重构、视觉风格升级。</p>
  </MagCard>
</MagGrid>

<MagNote type="tip">
  <strong>建议阅读方式：</strong> 先看每节“结论”，再看代码与图片。遇到疑问时回到第一讲对照基础概念。
</MagNote>

## 目录

1. 架构设计回顾：MVVM 模式
2. Swift 类型系统复习：Struct / Class、Enum / Optional
3. 从函数到闭包（Closure）
4. CodeBreaker Model 设计
5. 交互逻辑：`mutating` 与 `@State`
6. 核心算法：匹配逻辑（Exact / Inexact）
7. UI 完善与工程化细节
8. 课后任务（必做 + 挑战）
9. 实现约束与检查清单

## 1) 架构设计回顾：MVVM 模式

<MagStep n="1" title="把界面和规则拆开，是可维护性的起点">
  <ul>
    <li><strong>Model：</strong> 数据与规则（例如密码、判定逻辑、历史记录）。</li>
    <li><strong>View：</strong> 界面展示（颜色块、按钮、布局）。</li>
    <li><strong>ViewModel：</strong> 连接 View 与 Model，处理“用户操作 -> 状态更新”。</li>
  </ul>
  <p>本项目规模不大，可以简化实现，但思维上仍要坚持关注点分离。</p>
  <MagFigure caption="图 1：MVVM 的关键是职责拆分，不是为了“套模式”而套模式。">
    <img src="./second_imgs/MVVM.png" alt="MVVM 分层讲解" />
  </MagFigure>
</MagStep>

## 2) Swift 类型系统复习：Struct / Class、Enum / Optional

<MagStep n="2" title="Struct vs Class：值语义与引用语义">
  <p>`struct` 是值类型，赋值时拷贝；`class` 是引用类型，多个变量可指向同一对象。能用 Struct 时优先 Struct，尤其适合状态与数据模型。</p>
  <MagFigure caption="图 2：值类型更安全，引用类型更灵活，关键看是否需要共享可变状态。">
    <img src="./second_imgs/struct_class.png" alt="Struct 与 Class 对比" />
  </MagFigure>

```swift
struct Resolution {
    var width = 0
    var height = 0
}

class VideoMode {
    var resolution: Resolution
    var interlaced: Bool

    init(resolution: Resolution, interlaced: Bool) {
        self.resolution = resolution
        self.interlaced = interlaced
    }
}
```
</MagStep>

<MagStep n="3" title="Enum 与 Optional：表达状态，不赌运气">
  <p>枚举不仅能列选项，还能携带关联值。Optional 代表“可能为空”，请优先 `if let` 安全解包，避免强制解包崩溃。</p>
  <MagFigure caption="图 3：枚举让状态语义化，Optional 让空值处理显式化。">
    <img src="./second_imgs/enum_n_Optional.png" alt="Enum 与 Optional 示例" />
  </MagFigure>

```swift
enum Menu {
    case hamburger
    case coke(sugar: Int)
}

if let safeValue = maybeValue {
    print(safeValue)
}
```
</MagStep>

## 3) 从函数到闭包（Closure）

<MagStep n="4" title="闭包简写不是炫技，是降低噪音">
  <p>在不损失可读性的前提下，闭包可逐步简化：完整参数写法 -> 类型推断 -> `$0` 隐式参数。</p>
  <MagFigure caption="图 4：闭包演进重点是“保留语义，减少样板代码”。">
    <img src="./second_imgs/Closures.png" alt="Closure 简化过程" />
  </MagFigure>

```swift
// 完整写法
let exactCount1 = matches.filter { match in
    match == .exact
}.count

// 简写
let exactCount2 = matches.filter { $0 == .exact }.count
```
</MagStep>

## 4) CodeBreaker Model 设计

<MagStep>
  <p>本讲把游戏逻辑收敛到 Model，View 负责展示，避免把业务细节堆到界面层。</p>

```swift
typealias Peg = Color

struct CodeBreaker {
    var masterCode = Code(kind: .master)
    var guessCode = Code(kind: .guess)
    var attempts: [Code] = []
    let pegChoices: [Peg] = [.blue, .red, .green, .yellow]
}

struct Code {
    var pegs: [Peg] = Array(repeating: .clear, count: 4)
    var kind: Kind

    enum Kind: Equatable {
        case master
        case guess
        case attempt(matches: [Match])
    }
}
```
</MagStep>

## 5) 交互逻辑：`mutating` 与 `@State`

<MagStep n="5" title="数据要改得动，界面要跟得上">
  <ul>
    <li><code>mutating</code>：允许值类型方法修改自身属性。</li>
    <li><code>@State</code>：告诉 SwiftUI 这是会驱动界面刷新的状态。</li>
  </ul>
  <MagFigure caption="图 5：值类型修改与界面响应要配套，否则会出现“数据变了但UI不刷新”。">
    <img src="./second_imgs/mutating_state.png" alt="mutating 与 State" />
  </MagFigure>

```swift
mutating func changeGuessPeg(at index: Int) {
    let existingPeg = guessCode.pegs[index]
    if let currentIndex = pegChoices.firstIndex(of: existingPeg) {
        let nextIndex = (currentIndex + 1) % pegChoices.count
        guessCode.pegs[index] = pegChoices[nextIndex]
    } else {
        guessCode.pegs[index] = pegChoices.first ?? .clear
    }
}
```
</MagStep>

## 6) 核心算法：匹配逻辑（Exact / Inexact）

<MagStep n="6" title="两阶段判定：先精确，再模糊">
  <p>先处理位置和颜色都正确（Exact），并从待匹配序列中移除；再处理颜色对但位置错（Inexact）。删除元素时使用倒序遍历，避免索引错乱。</p>
  <MagFigure caption="图 6：匹配算法的关键是“先精确扣除，再模糊匹配”。">
    <img src="./second_imgs/Match_Algorithm.png" alt="CodeBreaker 匹配算法" />
  </MagFigure>

```swift
func match(against otherCode: Code) -> [Match] {
    var results = Array(repeating: Match.noMatch, count: pegs.count)
    var pegsToMatch = otherCode.pegs

    for index in pegs.indices.reversed() {
        if pegsToMatch[index] == pegs[index] {
            results[index] = .exact
            pegsToMatch.remove(at: index)
        }
    }

    // 第二阶段：在剩余元素中处理 inexact
    return results
}
```
</MagStep>

## 7) UI 完善与工程化细节

<MagStep>
  <ul>
    <li>历史记录使用 `ScrollView`，避免内容超出屏幕。</li>
    <li>用 `indices.reversed()` 控制最近一次尝试显示顺序。</li>
    <li>提交动作配合 `withAnimation` 提升反馈感。</li>
    <li>透明区域用 `.contentShape(Rectangle())` 提高可点性。</li>
    <li>随机初始化题目，提升重复游玩体验。</li>
  </ul>
</MagStep>

## 8) 课后任务（必做 + 挑战）

<MagGrid :cols="2">
  <MagCard>
    <h3>必做任务</h3>
    <ul>
      <li>复现课堂 Lecture 1-4 功能，确保可运行。</li>
      <li>忽略无效猜测（空输入、重复尝试）。</li>
      <li>新增 Restart 并随机 Peg 数量（3~6）。</li>
      <li>支持颜色模式与 Emoji 模式随机切换。</li>
    </ul>
  </MagCard>
  <MagCard>
    <h3>界面任务</h3>
    <ul>
      <li>让 Emoji 在不同 Peg 数量下可读（缩放策略）。</li>
      <li>加入 iOS 风格液态玻璃视觉（Material + 高光）。</li>
      <li>深色模式下保持边界与对比度清晰。</li>
    </ul>
  </MagCard>
  <MagCard>
    <h3>挑战任务</h3>
    <ul>
      <li>扩展颜色库并做字符串到颜色映射。</li>
      <li>主题系统（车辆 / 脸部 / 大地色等）。</li>
      <li>界面显示当前主题名称。</li>
    </ul>
  </MagCard>
  <MagCard>
    <h3>工程要求</h3>
    <ul>
      <li>代码命名清晰、无警告、可读性优先。</li>
      <li>至少使用一次 `static` 成员。</li>
      <li>Model 层保持 UI 无关，减少 `SwiftUI` 依赖。</li>
    </ul>
  </MagCard>
</MagGrid>

## 9) 实现约束与检查清单

<MagNote>
  <ul>
    <li>状态建模优先 `enum`，不要散落魔法数字。</li>
    <li>ForEach 需稳定 id（`indices` 或 `Identifiable`）。</li>
    <li>涉及可变状态时，明确 `mutating` 与 `@State` 边界。</li>
    <li>算法代码先追求正确性，再谈短写法。</li>
  </ul>
</MagNote>

<MagHero title="第二讲核心收获" />

<script setup>
import { useData } from 'vitepress'

const { page } = useData()

page.value.headers = [
  { level: 2, title: '1) 架构设计回顾：MVVM 模式', slug: '_1-架构设计回顾-mvvm-模式', children: [] },
  { level: 2, title: '2) Swift 类型系统复习：Struct / Class、Enum / Optional', slug: '_2-swift-类型系统复习-struct-class、enum-optional', children: [] },
  { level: 2, title: '3) 从函数到闭包（Closure）', slug: '_3-从函数到闭包-closure', children: [] },
  { level: 2, title: '4) CodeBreaker Model 设计', slug: '_4-codebreaker-model-设计', children: [] },
  { level: 2, title: '5) 交互逻辑：`mutating` 与 `@State`', slug: '_5-交互逻辑-mutating-与-state', children: [] },
  { level: 2, title: '6) 核心算法：匹配逻辑（Exact / Inexact）', slug: '_6-核心算法-匹配逻辑-exact-inexact', children: [] },
  { level: 2, title: '7) UI 完善与工程化细节', slug: '_7-ui-完善与工程化细节', children: [] },
  { level: 2, title: '8) 课后任务（必做 + 挑战）', slug: '_8-课后任务-必做-挑战', children: [] },
  { level: 2, title: '9) 实现约束与检查清单', slug: '_9-实现约束与检查清单', children: [] }
]
</script>
