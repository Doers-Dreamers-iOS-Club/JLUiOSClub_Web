---
title: 这里是一些活动
---

# 一些活动
## 即将推出

- [解锁iPad生产力](/activities/ComingSoon/ExploreiPad)
- [移动应用创新赛宣讲](/activities/ComingSoon/maic_speakers)

## 往期活动

- [百团纳新](/activities/PastEvents/biantuan)
- [macOS初体验](/activities/PastEvents/macos_experience)
- [Apple设备选购建议](/activities/PastEvents/device_suggestion)
- [2023冬季WWDC-Swift特训营](/activities/PastEvents/wwdc_swift2023)

---
```mermaid
flowchart LR
  subgraph 活动总流程
    direction LR
      before(活动前) --> running(活动中) --> after(活动后)
  end

  subgraph A[活动前]
    direction TB
      topic[确定主题] --> time[敲定时间] --> ad[多渠道宣传]
  end
  subgraph B[活动中]
    direction TB
      checkin[签到登记] --> 讲解 --> 问答 --> 总结 --> photo[合影]
  end
  subgraph C[活动后]
    direction TB
      summary[社内总结] --> archive[资料存档]
  end
  
  before --x A
  running --x B
  after --x C

```
