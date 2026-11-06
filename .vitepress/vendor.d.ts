declare module 'markdown-it-implicit-figures' {
  import type { PluginWithOptions } from 'markdown-it'
  const plugin: PluginWithOptions<{ figcaption?: boolean; copyAttrs?: string }>
  export default plugin
}

declare module '@localSearchIndex' {
  const indexes: Record<string, () => Promise<{ default: string }>>
  export default indexes
}

declare module 'vitepress/dist/client/app/utils.js' {
  export function pathToFile(path: string): string
}
