---
title: SwiftUI 第一课，让界面回应操作
description: 认识状态与界面的关系，完成一个按钮计数器。
date: "2026-11-06"
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

<MagArticle :title="$frontmatter.title" :description="$frontmatter.description" :date="$frontmatter.date" issue="01" category="SwiftUI · 入门讲义" kind="活动讲义" author="JLU iOS Club">

从一个按钮开始，观察用户操作如何改变状态，以及状态如何改变屏幕上的内容。

<details class="article-contents">
<summary>阅读目录</summary>
<ol>
<li><a href="#practice">动手练习</a></li>
<li><a href="#further-reading">延伸学习</a></li>
</ol>
</details>

## 动手练习 {#practice}

### 定义状态

```swift
@State private var count = 0
```

### 响应点击

```swift
Button("点击次数：\(count)") {
    count += 1
}
```

<MagDetails summary="为什么界面会更新？">

SwiftUI 追踪状态变化，并重新计算相关视图。

</MagDetails>

## 延伸学习 {#further-reading}

试着增加一个重置按钮，并在 [学习资源](/resources/) 中继续了解 SwiftUI。

</MagArticle>
