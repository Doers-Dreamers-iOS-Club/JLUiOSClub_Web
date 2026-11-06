---
title: 从一个想法，开始一次实践
description: 用一两句话介绍活动主题与值得关注的内容。
date: "2026-11-06"
sidebar: true
aside: false
outline: false
prev: false
next: false
lastUpdated: false
editLink: false
pageClass: mag-article-page
---

<MagArticle :title="$frontmatter.title" :description="$frontmatter.description" :date="$frontmatter.date" issue="01" category="技术实践 · 活动主题" kind="活动介绍" author="JLU iOS Club">

用一段完整的叙述介绍活动背景、参与者与主要内容。发布回顾时，将 kind 改为“活动回顾”，根据实际记录填写，不预写现场成果。

<div class="article-facts">

**时间。** 填写已确认的活动时间。

**地点。** 填写具体地点或线上参与方式。

</div>

## 从一个问题开始

介绍活动主题，以及为什么选择这个问题。

## 一起动手实践

按实际过程组织正文，保留参与者分享与具体发现。教学步骤用小标题、段落与代码说明。

### 第一个步骤

在这里写清楚操作及预期结果。

## 留下记录

将照片放入本页同目录的 `imgs/`。使用 `MagFigure`，在插槽里放 `<img>`，填写图片实际尺寸、替代文字与图注；首图使用 `loading="eager"`，其余使用 `loading="lazy"`，并设置 `decoding="async"`。删掉这段写作提示后再发布。

## 下一次相聚

用一段话收束文章。需要继续阅读入口时，给 MagArticle 添加 `:next="{ title: '下一篇标题', href: '/activities/下一篇目录/' }"`。

</MagArticle>
