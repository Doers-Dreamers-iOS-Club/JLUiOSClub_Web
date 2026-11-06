---
title: 动画展示与复用
description: 预览网站中的教学动画、主题插画与文字交互，复制 Markdown 写法。
---

<script setup>
import AnimationGallery from '@theme/components/maintenance/AnimationGallery.vue'
</script>

# 动画展示与复用

先选择一种动画，再复制下方代码到自己的 Markdown 页面。这里收录了 **10 种教学演示、3 种主题插画和 1 种文字交互**。页面会提前加载动画资源；预览每次只挂载一个示例，切换时释放前一个动画。

<AnimationGallery />

## 怎样放进自己的页面

教学演示与课程插画已全局注册，可以直接使用：

```html
<LearningIllustration scene="context" />

<CourseArtwork compact />
```

活动插画与翻动文字使用预览中给出的 `<script setup>` 导入。`@theme` 指向本站的 `.vitepress/theme`，不受 Markdown 文件目录深度影响。同一页面已有 `<script setup>` 时，把 import 合并到已有脚本里。

动画可以和 [网格、提示、步骤等排版组件](./components) 组合。图解本身较宽，建议独占一行；窄屏由组件自身调整布局。不要把复杂动画塞进窄卡片。

## 播放约定

- 教学演示进入视口后循环播放，可用画面右上角的按钮暂停；主动暂停后，滚动离开再回来也不会自动恢复。
- 三种主题插画每次挂载播放一次；展示页的“重新播放”会创建一个新实例。
- 离屏与后台停止播放；系统开启“减少动态效果”时，展示静态画面。
- 翻动文字由链接的鼠标悬停或键盘聚焦触发，`reverse` 可反转逐字播放顺序。
- 多个教学图解和活动插画可以放在同一页，每个实例独立管理状态。避免在同一屏堆放过多持续播放的演示。

## 页面级动效

这些效果与整页布局、滚动或导航有关，请在原页面体验：

<MagGrid :cols="2">
  <MagCard title="首页开场与 ASCII 转场" href="/">

文字开场、Swift 字符标志、字符重组与整屏切换。

  </MagCard>
  <MagCard title="活动封面与插画入场" href="/activities/">

封面插画、封面翻页与内容逐段出现。

  </MagCard>
  <MagCard title="课程封面与滚动动效" href="/resources/ai-programming/">

标题入场、文字退墨、翻页与滚动中的轻微位移。

  </MagCard>
  <MagCard title="轮播与弹窗" href="./components#轮播">

查看内容组件的交互示例和使用方法。

  </MagCard>
</MagGrid>

顶栏菜单与搜索框、站内页面切换都由主题统一提供，内容作者不需要在 Markdown 中重复添加。

首页 ASCII 动画依赖整屏状态、Canvas 与 WebGL 之间的交接；封面翻页依赖对应的封面和正文结构。它们目前不属于可随处插入的小组件，直接复制整个首页组件会带入整页行为。

## 新增自己的动画

先为动画创建独立 Vue 组件，再复用播放生命周期。教学分镜使用 `useLabPlayback`，一般的可见性条件使用 `usePlaybackVisibility`，主题插画可参考 `observeArtworkPlayback`。具体位置与接入步骤见 [开发与检查](./development)。

新增演示后，同步补充这个展示页的示例目录和复用代码，让下一位维护者能够找到并使用它。
