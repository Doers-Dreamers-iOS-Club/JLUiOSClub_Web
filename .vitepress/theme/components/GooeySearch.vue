<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import { gsap } from 'gsap'
import type { ContentHit } from '../composables/searchContent'

const root = ref<HTMLElement>(), input = ref<HTMLInputElement>(), trigger = ref<HTMLButtonElement>()
const field = ref<HTMLElement>(), blob = ref<HTMLElement>(), orb = ref<HTMLElement>(), resultList = ref<HTMLElement>()
const opened = ref(false), query = ref(''), loading = ref(false), failed = ref(false), selected = ref(-1), moving = ref(false)
const hits = ref<ContentHit[]>([]), ready = ref(false)
const { localeIndex } = useData(), route = useRoute(), router = useRouter()
let timeline: gsap.core.Timeline | undefined, resultMotion: gsap.core.Tween | undefined
let preference: MediaQueryList | undefined, timer = 0, request = 0
const reduced = () => preference?.matches ?? true
async function open() {
  if (opened.value) return
  opened.value = true
  if (reduced()) timeline?.progress(1).pause(); else timeline?.timeScale(1).play()
  await nextTick(); input.value?.focus()
}
function close(restore = false) {
  if (!opened.value) return
  opened.value = false; ++request; clearTimeout(timer); loading.value = false
  resultMotion?.kill()
  const items = resultList.value?.querySelectorAll('.gooey-result')
  if (items?.length && !reduced()) {
    moving.value = true
    resultMotion = gsap.to(items, { y: (i: number) => -(i + 1) * 62, scale: .8, opacity: 0, duration: .3, stagger: { each: .025, from: 'end' }, ease: 'power2.in', onComplete: () => { moving.value = false } })
  }
  if (reduced()) timeline?.progress(0).pause(); else timeline?.timeScale(1.7).reverse()
  if (restore) trigger.value?.focus()
}
async function search() {
  const version = ++request
  selected.value = -1; failed.value = false
  if (!query.value.trim()) { hits.value = []; loading.value = false; return }
  loading.value = true
  try {
    const { searchContent } = await import('../composables/searchContent')
    const results = await searchContent(query.value.trim(), localeIndex.value)
    if (version !== request || !opened.value) return
    hits.value = results; loading.value = false
    await nextTick()
    resultMotion?.kill()
    const items = resultList.value?.querySelectorAll('.gooey-result')
    if (items?.length && !reduced()) { moving.value = true; resultMotion = gsap.fromTo(items,
      { y: (i: number) => -(i + 1) * 62, scale: .8, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: .48, ease: 'power3.out', stagger: .06, clearProps: 'transform,opacity', onComplete: () => { moving.value = false } }) }
  } catch {
    if (version === request) { failed.value = true; hits.value = []; loading.value = false }
  }
}
watch(query, () => {
  ++request; clearTimeout(timer); resultMotion?.kill(); hits.value = []; selected.value = -1
  loading.value = !!query.value.trim(); failed.value = false
  timer = window.setTimeout(search, 160)
})
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true) }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (hits.value.length) {
      selected.value = selected.value < 0
        ? (event.key === 'ArrowDown' ? 0 : hits.value.length - 1)
        : (selected.value + (event.key === 'ArrowDown' ? 1 : -1) + hits.value.length) % hits.value.length
      nextTick(() => {
        const list = resultList.value, item = list?.children[selected.value] as HTMLElement | undefined
        if (!list || !item) return
        const top = item.offsetTop - list.offsetTop
        if (top < list.scrollTop) list.scrollTop = top
        else if (top + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + item.offsetHeight - list.clientHeight
      })
    }
  }
  if (event.key === 'Enter' && !event.isComposing && hits.value.length) {
    event.preventDefault(); const hit = hits.value[Math.max(0, selected.value)]; close(); router.go(withBase(hit.id))
  }
}
function shortcut(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  const editing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
  if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !editing)) {
    event.preventDefault(); open()
  }
}
function outside(event: PointerEvent) { if (!root.value?.contains(event.target as Node)) close() }
function blur(event: FocusEvent) { if (!root.value?.contains(event.relatedTarget as Node)) close() }
function mediaChange() { timeline?.progress(opened.value ? 1 : 0).pause(); resultMotion?.progress(1) }
watch(() => route.path, () => close())
watch(opened, value => { if (value && query.value.trim()) search() })
onMounted(() => {
  preference = matchMedia('(prefers-reduced-motion: reduce)'); preference.addEventListener('change', mediaChange)
  window.addEventListener('keydown', shortcut); document.addEventListener('pointerdown', outside)
  timeline = gsap.timeline({ paused: true })
    .fromTo(blob.value!, { scaleX: .55 }, { scaleX: 1, duration: .5, ease: 'power3.out', easeReverse: 'power3.out' }, 0)
    .fromTo(orb.value!, { x: -72, scale: .8, autoAlpha: 0 }, { x: 0, scale: 1, autoAlpha: 1, duration: .55, ease: 'power3.out', easeReverse: 'power3.out' }, .1)
    .fromTo(field.value!, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: .25, easeReverse: true }, .12)
  ready.value = true
})
onBeforeUnmount(() => {
  ++request; clearTimeout(timer); timeline?.kill(); resultMotion?.kill()
  preference?.removeEventListener('change', mediaChange); window.removeEventListener('keydown', shortcut); document.removeEventListener('pointerdown', outside)
})
</script>

<template>
  <div ref="root" class="VPNavBarSearch gooey-search" :class="{ 'is-open': opened }" :data-ready="ready" @focusout="blur" @keydown.esc.stop.prevent="close(true)">
    <svg class="gooey-filter" aria-hidden="true" width="0" height="0"><defs><filter id="club-search-goo" x="-30%" y="-30%" width="160%" height="180%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" /><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -15" result="goo" /><feComposite in="SourceGraphic" in2="goo" operator="atop" /></filter></defs></svg>
    <button ref="trigger" class="gooey-trigger" aria-label="搜索本站" :aria-expanded="opened" aria-controls="club-search-panel" @click="open"><i class="ti ti-search" aria-hidden="true" /><span>搜索</span><kbd>⌘ K</kbd></button>
    <div id="club-search-panel" class="gooey-panel" :inert="!opened" :aria-hidden="!opened">
      <div class="gooey-backdrop" aria-hidden="true" />
      <div class="gooey-content">
      <div class="gooey-shapes" aria-hidden="true"><div ref="blob" class="gooey-blob" /><div ref="orb" class="gooey-orb"><i :class="loading ? 'ti ti-loader-2' : 'ti ti-search'" /></div></div>
      <div ref="field" class="gooey-field">
        <input ref="input" v-model="query" type="search" role="combobox" aria-label="搜索本站内容" aria-autocomplete="list" :aria-expanded="opened && hits.length > 0" aria-controls="club-search-results" :aria-activedescendant="selected >= 0 ? `club-search-result-${selected}` : undefined" placeholder="搜索本站…" autocomplete="off" @keydown="keydown" />
        <button type="button" aria-label="关闭搜索" @click="close(true)"><i class="ti ti-x" aria-hidden="true" /></button>
      </div>
      <div class="gooey-feedback" role="status" aria-live="polite">
        <span v-if="loading">正在搜索…</span><span v-else-if="failed">暂时无法加载搜索，请重新输入重试。</span><span v-else-if="query.trim() && !hits.length">没有找到相关内容</span><span v-else-if="!query.trim()">输入关键词，探索社团内容</span><span v-else class="gooey-sr">找到 {{ hits.length }} 条结果</span>
      </div>
      <div ref="resultList" id="club-search-results" role="listbox" aria-label="搜索结果" class="gooey-results" :class="{ 'is-moving': moving }">
        <a v-for="(hit, i) in hits" :id="`club-search-result-${i}`" :key="hit.id" :href="withBase(hit.id)" class="gooey-result" role="option" :aria-selected="selected === i" @pointermove="selected = i" @click="close()"><span class="gooey-result__label"><span>{{ hit.title }}</span><small v-if="hit.titles.length">{{ hit.titles.join(' / ') }}</small></span><i class="ti ti-arrow-up-right" aria-hidden="true" /></a>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gooey-search { --goo-fill: #f0f0f2; --goo-hover: #e5e5e8; --goo-ink: var(--mag-text); position: relative; display: flex; align-items: center; flex-grow: 1; padding-left: 32px; height: 64px; }
.dark .gooey-search { --goo-fill: #29292c; --goo-hover: #353539; }
.gooey-filter { position: absolute; pointer-events: none; }
.gooey-trigger { display: flex; align-items: center; gap: 9px; height: 38px; padding: 0 15px; border-radius: 24px; background: var(--goo-fill); color: var(--goo-ink); font-size: 13px; transition: opacity .15s .3s, background-color .2s; }
.gooey-trigger:hover { background: var(--goo-hover); }
.gooey-trigger > i { font-size: 17px; }
.gooey-trigger kbd { margin-left: 14px; font-family: inherit; font-size: 10px; opacity: .65; }
.gooey-trigger:focus-visible, .gooey-field:focus-within { outline: 1px solid var(--mag-accent); outline-offset: 3px; }
.is-open .gooey-trigger { opacity: 0; pointer-events: none; transition-delay: 0s; }
/* Keep the backdrop outside the goo filter so only the page behind it blurs. */
.gooey-backdrop { position: absolute; inset: -8px -8px 0; border-radius: 28px; background: rgb(245 245 247 / 42%); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); opacity: 0; pointer-events: none; transition: opacity .3s ease; }
.dark .gooey-backdrop { background: rgb(20 20 22 / 42%); }
.is-open .gooey-backdrop { opacity: 1; }
.gooey-panel { position: absolute; z-index: 60; top: 13px; left: 32px; width: 274px; visibility: hidden; pointer-events: none; }
.gooey-content { position: relative; filter: url(#club-search-goo); }
.is-open .gooey-panel { visibility: visible; pointer-events: auto; }
.gooey-search:not(.is-open) .gooey-panel { transition: visibility 0s .4s; }
.gooey-shapes { position: absolute; inset: 0 0 auto; height: 38px; pointer-events: none; }
.gooey-blob { width: 224px; height: 38px; border-radius: 24px; transform-origin: left center; background: var(--goo-fill); }
.gooey-orb { position: absolute; right: 0; top: 0; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--goo-fill); color: var(--goo-ink); }
.gooey-orb i { font-size: 18px; }
.gooey-orb .ti-loader-2 { animation: gooey-spin .8s linear infinite; }
.gooey-field { position: relative; display: flex; align-items: center; width: 224px; height: 38px; border-radius: 24px; color: var(--goo-ink); }
.gooey-field input { width: 100%; min-width: 0; padding: 0 8px 0 16px; background: transparent; color: inherit; font: inherit; font-size: 13px; outline: none; }
.gooey-field input::placeholder { color: inherit; opacity: .65; }
.gooey-field input::-webkit-search-cancel-button { display: none; }
.gooey-field button { flex: none; width: 32px; height: 38px; margin-right: 4px; }
.gooey-feedback { margin: 14px 0 4px; font-size: 11px; color: var(--mag-text-secondary); white-space: normal; }
.gooey-search:not(.is-open) .gooey-feedback { opacity: 0; }
.gooey-feedback > span:not(.gooey-sr) { display: block; padding: 8px 12px; border-radius: 14px; background: var(--vp-c-bg); border: var(--mag-rule); }
.gooey-results { display: grid; gap: 9px; padding: 2px 4px 10px; margin: 0 -4px; max-height: min(480px, calc(100dvh - 130px)); overflow-y: auto; overscroll-behavior: contain; }
.gooey-results.is-moving { overflow: visible; }
.gooey-result { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 52px; padding: 10px 16px; border-radius: 24px; background: var(--goo-fill); color: var(--goo-ink); transform-origin: top center; white-space: normal; }
.gooey-result__label { display: grid; min-width: 0; font-size: 13px; line-height: 1.4; }
.gooey-result small { opacity: .65; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 3px; }
.gooey-result:hover, .gooey-result[aria-selected="true"], .gooey-result:focus-visible { background: var(--goo-hover); color: var(--mag-accent); }
.gooey-result:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: 2px; }
.gooey-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@keyframes gooey-spin { to { transform: rotate(360deg); } }
@media (max-width: 1100px) and (min-width: 768px) { .gooey-panel { top: 59px; } }
@media (max-width: 767px) {
  .gooey-search { padding-left: 0; flex-grow: 0; }
  .gooey-trigger { width: 44px; height: 44px; padding: 0; justify-content: center; background: transparent; color: var(--mag-text); }
  .gooey-trigger span, .gooey-trigger kbd { display: none; }
  .gooey-panel { position: fixed; left: auto; right: 16px; top: 72px; width: min(274px, calc(100vw - 32px)); }
}
@media (prefers-reduced-motion: reduce) { .gooey-trigger, .gooey-backdrop { transition: none; } .gooey-orb .ti-loader-2 { animation: none; } .gooey-content { filter: none; } .gooey-search:not(.is-open) .gooey-panel { transition: none; } }
@supports (-webkit-touch-callout: none) { .gooey-content { filter: none; } }
</style>
