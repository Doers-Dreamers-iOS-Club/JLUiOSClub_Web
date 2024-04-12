# 社团活动

::: warning
此页面仍在建设中，部分内容还未完成，敬请期待！
:::
<div v-for="column in theme.sidebar['/activities/'].items" key="column.text">
  <h2>{{column.text}}</h2>
  <ul>
    <li v-for="item in column.items" key="item.text">
      <el-link @click="router.go('/activities/'+item.link)" :disabled="item.link=='/'" style="font-size: 1rem">
        {{item.text}}
      </el-link>
      <Badge type="danger" text="NEW" v-if="item == theme.sidebar['/activities/'].items[0].items[0]"/>
    </li>
  </ul>
</div>

## 活动流程

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

<script setup>

import {useData, useRouter} from 'vitepress'; 
import {ElLink} from 'element-plus';
const {theme} = useData();
const router = useRouter();
</script>