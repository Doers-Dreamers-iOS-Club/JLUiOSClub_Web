/** Journal state and viewport ownership, independent of each illustration's timeline. */
export function observeArtworkPlayback(options: {
  targets: HTMLElement[]
  journal: HTMLElement | null
  threshold: number
  prepare: (target: HTMLElement) => void
  sync: (target: HTMLElement, playing: boolean) => void
}) {
  const { targets, journal, threshold, prepare, sync } = options
  const visible = new Set<HTMLElement>()
  const syncTarget = (target: HTMLElement) => sync(target,
    visible.has(target) && !document.hidden && journal?.dataset.coursePage !== 'cover' && !journal?.dataset.coverTransition)
  const syncAll = () => targets.forEach(syncTarget)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const target = entry.target as HTMLElement
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) visible.add(target)
      else visible.delete(target)
      syncTarget(target)
    })
  }, { threshold: [0, threshold] })
  targets.forEach(target => observer.observe(target))
  const prepareCover = () => {
    // Counter-transformed incoming panels already have their final viewport bounds.
    const incoming = targets.filter(target => {
      const bounds = target.getBoundingClientRect()
      return bounds.top < innerHeight && bounds.bottom > 0
    })
    incoming.forEach(prepare)
  }
  const state = new MutationObserver(syncAll)
  if (journal) state.observe(journal, { attributes: true, attributeFilter: ['data-course-page', 'data-cover-transition'] })
  journal?.addEventListener('course-cover-prepare', prepareCover)
  journal?.addEventListener('course-cover-settled', syncAll)
  document.addEventListener('visibilitychange', syncAll)
  return () => {
    observer.disconnect()
    state.disconnect()
    journal?.removeEventListener('course-cover-prepare', prepareCover)
    journal?.removeEventListener('course-cover-settled', syncAll)
    document.removeEventListener('visibilitychange', syncAll)
  }
}
