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
      const top = parseFloat(getComputedStyle(target).top) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) + 32
      let passedHeader = heading.getBoundingClientRect().bottom <= top
      let shown = false
      let motion: gsap.core.Timeline | undefined
      const textNodes = new Set<HTMLElement>()
      gsap.set(target, { autoAlpha: 0, x: 12 })
      target.inert = true
      target.dataset.state = 'hidden'

      const sync = (refresh = false) => {
        const title = target.querySelector<HTMLElement>('.outline-title')
        const links = Array.from(target.querySelectorAll<HTMLElement>('.outline-link'))
        const text = title ? [title, ...links] : links
        for (const node of text) {
          if (!textNodes.has(node)) {
            gsap.set(node, { opacity: 0, y: 10 })
            textNodes.add(node)
          }
        }
        const next = collapsed.value && passedHeader && links.length > 0
        if (next === shown && !refresh) return
        shown = next
        motion?.kill()
        target.inert = !next
        const finish = () => {
          target.dataset.state = next ? 'visible' : 'hidden'
          gsap.set([target, ...text], { clearProps: next ? 'transform,willChange' : 'willChange' })
        }
        if (reduce) {
          gsap.set(target, { autoAlpha: next ? 1 : 0, x: next ? 0 : 12 })
          gsap.set(text, { opacity: next ? 1 : 0, y: next ? 0 : 10 })
          finish()
          return
        }
        target.dataset.state = next ? 'entering' : 'exiting'
        gsap.set([target, ...text], { willChange: 'transform,opacity' })
        // Tween from the current frame, so reversing a scroll never resets the text.
        motion = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finish })
          .to(target, { autoAlpha: next ? 1 : 0, x: next ? 0 : 12, duration: next ? .6 : .24 }, 0)
        if (next) {
          if (title) motion.to(title, { opacity: 1, y: 0, duration: .56 }, .04)
          motion.to(links, {
            opacity: 1, y: 0, duration: .56,
            stagger: { amount: Math.min(.22, (links.length - 1) * .035) },
          }, .1)
        } else {
          motion.to(text, { opacity: 0, y: 10, duration: .2 }, 0)
        }
      }
      const observer = new IntersectionObserver(([entry]) => {
        passedHeader = entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? top)
        sync()
      }, { rootMargin: `-${top}px 0px 0px 0px`, threshold: 0 })
      observer.observe(heading)
      // Native VitePress headings can arrive after mounting (including hash visits).
      const contentObserver = new MutationObserver(() => sync(true))
      contentObserver.observe(target, { childList: true, subtree: true })
      const stop = watch(collapsed, () => sync(), { flush: 'post' })
      sync()
      return () => {
        observer.disconnect()
        contentObserver.disconnect()
        stop()
        motion?.kill()
        gsap.set([target, ...textNodes], { clearProps: 'opacity,visibility,transform,willChange' })
        target.inert = true
        target.dataset.state = 'hidden'
      }
    })
  })
  onBeforeUnmount(() => media?.revert())
}
