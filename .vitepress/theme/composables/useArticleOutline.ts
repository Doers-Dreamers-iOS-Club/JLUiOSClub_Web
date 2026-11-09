import { inject, onBeforeUnmount, onMounted, watch, type InjectionKey, type Ref } from 'vue'
import { gsap } from 'gsap'

export const articleSidebarCollapsedKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('article-sidebar-collapsed')

/** Reveal the outline only after the header leaves the reading viewport. */
export function useArticleOutline(header: Ref<HTMLElement | undefined>, panel: Ref<HTMLElement | undefined>) {
  const collapsed = inject(articleSidebarCollapsedKey)
  let media: ReturnType<typeof gsap.matchMedia> | undefined

  onMounted(() => {
    const heading = header.value
    const target = panel.value
    if (!heading || !target || !collapsed) return
    media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 1280px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      if (!context.conditions?.desktop) return
      const reduce = Boolean(context.conditions.reduce)
      const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) + 32
      let passedHeader = heading.getBoundingClientRect().bottom <= top
      let shown = false
      let tween: gsap.core.Tween | undefined
      gsap.set(target, { autoAlpha: 0, x: 14, y: 6 })
      target.inert = true
      target.dataset.state = 'hidden'

      const sync = () => {
        const next = collapsed.value && passedHeader
        if (next === shown) return
        shown = next
        tween?.kill()
        target.inert = !next
        target.dataset.state = next ? 'entering' : 'hidden'
        if (!next) {
          gsap.set(target, { autoAlpha: 0, x: 14, y: 6, clearProps: 'willChange' })
          return
        }
        tween = gsap.fromTo(target, { autoAlpha: 0, x: 14, y: 6, willChange: 'transform,opacity' }, {
          autoAlpha: 1, x: 0, y: 0, duration: reduce ? 0 : .44, ease: 'power3.out',
          clearProps: 'willChange',
          onComplete: () => { target.dataset.state = 'visible' },
        })
      }
      const observer = new IntersectionObserver(([entry]) => {
        passedHeader = entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? top)
        sync()
      }, { rootMargin: `-${top}px 0px 0px 0px`, threshold: 0 })
      observer.observe(heading)
      const stop = watch(collapsed, sync, { flush: 'post' })
      sync()
      return () => {
        observer.disconnect()
        stop()
        tween?.kill()
        gsap.set(target, { clearProps: 'opacity,visibility,transform,willChange' })
        target.inert = true
        target.dataset.state = 'hidden'
      }
    })
  })
  onBeforeUnmount(() => media?.revert())
}
