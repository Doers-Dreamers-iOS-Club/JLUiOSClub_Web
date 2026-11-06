import test from 'node:test'
import assert from 'node:assert/strict'
import { toEntries, groupByYear } from '../.vitepress/data/shared.ts'

const record = (url, frontmatter) => ({ url, frontmatter })

test('authored month dates, URL inference and undated records sort consistently', () => {
  const records = toEntries([
    record('/competitions/swift/', { title: 'Swift', date: '2024.02' }),
    record('/news/undated/', { title: 'Undated' }),
    record('/activities/251018-workshop/', { title: 'Workshop' }),
    record('/competitions/maic/', { title: 'MAIC', date: '2024.04' })
  ])
  assert.deepEqual(records.map(({ title, year, date }) => ({ title, year, date })), [
    { title: 'Workshop', year: 2025, date: '2025.10.18' },
    { title: 'MAIC', year: 2024, date: '2024.04' },
    { title: 'Swift', year: 2024, date: '2024.02' },
    { title: 'Undated', year: 0, date: '' }
  ])
  assert.equal(records[0].timestamp, Date.UTC(2025, 9, 18))
  assert.deepEqual(groupByYear(records).map(g => [g.year, g.entries.map(e => e.title)]), [
    [2025, ['Workshop']], [2024, ['MAIC', 'Swift']], [0, ['Undated']]
  ])
})

test('dates do not depend on local timezone and malformed dates fail the build', () => {
  const [entry] = toEntries([record('/news/date/', { title: 'Date', date: new Date('2024-01-01T00:00:00Z') })])
  assert.equal(entry.year, 2024)
  assert.equal(entry.date, '2024.01.01')
  assert.throws(() => toEntries([record('/news/bad/', { title: 'Bad', date: 'invalid' })]), RangeError)
})

test('grouping does not mutate records or input order', () => {
  const input = Object.freeze([Object.freeze({ year: 2024, id: 1 }), Object.freeze({ year: 2025, id: 2 }), Object.freeze({ year: 2024, id: 3 })])
  const groups = groupByYear(input)
  assert.deepEqual(groups.map(g => g.entries.map(e => e.id)), [[1, 3], [2]])
  assert.equal(groups[0].entries[0], input[0])
  assert.deepEqual(groupByYear([]), [])
})
