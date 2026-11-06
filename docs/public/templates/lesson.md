---
title: SwiftUI 第一课
description: 学习声明式界面并完成一个小页面。
---

<MagHero title="SwiftUI 第一课" />

<MagNote type="tip" title="学习目标">

- 理解状态与界面的关系。
- 独立完成一个按钮计数器。

</MagNote>

## 动手练习

<MagStep :n="1" title="定义状态">

```swift
@State private var count = 0
```

</MagStep>

<MagStep :n="2" title="响应点击">

```swift
Button("点击次数：\(count)") {
    count += 1
}
```

</MagStep>

<MagDetails summary="为什么界面会更新？">

SwiftUI 追踪状态变化，并重新计算相关视图。

</MagDetails>

## 延伸学习

<MagGrid :cols="2">
  <MagCard title="学习资源" href="/resources/" />
  <MagCard title="社团活动" href="/activities/" />
</MagGrid>
