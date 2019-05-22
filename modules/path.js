import assert from './assert.js'

export const EXT = /\.([\w]+)$/
export const SEP = '/'

export function joinPath (...args) {
  assert(args.length, 'must pass in path arguments to join')
  let {parts, protocol, root} = parseArgs(args)
  let i, next, path = root ? [''] : []

  for (i = 0; i < parts.length; i++) {
    next = parts[i]

    if (skip(next)) {
      if (next === '..') path.pop()
      continue
    }

    if (next.startsWith('/')) {
      next = next.slice(1)
    }
    if (next.endsWith('/')) {
      next = next.slice(0, -1)
    }
    path.push(next)
  }

  return protocol + path.join('/')
}

export function relativePath (from, to) {
  let fromParts = from ? from.split('/') : []
  let toParts = to ? to.split('/') : []
  let relParts = []
  let baseCount = 0

  for (let i = 0; i < toParts.length; i++) {
    if (fromParts[i] !== toParts[i]) {
      break
    }
    baseCount++
  }
  for (let i = 0; i < fromParts.length - baseCount; i++) {
    relParts.push('..')
  }

  return relParts.concat(toParts.slice(baseCount)).join('/')
}

export function resolvePath (path, cwd, home) {
  if (path.startsWith('dat://')) {
    return path
  } else if (path.startsWith('/')) {
    return joinPath(cwd.archive.url, path)
  } else if (path.startsWith('~')) {
    if (!home) throw new Error('home dat required to resolve paths starting with ~')
    path = path.replace(/^~/, '')
    return joinPath(home.archive.url, path)
  } else {
    return joinPath(cwd.archive.url, cwd.path, path)
  }
}

/**
 * Private helpers
 */
const PROTO_REGEX = /^\w+\:\/\//

function parseArgs (args) {
  let parts, root, protocol = ''

  if (PROTO_REGEX.test(args[0])) {
    protocol = args[0].match(PROTO_REGEX)[0]
    args[0] = args[0].replace(PROTO_REGEX, '')
  }
  root = args[0].startsWith('/')
  parts = args.map(split).flat().filter(empty)

  return {parts, protocol, root}
}

function split (arg) {
  assert(typeof arg === 'string', 'path arguments must be strings')
  return arg.split('/')
}

function empty (part) {
  return part !== ''
}

function skip (part) {
  return part === '' || part === '.' || part === '..'
}
