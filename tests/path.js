import {joinPath, relativePath} from '../modules/path.js'

export function join (t) {
  let cases = [
    "joinPath('dat://example.com', 'arf') === 'dat://example.com/arf'",
    "joinPath('/arf/barf', 'gnarf') === '/arf/barf/gnarf'",
    "joinPath('/', 'yarf/gnarf') === '/yarf/gnarf'",
    "joinPath('arf/barf', 'gnarf') === 'arf/barf/gnarf'",
    "joinPath('arf/barf', '/gnarf') === 'arf/barf/gnarf'",
    "joinPath('arf/barf/', '/gnarf') === 'arf/barf/gnarf'",
    "joinPath('arf/barf', 'yarf', 'gnarf') === 'arf/barf/yarf/gnarf'",
    "joinPath('arf', '../yarf/barf') === 'yarf/barf'",
    "joinPath('', 'gnarf/barf') === 'gnarf/barf'"
  ]

  cases.forEach(c => t.ok(eval(c), c))
  t.end()
}

export function relative (t) {
  let cases = [
    "relativePath('arf/barf/gnarf', 'arf/yarf/blarf') === '../../yarf/blarf'",
    "relativePath('barf/gnarf', 'arf/yarf') === '../../arf/yarf'",
    "relativePath('barf/gnarf/yarf', 'barf/gnarf') === '..'",
    "relativePath('', 'ping/pong') === 'ping/pong'"
  ]

  cases.forEach(c => t.ok(eval(c), c))
  t.end()
}