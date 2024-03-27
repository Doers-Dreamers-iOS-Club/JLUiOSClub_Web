---
title: 这里是一些活动
---

# 一些活动
## 即将推出

[//]: # (- [解锁iPad生产力]&#40;/activities/comingSoon/ExploreiPad&#41;)

[//]: # (- [移动应用创新赛宣讲]&#40;/activities/comingSoon/maic_speakers&#41;)

## 往期活动

[//]: # (- [2023百团纳新]&#40;/activities/pastEvents/biantuan&#41;)

[//]: # (- [macOS初体验]&#40;/activities/pastEvents/macos_experience&#41;)

[//]: # (- [Apple设备选购建议]&#40;/activities/pastEvents/device_suggestion&#41;)

[//]: # (- [2023冬季WWDC-Swift特训营]&#40;/activities/pastEvents/wwdc_swift2023&#41;)

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
