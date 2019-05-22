import {depth, glob, parent, walk} from '../modules/glob.js'

const key = new URL(import.meta.url).hostname

export function glob_depth (t) {
  let cases = [
    "depth('arf/barf/**/*.md') === Infinity",
    "depth('arf/barf/af.{md.txt}') === 3",
    "depth('arf/barf/*.txt') === 3",
    "depth('*') === 1"
  ]

  cases.forEach(c => t.ok(eval(c), c))
  t.end()
}

export function glob_parent (t) {
  let cases = [
    "parent('**/gnarf/blarf.md') === ''",
    "parent('arf/barf/gnarf.txt') === 'arf/barf/gnarf.txt'",
    "parent('arf/barf/*.txt') === 'arf/barf'",
    "parent('arf/barf/gnarf.{txt,md}') === 'arf/barf'",
    "parent('arf/**/blarf.txt') === 'arf'"
  ]

  cases.forEach(c => t.ok(eval(c), c))
  t.end()
}

export async function walk_deep (t) {
  let dat = await DatArchive.load(key)
  let file, walked = []

  for await (file of walk(dat)) {
    t.ok(await dat.stat(file), 'walked: ' + file)
    walked.push(file)
  }

  t.ok(walked.includes('dat.json'), 'includes dat.json')
  t.ok(walked.includes('modules/glob.js'), 'includes modules/glob.js')
  t.end()
}

export async function walk_folder (t) {
  let dat = await DatArchive.load(key)
  let file, walked = []

  for await (file of walk(dat, {depth: 1})) {
    t.ok(file.split('/').length === 1, 'walked: ' + file)
  }
  t.end()
}

export async function walk_glob (t) {
  let dat = await DatArchive.load(key)
  let json = await glob(dat, '*.json').collect()
  t.ok(json.includes('dat.json'), 'find dat.json')
  t.ok(json.length === 1, 'only one json file')

  for await (let file of glob(dat, '**/*.js')) {
    t.ok(file.endsWith('.js'), 'find js: ' + file)
  }
  t.end()
}