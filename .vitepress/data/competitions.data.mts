import { createRecordLoader } from './createRecordLoader'
import type { RecordEntry } from './shared'

declare const data: RecordEntry[]
export { data }
export default createRecordLoader('competitions')
