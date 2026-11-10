import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getPageNavigation,
  learningActiveMatch,
  activitiesActiveMatch,
  updatesActiveMatch,
} from '../.vitepress/data/navigation.ts'

const activeSections = path => [learningActiveMatch, activitiesActiveMatch, updatesActiveMatch]
  .map(pattern => new RegExp(pattern).test(path))

test('learning pages retain their section even when their URL is under activities', () => {
  for (const path of [
    '/resources/',
    '/resources/ai-programming/chapters/01',
    '/activities/260209-winter-swift/first',
    '/activities/251102-AI-Agent/',
    '/activities/251018-vibe-coding/',
    '/activities/250518-ai-workshop/',
  ]) {
    assert.equal(getPageNavigation(path).section.title, '学习中心', path)
    assert.deepEqual(activeSections(path), [true, false, false], path)
  }
})

test('activity and news navigation remains distinct from learning', () => {
  for (const path of ['/activities/', '/activities/261025-idea-workshop/']) {
    const navigation = getPageNavigation(path)
    assert.equal(navigation.section.title, '活动与动态', path)
    assert.deepEqual(navigation.index, { title: '返回活动目录', href: '/activities/#activity-content' })
    assert.deepEqual(activeSections(path), [false, true, true], path)
  }
  const news = getPageNavigation('news/an-nuo-xi/index.md')
  assert.equal(news.section.title, '活动与动态')
  assert.deepEqual(news.index, { title: '返回新闻目录', href: '/news/' })
  assert.deepEqual(activeSections('/news/an-nuo-xi/'), [false, false, true])
})

test('course return links reach the existing directory anchors from every page kind', () => {
  const courses = [
    {
      pages: ['resources/ai-programming/index.md', 'resources/ai-programming/chapters/01.md', 'resources/ai-programming/reference/tools.md'],
      title: 'AI 编程入门', label: '返回课程目录', href: '/resources/ai-programming/#course-content',
    },
    {
      pages: ['activities/260209-winter-swift/index.md', 'activities/260209-winter-swift/first.md', 'activities/260209-winter-swift/bonus-ai-programming.md'],
      title: 'Winter Swift', label: '返回培训目录', href: '/activities/260209-winter-swift/#activity-content',
    },
  ]
  for (const { pages, title, label, href } of courses) {
    for (const path of pages) {
      const navigation = getPageNavigation(path)
      assert.deepEqual(navigation.series, { title, href }, path)
      assert.deepEqual(navigation.index, { title: label, href }, path)
      assert.deepEqual(navigation.section, { title: '学习中心', href: '/resources/' }, path)
    }
  }
})

test('similar directory prefixes do not inherit a course or learning activity section', () => {
  for (const path of [
    '/activities/260209-winter-swift-notes/',
    '/activities/251102-AI-Agent-notes/',
    '/activities/251018-vibe-coding-notes/',
    '/activities/250518-ai-workshop-notes/',
  ]) {
    const navigation = getPageNavigation(path)
    assert.equal(navigation.section.title, '活动与动态', path)
    assert.equal(navigation.series, undefined, path)
    assert.deepEqual(activeSections(path), [false, true, true], path)
  }
  assert.equal(getPageNavigation('resources/ai-programming-notes/index.md').series, undefined)
  for (const path of ['/resources-other/', '/activities-other/', '/news-other/']) {
    assert.deepEqual(activeSections(path), [false, false, false], path)
  }
})
