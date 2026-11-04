<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { gsap } from 'gsap'
import VPMenu from 'vitepress/dist/client/theme-default/components/VPMenu.vue'

defineProps<{ icon?: string; button?: string; label?: string; items?: any[] }>()
const root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>(), menu = ref<HTMLElement>(), arrow = ref<HTMLElement>()
const opened = ref(false), ready = ref(false)
const route = useRoute()
let motion: gsap.core.Timeline | undefined
let preference: MediaQueryList | undefined
let closeTimer = 0
let keyboardClose = false
function setOpen(value: boolean) {
  clearTimeout(closeTimer)
  opened.value = value
  if (!motion) return
  if (preference?.matches) motion.progress(value ? 1 : 0).pause()
  else if (value) motion.timeScale(1).play()
  else {
    motion.timeScale(2.5).reverse()
    if (motion.progress() === 0) gsap.set(menu.value!, { autoAlpha: 0 })
  }
}
function enter() { keyboardClose = false; setOpen(true) }
function leave() {
  closeTimer = window.setTimeout(() => {
    if (!root.value?.contains(document.activeElement)) setOpen(false)
  }, 90)
}
function focusOut(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node)) setOpen(false)
}
function outside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) setOpen(false)
}
function links() { return [...(menu.value?.querySelectorAll<HTMLElement>('a, button, [tabindex="0"]') ?? [])] }
async function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault(); event.stopPropagation(); keyboardClose = true; setOpen(false); trigger.value?.focus()
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault(); setOpen(true); await nextTick()
    // Focus must wait until the panel is visible, including an interrupted reopen.
    gsap.set(menu.value!, { visibility: 'visible' })
    const items = links(), current = items.indexOf(document.activeElement as HTMLElement)
    const next = current < 0 ? (event.key === 'ArrowDown' ? 0 : items.length - 1) : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  }
}
function applyPreference() { motion?.progress(opened.value ? 1 : 0).pause() }
onMounted(() => {
  preference = matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', applyPreference)
  document.addEventListener('pointerdown', outside)
  gsap.set(menu.value!, { autoAlpha: 0, yPercent: -30, scale: .7 })
  motion = gsap.timeline({ paused: true, onReverseComplete: () => { if (!opened.value) gsap.set(menu.value!, { autoAlpha: 0 }) } })
    .to(arrow.value!, { rotation: 180, duration: .9, ease: 'elastic.out(1.2, 0.3)', easeReverse: 'power2.inOut' }, 0)
    .to(menu.value!, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1, ease: 'elastic.out(1.2, 0.3)', easeReverse: 'power3.out' }, 0)
    .from(links(), { opacity: 0, x: -20, duration: .5, ease: 'back.out(3)', easeReverse: 'power2.out', stagger: .07 }, .1)
  ready.value = true
  if (opened.value) setOpen(true)
})
watch(() => route.path, () => setOpen(false))
onBeforeUnmount(() => { clearTimeout(closeTimer); motion?.kill(); preference?.removeEventListener('change', applyPreference); document.removeEventListener('pointerdown', outside) })
</script>

<template>
  <div ref="root" class="VPFlyout club-flyout" :class="{ 'is-ready': ready }" @pointerenter="$event.pointerType === 'mouse' && enter()" @pointerleave="$event.pointerType === 'mouse' && leave()" @focusin="!keyboardClose && trigger?.matches(':focus-visible') && setOpen(true)" @focusout="focusOut" @keydown="keydown">
    <button ref="trigger" type="button" class="button" aria-haspopup="true" :aria-expanded="opened" :aria-label="label" @click="setOpen(!opened)">
      <span v-if="button || icon" class="text"><span v-if="icon" :class="[icon, 'option-icon']" /><span v-if="button">{{ button }}</span><span ref="arrow" class="text-icon"><span class="vpi-chevron-down" /></span></span>
      <span v-else ref="arrow" class="vpi-more-horizontal icon" />
    </button>
    <div ref="menu" class="menu" :class="{ 'is-open': opened }" :inert="ready && !opened" @click="($event.target as HTMLElement).closest('a') && setOpen(false)"><VPMenu :items="items"><slot /></VPMenu></div>
  </div>
</template>

<style scoped>
.club-flyout { position: relative; }
.button { display: flex; align-items: center; padding: 0 12px; height: var(--vp-nav-height); color: var(--vp-c-text-1); }
.text { display: flex; align-items: center; font-size: 14px; font-weight: 400; }
.text-icon { display: inline-flex; margin-left: 4px; font-size: 14px; }
.icon { font-size: 20px; }
.option-icon { font-size: 16px; }
.button:hover, .button[aria-expanded="true"], .active .button { color: var(--mag-accent); }
.button:focus-visible { outline: 2px solid var(--mag-accent); outline-offset: -6px; border-radius: 10px; }
.menu { position: absolute; top: calc(var(--vp-nav-height) - 8px); right: 0; opacity: 0; visibility: hidden; transform-origin: 80% 0; pointer-events: none; }
.menu.is-open { pointer-events: auto; }
.club-flyout:not(.is-ready):is(:hover, :focus-within) .menu { opacity: 1; visibility: visible; pointer-events: auto; }
.menu::before { content: ''; position: absolute; inset: -12px 0 auto; height: 14px; }
</style>
