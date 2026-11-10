import type { Plugin } from 'vite'

/** VitePress 1.6.x leaves a debounced outline update queued after unmount. */
export function outlineLifecycle(): Plugin {
  return {
    name: 'club-outline-lifecycle',
    enforce: 'pre',
    transform(code, id) {
      if (!id.split('?')[0].endsWith('/vitepress/dist/client/theme-default/composables/outline.js')) return
      const activation = 'function activateLink(hash) {'
      if (!code.includes(activation)) {
        this.error('VitePress outline implementation changed; review the outline lifecycle compatibility guard.')
      }
      // Keep native heading selection, marker styles and timing. Queued updates
      // are harmless once either template ref has been cleared during unmount.
      return code.replace(activation, `${activation}\n        if (!container.value || !marker.value) return;`)
    },
  }
}
