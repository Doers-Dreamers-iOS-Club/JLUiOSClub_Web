<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
const props = defineProps<{ text: string; reverse?: boolean }>()
const letters = computed(() => Array.from(props.text))
const root = ref<HTMLElement>()
let host: HTMLElement | null, tween: gsap.core.Tween | undefined, preference: MediaQueryList
let tracks: HTMLElement[] = []
function animate(active: boolean) {
  tween?.kill()
  tween = gsap.to(tracks, { yPercent: active ? -100 : 0, duration: preference.matches ? 0 : .5,
    ease: 'power2.out', stagger: preference.matches ? 0 : { each: .02, from: props.reverse ? 'end' : 'start' }, overwrite: true })
}
const enter = () => animate(true)
const leave = () => { if (!host?.matches(':focus-within')) animate(false) }
const blur = () => animate(false)
const reduce = () => { tween?.kill(); gsap.set(tracks, { yPercent: host?.matches(':hover, :focus-within') ? -100 : 0 }) }
onMounted(() => {
  host = root.value?.closest('a') ?? null
  tracks = [...root.value!.querySelectorAll<HTMLElement>('.roll-track')]
  preference = matchMedia('(prefers-reduced-motion: reduce)'); preference.addEventListener('change', reduce)
  host?.addEventListener('mouseenter', enter); host?.addEventListener('mouseleave', leave)
  host?.addEventListener('focus', enter); host?.addEventListener('blur', blur)
})
onBeforeUnmount(() => {
  tween?.kill(); preference?.removeEventListener('change', reduce)
  host?.removeEventListener('mouseenter', enter); host?.removeEventListener('mouseleave', leave)
  host?.removeEventListener('focus', enter); host?.removeEventListener('blur', blur)
})
</script>
<template><span ref="root" class="roll-text"><span class="roll-accessible">{{ text }}</span><span aria-hidden="true"><span v-for="(letter, i) in letters" :key="i" class="roll-cell"><span class="roll-track">{{ letter }}</span></span></span></span></template>
<style scoped>
.roll-cell { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1.4; }
.roll-track { display: block; white-space: pre; color: var(--mag-text); text-shadow: 0 1.4em 0 var(--mag-accent); }
.roll-accessible { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (forced-colors: active) { .roll-accessible { position: static; width: auto; height: auto; clip-path: none; } .roll-text > [aria-hidden] { display: none; } }
</style>
