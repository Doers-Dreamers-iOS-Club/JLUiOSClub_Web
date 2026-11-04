import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { gsap } from 'gsap'
import { introAscii } from './introAscii'

export function useHomeIntro(root: Ref<HTMLElement | null>) {
  const playing = ref(false)
  let dispose = () => {}
  onBeforeUnmount(() => dispose())
  onMounted(async () => {
    const host = root.value
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    if (!host || motion.matches || (location.hash && location.hash !== '#index')) return
    const poem = host.querySelector<HTMLElement>('.club-opening__poem')!
    const targets = Array.from(poem.querySelectorAll<HTMLElement>('.club-opening__i, .club-opening__dwell > span, .club-opening__possibility'))
    let alive = true
    let layer: HTMLElement | undefined
    let timeline: gsap.core.Timeline | undefined
    let fontTimer = 0
    playing.value = true
    host.classList.add('is-intro')
    const finish = () => {
      alive = false
      timeline?.kill()
      clearTimeout(fontTimer)
      clearTimeout(watchdog)
      layer?.remove()
      host.classList.remove('is-intro')
      host.style.removeProperty('--intro-hero-opacity')
      playing.value = false
      window.removeEventListener('resize', finish)
      window.removeEventListener('hashchange', finish)
      window.removeEventListener('keydown', key)
      motion.removeEventListener('change', finish)
    }
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') finish() }
    const watchdog = window.setTimeout(finish, 6500)
    dispose = finish
    window.addEventListener('resize', finish)
    window.addEventListener('hashchange', finish)
    window.addEventListener('keydown', key)
    motion.addEventListener('change', finish)
    try {
      layer = document.createElement('div')
      layer.className = 'club-intro'
      layer.setAttribute('aria-hidden', 'true')
      host.append(layer)
      const fontSize = Math.min(innerWidth * .064, 94)
      const source = document.createElement('div')
      source.className = 'club-intro__source'
      source.style.fontSize = `${fontSize}px`
      const words = ['I', 'dwell', 'in', 'Possibility']
      words.forEach(text => {
        const word = document.createElement('span')
        word.textContent = text
        source.append(word)
      })
      layer.append(source)
      // Show the slogan immediately; font loading and WebGL never block it.
      await Promise.race([document.fonts.load('48px "Club Instrument Serif"'), new Promise(resolve => { fontTimer = window.setTimeout(resolve, 650) })])
      if (!alive) return
      const sources = Array.from(source.children).map(el => el.getBoundingClientRect())
      const clones = targets.map((target, index) => {
        const box = target.getBoundingClientRect()
        const style = getComputedStyle(target)
        const clone = target.cloneNode(true) as HTMLElement
        clone.removeAttribute('class')
        Object.assign(clone.style, { position: 'absolute', left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px`, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, whiteSpace: 'nowrap', transformOrigin: '0 0' })
        // Preserve the deliberately spaced final y without relying on scoped selectors.
        if (index === 3 && clone.firstElementChild) {
          const y = clone.firstElementChild as HTMLElement
          Object.assign(y.style, { display: 'inline-block', marginLeft: '.035em', letterSpacing: '0' })
        }
        layer!.append(clone)
        return { clone, box, scale: fontSize / parseFloat(style.fontSize), source: sources[index] }
      })
      const last = clones[3].clone
      const fill = last.cloneNode(true) as HTMLElement
      Object.assign(fill.style, { position: 'absolute', left: '0', top: '0', webkitTextStroke: '0', webkitTextFillColor: 'currentColor' })
      const texture = introAscii(last)
      last.style.webkitTextFillColor = 'transparent'
      last.style.webkitTextStroke = '1px currentColor'
      last.append(fill)
      if (texture) last.append(texture)
      const echoes = [-2, -1, 1, 2].map(row => {
        const echo = source.cloneNode(true) as HTMLElement
        echo.classList.add('club-intro__echo')
        echo.replaceChildren()
        for (const char of words.join(' ')) {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00a0' : char
          echo.append(span)
        }
        layer!.append(echo)
        gsap.set(echo, { y: row * fontSize * 1.05, opacity: 0 })
        return echo
      })
      source.remove()
      clones.forEach(({ clone, box, scale, source }) => gsap.set(clone, { x: source.left - box.left, y: source.top - box.top + (source.height - box.height * scale) / 2, scale }))
      timeline = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: finish })
      echoes.forEach((echo, index) => {
        timeline!.to(echo, { opacity: .16, duration: .35 }, .2 + index * .05)
        timeline!.from(echo.children, { yPercent: i => i % 2 ? 80 : -80, opacity: 0, stagger: .012, duration: .55 }, .18 + index * .06)
        timeline!.to(echo, { opacity: 0, y: (index < 2 ? -1 : 1) * fontSize * 3, duration: .65 }, 1.0 + index * .04)
      })
      timeline.addLabel('settle', 1.0)
      clones.forEach(({ clone }, index) => timeline!.to(clone, { x: 0, y: 0, scale: 1, duration: 1.15 }, `settle+=${index * .07}`))
      timeline.to(fill, { opacity: 0, duration: .9, ease: 'sine.inOut' }, 1.95)
      if (texture) {
        timeline.to(texture, { opacity: .95, duration: .55, ease: 'sine.out' }, 1.95)
        timeline.to(texture, { opacity: 0, duration: .85, ease: 'sine.inOut' }, 2.65)
      }
      timeline.to(host, { '--intro-hero-opacity': 1, duration: .85, ease: 'sine.inOut' }, 2.85)
    } catch (error) {
      console.warn('Home intro skipped:', error)
      finish()
    }
  })
  return { playing }
}
