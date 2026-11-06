import { globSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

const sourcePatterns = ['.vitepress/theme/**/*.vue', '.vitepress/theme/**/*.ts', 'docs/**/*.md']
const iconStylesheet = '/@tabler/icons-webfont/dist/tabler-icons.min.css'

export function usedIcons(root: string): Set<string> {
  return new Set(sourcePatterns.flatMap(pattern => globSync(pattern, { cwd: root }))
    .flatMap(file => [...readFileSync(resolve(root, file), 'utf8').matchAll(/\bti-[a-z0-9-]+\b/g)].map(match => match[0])))
}

export function pruneIcons(css: string, icons: ReadonlySet<string>): string {
  return css.replace(/\.(ti-[a-z0-9-]+):before\s*\{[^}]*\}/g, (rule, icon: string) => icons.has(icon) ? rule : '')
}

/** Keep the upstream font subsets and license; ship only referenced glyph rules. */
export function contentIcons(root: string): Plugin {
  let icons = usedIcons(root)
  return {
    name: 'club-content-icons',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes(iconStylesheet)) return pruneIcons(code, icons)
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (!/\.(md|vue|ts)$/.test(file) || file.includes('/node_modules/')) return
        const next = usedIcons(root)
        if (next.size === icons.size && [...next].every(icon => icons.has(icon))) return
        icons = next
        for (const module of server.moduleGraph.idToModuleMap.values()) {
          if (module.id?.includes(iconStylesheet)) server.moduleGraph.invalidateModule(module)
        }
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh)
      server.httpServer?.once('close', () => {
        server.watcher.off('add', refresh).off('change', refresh).off('unlink', refresh)
      })
    }
  }
}
