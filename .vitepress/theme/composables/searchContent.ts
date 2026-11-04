import MiniSearch from 'minisearch'
import localSearchIndex from '@localSearchIndex'

export type ContentHit = { id: string; title: string; titles: string[] }
const indexes = new Map<string, Promise<MiniSearch>>()
function plainTitle(value: string) {
  const template = document.createElement('template')
  template.innerHTML = value
  return template.content.textContent ?? ''
}
export async function searchContent(query: string, locale: string): Promise<ContentHit[]> {
  if (!indexes.has(locale)) {
    const loading = (async () => MiniSearch.loadJSON((await localSearchIndex[locale]?.())?.default, {
      fields: ['title', 'titles', 'text'], storeFields: ['title', 'titles'],
      searchOptions: { fuzzy: .2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
    }))()
    indexes.set(locale, loading)
    loading.catch(() => indexes.delete(locale))
  }
  const index = await indexes.get(locale)!
  return index.search(query).slice(0, 6).map(hit => ({
    id: String(hit.id), title: plainTitle(hit.title), titles: hit.titles.map(plainTitle)
  }))
}
