import assert from './assert.js'
import isGlob from '../vendor/is-glob-v4.0.1.js'
import {joinPath} from './path.js'
import mm from '../vendor/micromatch-v3.1.10.js'

export function glob (dat, opts) {
  let glob, it
  if (typeof opts === 'string' || Array.isArray(opts)) {
    glob = opts
    opts = {}
  } else {
    assert(typeof opts === 'object', 'must pass in glob pattern or opts object')
    glob = opts.pattern
  }
  it = iterate(dat, glob, opts)
  it.collect = () => collect(it)
  return it
}

export async function* walk (dat, opts = {}) {
  let base = typeof opts === 'string' ? opts : opts.base
  let queue = [normalize(base)]

  while (queue.length) {
    let path = queue.shift()

    if (opts.depth) {
      let depth = path.replace(/^\//, '').split('/').length
      if (depth > opts.depth) continue
    }
    let stats = await dat.stat(path, opts.follow)

    if (stats.isDirectory()) {
      let items = await dat.readdir(path)
      let paths = items.map(item => path ? joinPath(path, item) : item)
      queue.push.apply(queue, paths)
      if (opts.dirs) yield path + '/'
    } else {
      yield path
    }
  }
}

export function depth (pattern) {
  assert(typeof pattern === 'string', 'glob pattern must be string')
  let parts = pattern.split('/')

  if (parts.includes('**')) {
    return Infinity
  }
  return parts.length
}

export function parent (glob) {
  let parts = glob.split('/')
  let part, parent = ''

  for (part of parts) {
    if (isGlob(part)) return parent
    parent = parent
      ? joinPath(parent, part)
      : part
  }
  return parent
}

export {default as match} from '../vendor/micromatch-v3.1.10.js'
export {default as isGlob} from '../vendor/is-glob-v4.0.1.js'

/**
 * Private helpers
 */
async function* iterate (dat, glob, opts) {
  assert(typeof glob === 'string' || Array.isArray(glob), 'Invalid glob pattern')

  let file, base = Array.isArray(glob) ? '' : parent(glob)
  let walkOpts = Object.assign({ base }, opts)
  if (!Array.isArray(glob)) {
    walkOpts.depth = depth(glob)
  }
  for await (file of walk(dat, walkOpts)) {
    if (mm.some(file, glob)) yield file
  }
}

async function collect (it) {
  let match
  let list = []

  for await (match of it) {
    list.push(match)
  }
  return list
}

function normalize (base) {
  if (!base || base === '.' || base === '/') {
    return ''
  }
  return base
}