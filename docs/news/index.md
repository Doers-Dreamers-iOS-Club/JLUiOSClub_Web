# 社团新闻

<div v-for="news in theme.sidebar['/news/'].items" key="column.text">
  <ul>
    <li>
      <el-link @click="router.go('/news/'+news.link)" :disabled="news.link=='/'" style="font-size: 1rem">
        {{news.text}}
      </el-link>
      <Badge type="danger" text="NEW" v-if="news == theme.sidebar['/news/'].items[0]"/>
    </li>
  </ul>
</div>

<script setup>

import {useData, useRouter} from 'vitepress'; 
import {ElLink} from 'element-plus';
const {theme} = useData();
const router = useRouter();
</script>