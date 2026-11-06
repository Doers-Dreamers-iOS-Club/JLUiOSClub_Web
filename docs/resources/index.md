<MagHero title="资源导航" />

<MagSection n="01" title="社团原创讲义" />

<MagGrid :cols="2">
<MagCard title="从想法到作品" href="/resources/ai-programming/"></MagCard>
<MagCard title="Winter Swift 培训" href="/activities/260209-winter-swift/"></MagCard>
</MagGrid>

![Let's Swift!](developers.jpeg)

我们整理了一些您在学习设计和开发 Apple 平台 Apps 过程中可能需要的教程和资源，希望能够帮到您。如您也希望分享一些资源，可以在 [GitHub](https://github.com/AQiu-2003/JLUiOSClub_Web/edit/main/docs/resources/index.md) 上提 PR 或是 issues，或与社团负责人联系。

<MagSection n="02" title="Swift 学习资源" />

<MagFigure plain maxHeight="10rem">
  <img src="./SwiftTransparent.png" alt="Swift" />
</MagFigure>

如果您是初次接触编程，可以尝试一下 Apple 官方提供的 [Swift Playgrounds](https://developer.apple.com/cn/swift-playgrounds/)。

对于编程初学者来说，以视频的方式学习可能更易于理解。这里我们推荐几个 up 主：

- 由 [ChaoCode](https://chaocode.co/) 制作的系列视频：
  - 基础篇：[Youtube](https://www.youtube.com/playlist?list=PLXM8k1EWy5kiAD0o69R00b7I62ZVUyfJJ) / [bilibili](https://space.bilibili.com/130089976/channel/seriesdetail?sid=2287792)
  - 中级篇：[Youtube](https://www.youtube.com/playlist?list=PLXM8k1EWy5ki_TSdt_Gxd3JRnnaucBiFW) / [bilibili](https://space.bilibili.com/130089976/channel/seriesdetail?sid=2289585)
  - _Tips: 在视频下方简介可以找到对应作业链接_
- 由[陈鹏宇老师](https://space.bilibili.com/28238054)制作的《移动应用程序开发》：[bilibili](https://www.bilibili.com/video/BV19N4y1Z7EE/?vd_source=80241e7dddac0c1114813c308430060d)
- 由浙江大学[张克俊老师](https://www.icourse163.org/u/mooc43428885866153978?userId=1148803364)制作的《Swift 创新导论》系列课程：[中国大学MOOC](https://www.icourse163.org/course/ZJU-1450024180?tid=1470947506)（如当前学期已结束，可以选择其它学期自学）

如果您之前学习过其它编程语言，希望快速切换到 Swift，可以参考 [Swift.org](https://swift.org/) 官网的[快速入门指南](https://www.swift.org/getting-started/)，或是由国内 SwiftGG 翻译组制作的[中文版 Swift 教程](https://gitbook.swiftgg.team/swift/huan-ying-shi-yong-swift/03_a_swift_tour)。

::: details 在 Windows 或 Linux 上编译 Swift ？
Swift 是一个开源项目，能够兼容各种主流的操作系统。虽然我们并不推荐您在非 macOS 平台上使用 Swift，因为暂时还没有足够好用的 IDE，而且也不能使用 SwiftUI，但这的确是可行的。如果您有 iPad，也可以尝试 iPad 版的 [Swift Playgrounds](https://developer.apple.com/cn/swift-playgrounds/)，它应当能够满足您大部分 Swift & SwiftUI 学习需求。

如果您的确需要在 Windows 或 Linux 上编译 Swift，我们推荐您阅读官方的[安装教程](https://www.swift.org/install/)。对于 Windows 平台，您也可以使用 [Plain Swift](https://www.plainswift.com/) 这个相对成熟的 IDE，但这不是一个免费软件。我们更推荐您在 Visual Studio Code 中安装 [Swift 插件](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang)以启用语言支持，并使用[命令行编译项目](https://www.swift.org/getting-started/cli-swiftpm/)。

👉 最简单的办法，您也可以使用一些在线编译器，比如 [Online Swift Playground](https://online.swiftplayground.run/) 或是 [Programiz](https://www.programiz.com/swift/online-compiler/)，它们的 Swift 版本会略微落后于最新版本，但对初学者来说没什么关系。

:::

::: details 视频教学：如何在 Windows 上配置 Swift 编译环境 <badge type="warning">NEW</badge>

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=112776244628317&bvid=BV1MFbaeNETr&cid=500001613611915&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" autoplay="false" width="100%" height="400px"></iframe>

前往 bilibili 观看视频更清晰：<a href="https://www.bilibili.com/video/BV1MFbaeNETr/">跳转链接</a>

:::

<MagSection n="03" title="SwiftUI 学习资源" />

<MagFigure maxHeight="10rem">
  <img src="https://developer.apple.com/news/images/og/swiftui-og.png" alt="SwiftUI" />
</MagFigure>

如果您熟悉前端开发，或之前接触过安卓/鸿蒙平台的 App 开发，推荐阅读官方的两个入门教程：[旧版](https://developer.apple.com/tutorials/swiftui)/[新版](https://developer.apple.com/tutorials/develop-in-swift)，并参考一些[示例 Apps](https://developer.apple.com/tutorials/sample-apps)。若想更系统的入门 Swift 和 SwiftUI 以及 MVVM 设计模式，也可以尝试学习 [CS193p](https://cs193p.sites.stanford.edu/)，我们不推荐初学者学习这门课程。

如果您是初学者，建议您跟着视频教程学习。这里我们推荐几个 up 主：

- 由 [ChaoCode](https://chaocode.co/) 制作的《SwiftUI 新手入门》系列视频：[Youtube](https://www.youtube.com/playlist?list=PLXM8k1EWy5khONZ9M9ytK8mMrcEOXvGsE) / [bilibili](https://space.bilibili.com/1911023449/channel/collectiondetail?sid=809115)
- 由[陈鹏宇老师](https://space.bilibili.com/28238054)制作的《移动应用程序开发》：[bilibili](https://www.bilibili.com/video/BV19N4y1Z7EE/?vd_source=80241e7dddac0c1114813c308430060d)
- 由浙江大学[张克俊老师](https://www.icourse163.org/u/mooc43428885866153978?userId=1148803364)制作的《Swift 创新导论》系列课程：[中国大学MOOC](https://www.icourse163.org/course/ZJU-1450024180?tid=1470947506)（如当前学期已结束，可以选择其它学期自学）

以及一些 SwiftUI App 示例：[SwiftUI 训练营](https://space.bilibili.com/249603883)、[SwiftUI by Example](https://www.hackingwithswift.com/quick-start/swiftui)

<MagNote type="tip" title="学习建议">

在 Swift 和 SwiftUI 的学习过程中，要善于利用网络资源，在 Google、Stack Overflow、GitHub、ChatGPT 上检索信息，并注意**检查资源的时效性**（每年 WWDC 都会更新很多新内容，这导致旧资料可能不适用于新情况）。这里推荐一个免费的 Swift 学习网站：[Hacking-with-Swift](https://www.hackingwithswift.com/)，在这个网站上也可以找到很多问题的解决方案。

</MagNote>

::: details 在 Windows 或 Linux 上开发 SwiftUI Apps？
目前没有有效的办法在非 macOS/iPadOS 上开发 SwiftUI 应用，SwiftUI 是 Apple 平台专有的 UI/UX 框架，暂时不具备更多跨平台能力。如果您有 iPad，也可以尝试 iPad 版的 [Swift Playgrounds](https://developer.apple.com/cn/swift-playgrounds/)，它应当能够满足您大部分 Swift & SwiftUI 学习需求，目前也能够开发可上架的 App。

您可以在虚拟机内安装 macOS 或使用[黑苹果](https://blog.daliansky.net/)，也可以借助云解决方案来解决问题，比如[Mac In Cloud（推荐）](https://www.macincloud.com)或[Amazon 云 Mac 服务器](https://aws.amazon.com/cn/ec2/instance-types/mac/)。不过这超出了本篇资源导航的内容范畴，请自行查找解决方案。
:::

<MagSection n="04" title="App 原型设计" />

### 原型设计工具

<MagFigure plain maxHeight="8rem">
  <img src="./Figma.png" alt="Figma" />
</MagFigure>

- 👍[Figma](https://www.figma.com/)：当红免费在线设计工具，国内网络访问较为缓慢，安装插件可以汉化界面。
- [Sketch](https://www.sketch.com/)：macOS 上的老牌原型设计软件，学生可申请教育免费。
- [即时设计](https://js.design/) / [Pixso](https://pixso.cn/)：国产在线 UI 设计工具，高仿 Figma，部分功能可能需要付费。
- [墨刀](https://modao.cc)：会有很多设计模版（部分模版需要收费），社团成员推荐。
- Photoshop：通用的设计软件，学习曲线较陡，适合熟悉软件的同学。官方没有提供完整的设计资源，但有办法可以转换其它软件的资源后再导入。
- PowerPoint / Keynote：是的，PPT 可以用于可交互的高保真原型设计，但在组件复用上较为困难，只适合设计小 demo。

### 官方设计资源

- 概览：[Apple Developer - Design](https://developer.apple.com/cn/design/)
- 人机界面指南：[Human Interface Guidelines](https://developer.apple.com/cn/design/human-interface-guidelines)
- 组件库 & 设计模版：[Apple Design Resources](https://developer.apple.com/cn/design/resources/)（包含一些产品边框）
- 图标库：[SF Symbols](https://developer.apple.com/cn/sf-symbols/)（自带部分 SF 字体）
- 字体：[Fonts for Apple platforms](https://developer.apple.com/fonts/)

<MagSection n="05" title="部分往年获奖竞赛作品" />

- Swift 学生挑战赛：[Github](https://github.com/wwdc)
- 移动应用创新赛：[2023年](https://sspai.com/post/82738) [2022年](https://sspai.com/post/75611) [2021年](https://sspai.com/post/70453)
