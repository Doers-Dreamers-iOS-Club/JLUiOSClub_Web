import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { gsap } from 'gsap'
import { introAscii, type IntroSnapshot } from './introAscii'
import { introFlight } from './introFlight'

export function useHomeIntro(root: Ref<HTMLElement | null>, snapshot: () => IntroSnapshot | null) {
  const playing = ref(false)
  let dispose = () => {}
  onBeforeUnmount(() => dispose())
  onMounted(async () => {
    const host = root.value
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const releaseBoot = () => window.dispatchEvent(new Event('club:intro-ready'))
    if (!host || document.documentElement.dataset.clubIntroSkipped || motion.matches || (location.hash && location.hash !== '#index')) { releaseBoot(); return }
    const poem = host.querySelector<HTMLElement>('.club-opening__poem')!
    const targets = Array.from(poem.querySelectorAll<HTMLElement>('.club-opening__i, .club-opening__dwell > span, .club-opening__possibility'))
    let alive = true
    let layer: HTMLElement | undefined
    let timeline: gsap.core.Timeline | undefined
    let fontTimer = 0
    let targetTimer = 0
    playing.value = true
    host.classList.add('is-intro')
    const finish = () => {
      alive = false
      timeline?.kill()
      clearTimeout(fontTimer)
      clearTimeout(targetTimer)
      releaseBoot()
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
    const watchdog = window.setTimeout(finish, 9500)
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
      const fontSize = Math.min(innerWidth * .092, 132)
      const source = document.createElement('div')
      source.className = 'club-intro__source'
      source.style.fontSize = `${fontSize}px`
      const words = ['I', 'dwell', 'in', 'Possibility']
      words.forEach(text => {
        const word = document.createElement('span')
        for (const char of text) {
          const letter = document.createElement('span')
          letter.textContent = char
          letter.className = 'club-intro__letter'
          word.append(letter)
        }
        source.append(word)
      })
      layer.append(source)
      // Show the slogan immediately; font loading and WebGL never block it.
      await Promise.race([document.fonts.load('48px "Club Instrument Serif"'), new Promise(resolve => { fontTimer = window.setTimeout(resolve, 650) })])
      if (!alive) return
      releaseBoot()
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
      const ascii = introAscii(last)
      const texture = ascii?.canvas
      last.style.webkitTextFillColor = 'transparent'
      last.style.webkitTextStroke = '1px currentColor'
      last.append(fill)
      if (texture) last.append(texture)
      const echoes = [-2, -1, 1, 2].map(row => {
        const echo = source.cloneNode(true) as HTMLElement
        echo.classList.add('club-intro__echo')
        echo.replaceChildren()
        for (const char of (words.join(' ') + '   ').repeat(3)) {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00a0' : char
          echo.append(span)
        }
        layer!.append(echo)
        gsap.set(echo, { y: row * fontSize * 1.05, opacity: 0 })
        return echo
      })
      gsap.set(clones.map(item => item.clone), { opacity: 0 })
      clones.forEach(({ clone, box, scale, source }) => gsap.set(clone, { x: source.left - box.left, y: source.top - box.top + (source.height - box.height * scale) / 2, scale }))
      timeline = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: finish })
      timeline.from(source.querySelectorAll('.club-intro__letter'), { yPercent: i => i % 2 ? 115 : -115, rotationX: i => i % 2 ? -80 : 80, opacity: 0, stagger: .018, duration: .7 }, 0)
      echoes.forEach((echo, index) => {
        timeline!.to(echo, { opacity: index % 2 ? .23 : .12, duration: .4 }, .15 + index * .06)
        timeline!.from(echo.children, { yPercent: i => i % 2 ? 110 : -110, opacity: 0, stagger: { each: .009, from: 'center' }, duration: .55 }, .2 + index * .06)
        timeline!.to(echo, { x: (index % 2 ? -1 : 1) * fontSize * 1.7, duration: 1.25, ease: 'power2.inOut' }, .3)
        timeline!.to(echo, { opacity: 0, y: (index < 2 ? -1 : 1) * fontSize * 3.5, duration: .65 }, 1.25 + index * .04)
      })
      timeline.set(source, { opacity: 0 }, 1.2)
      timeline.set(clones.map(item => item.clone), { opacity: 1 }, 1.2)
      timeline.addLabel('settle', 1.35)
      clones.forEach(({ clone }, index) => timeline!.to(clone, { x: 0, y: 0, scale: 1, duration: 1.1 }, `settle+=${index * .06}`))
      // The ink level falls: expose ASCII above a descending horizontal boundary.
      const water = { progress: 0 }
      const drain = () => {
        const level = -50 + (clones[3].box.height + 100) * water.progress
        fill.style.clipPath = `inset(${level}px -50px -50px -50px)`
        if (texture) texture.style.clipPath = `inset(0 0 ${100 * (1 - water.progress)}% 0)`
      }
      if (texture) texture.style.opacity = '1'
      drain()
      timeline.to(water, { progress: 1, duration: .8, ease: 'sine.inOut', onUpdate: drain }, 2.45)
      let flight: ReturnType<typeof introFlight> = null
      const travel = { progress: 0 }
      const prepareFlight = () => {
        if (!alive) return
        timeline!.pause()
        const deadline = performance.now() + 1200
        const attempt = () => {
          if (!alive) return
          let shot: IntroSnapshot | null = null
          try { shot = snapshot() } catch { /* WebGL context loss uses the bounded fallback. */ }
          const hero = host.querySelector<HTMLElement>('.mag-ascii-hero')
          if (shot?.points.length && hero && ascii?.points.length) {
            const rect = hero.getBoundingClientRect()
            const points = shot.points.map(p => ({ ...p, x: rect.left + p.x / shot.width * rect.width, y: rect.top + p.y / shot.height * rect.height, size: p.size * rect.width / shot.width }))
            const style = getComputedStyle(hero)
            flight = introFlight(layer!, ascii.points, points, style.color, style.fontFamily)
            flight?.paint(0)
            if (texture && flight) texture.style.opacity = '0'
          } else if (performance.now() < deadline && !hero?.classList.contains('is-failed')) {
            targetTimer = window.setTimeout(attempt, 60)
            return
          }
          // Slow/failed WebGL never traps the visitor in a loading cover.
          timeline!.play()
        }
        attempt()
      }
      timeline.call(prepareFlight, [], 3.3)
      timeline.to(travel, { progress: 1, duration: 1.65, ease: 'none', onUpdate: () => flight?.paint(travel.progress) }, 3.3)
      if (texture) timeline.to(texture, { opacity: 0, duration: .3 }, 4.95)
      timeline.to(host, { '--intro-hero-opacity': 1, duration: .3, ease: 'sine.inOut' }, 4.95)
      timeline.to({}, { duration: .3, onUpdate() { if (flight) flight.canvas.style.opacity = String(1 - this.progress()) } }, 4.95)
    } catch (error) {
      console.warn('Home intro skipped:', error)
      finish()
    }
  })
  return { playing }
}
