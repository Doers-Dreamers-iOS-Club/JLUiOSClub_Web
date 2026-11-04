import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { pathToFile } from 'vitepress/dist/client/app/utils.js'
import { gsap } from 'gsap'

/** Page-level motion; the router still owns links, history, hashes and scrolling. */
export function useRouteMotion() {
  const router = useRouter()
  let dispose = () => {}
  onBeforeUnmount(() => dispose())
  onMounted(() => {
    const before = router.onBeforePageLoad
    const loaded = router.onAfterPageLoad
    const after = router.onAfterRouteChange
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const html = document.documentElement
    const progress = document.createElement('div')
    progress.className = 'club-route-progress'
    progress.setAttribute('aria-hidden', 'true')
    document.body.append(progress)
    let content: HTMLElement | null = null
    let motion: gsap.core.Tween | undefined, barMotion: gsap.core.Tween | undefined
    let releaseExit: (() => void) | undefined
    let target = '', generation = 0, navigation = 0, watchdog = 0
    const preloads = new Set<HTMLLinkElement>()
    const pathname = (href: string) => new URL(href, location.href).pathname
    const phase = (value: string) => { html.dataset.routeTransition = value }
    function stopTween() {
      motion?.kill(); motion = undefined
      releaseExit?.(); releaseExit = undefined
    }
    function clear() {
      ++generation; clearTimeout(watchdog); stopTween(); barMotion?.kill()
      if (content) {
        gsap.set(content, { clearProps: 'opacity,transform,willChange' })
        content.removeAttribute('aria-busy')
      }
      gsap.set(progress, { scaleX: 0, opacity: 0 })
      delete html.dataset.routeTransition
      target = ''
      preloads.forEach(link => link.remove()); preloads.clear()
    }
    function preload(href: string) {
      // Only the requested route: begin downloading while its predecessor exits.
      // VitePress uses the same path resolver, so the import reuses this request.
      if (import.meta.env.DEV) return
      const file = pathToFile(pathname(href))
      if (!file) return
      const link = document.createElement('link')
      link.rel = 'modulepreload'; link.href = file; link.crossOrigin = ''
      preloads.add(link); document.head.append(link)
    }
    const begin = async (href: string) => {
      if ((await before?.(href)) === false) return false
      const request = ++navigation
      if (preference.matches || !router.route.component || pathname(href) === router.route.path) {
        clear(); return
      }
      // A VitePress retry should reuse the same exit, not restart it.
      if (target === href && html.dataset.routeTransition === 'loading') return
      clear()
      content = document.querySelector<HTMLElement>('.VPContent')
      if (!content) return
      target = href
      const current = generation
      preload(href)
      phase('leaving'); content.setAttribute('aria-busy', 'true')
      gsap.set(content, { willChange: 'transform,opacity' })
      barMotion = gsap.fromTo(progress, { scaleX: 0, opacity: .65 }, { scaleX: .82, duration: 1.2, ease: 'power2.out' })
      // Keep a readable previous page while a slow destination is loading.
      watchdog = window.setTimeout(clear, 5000)
      await new Promise<void>(resolve => {
        releaseExit = resolve
        motion = gsap.to(content, { opacity: .28, y: -10, duration: .18, ease: 'power2.inOut', onComplete: resolve })
      })
      if (request !== navigation) return false
      // Reduced motion, tab suspension or the watchdog must restore visibility
      // without cancelling the navigation that the reader already requested.
      if (current !== generation) return
      releaseExit = undefined
      phase('loading')
    }
    const ready = (href: string) => {
      // This hook must stay synchronous: VitePress has already checked that this
      // is the latest response. Awaiting here could let an obsolete page commit.
      const result = loaded?.(href)
      if (target === href && content && !preference.matches) {
        stopTween()
        gsap.set(content, { opacity: 0, y: 0 })
        phase('swapping')
      }
      return result
    }
    const enter = async (href: string) => {
      await after?.(href)
      if (target !== href) return
      const current = generation
      await nextTick()
      if (current !== generation) return
      content = document.querySelector<HTMLElement>('.VPContent')
      if (!content || preference.matches || content.querySelector('.club-home.is-intro')) { clear(); return }
      clearTimeout(watchdog); stopTween(); barMotion?.kill()
      phase('entering')
      // Homepage canvas/intro coordinates are measured on mount: never translate
      // that ancestor while the shared ASCII canvas is finding its targets.
      const distance = content.querySelector('.club-home') ? 0 : 18
      barMotion = gsap.to(progress, { scaleX: 1, opacity: 0, duration: .3, ease: 'power2.out' })
      motion = gsap.fromTo(content, { opacity: 0, y: distance }, {
        opacity: 1, y: 0, duration: .48, ease: 'power3.out',
        onComplete: () => { if (current === generation) clear() }
      })
    }
    router.onBeforePageLoad = begin
    router.onAfterPageLoad = ready
    router.onAfterRouteChange = enter
    preference.addEventListener('change', clear)
    document.addEventListener('visibilitychange', onVisibility)
    function onVisibility() { if (document.hidden) clear() }
    dispose = () => {
      clear(); progress.remove()
      preference.removeEventListener('change', clear)
      document.removeEventListener('visibilitychange', onVisibility)
      if (router.onBeforePageLoad === begin) router.onBeforePageLoad = before
      if (router.onAfterPageLoad === ready) router.onAfterPageLoad = loaded
      if (router.onAfterRouteChange === enter) router.onAfterRouteChange = after
    }
  })
}
