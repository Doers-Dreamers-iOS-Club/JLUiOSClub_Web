import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { usedIcons, pruneIcons } from '../.vitepress/plugins/icons.ts'

test('retain every source icon while removing unused glyph rules', () => {
  const css = readFileSync('node_modules/@tabler/icons-webfont/dist/tabler-icons.min.css', 'utf8')
  const icons = usedIcons(process.cwd())
  const result = pruneIcons(css, icons)
  for (const icon of icons) assert(result.includes(`.${icon}:before`), `Unknown icon: ${icon}`)
  assert(result.includes('@font-face'))
  assert(result.includes('License'))
  assert(result.includes('.ti{'))
  assert(result.length < css.length / 3)
  assert.equal(pruneIcons(result, icons), result)
})
