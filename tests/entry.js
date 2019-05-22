import {parseEntry} from '../modules/entry.js'

export function entry_basic (t) {
  let url = 'dat://dfurl.hashbase.io/modules/dfile.js'
  let file = parseEntry(url)
  let cases = [
    "file.base === 'dfile.js'",
    "file.ext === 'js'",
    "file.name === 'dfile'",
    "file.parent === 'modules'"
  ]

  cases.forEach(c => t.ok(eval(c), c))
  t.end()
}