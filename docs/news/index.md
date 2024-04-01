# 社团新闻

<div v-for="news in theme.sidebar['/news/'].items" key="column.text">
  <ul>
    <li>
      <el-link :href="news.link" :disabled="news.link=='/'" style="font-size: 1rem">
        {{news.text}}
      </el-link>
      <Badge type="danger" text="NEW" />
    </li>
  </ul>
</div>

<script setup>

import {useData} from 'vitepress'; 
import {ElLink} from 'element-plus';
const {theme} = useData();

</script>