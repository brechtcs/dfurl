import {parseUrl} from '../modules/url.js'

export function url_basic (t) {
  let cwd = parseUrl('dat://example.com/beakerbrowser.com+preview/index.html')
  t.ok(cwd.location === 'dat://beakerbrowser.com+preview/index.html', 'constructor: check location')
  t.ok(cwd.archive.url === 'dat://beakerbrowser.com+preview', 'constructor: check archive')
  t.ok(cwd.key === 'beakerbrowser.com', 'constructor: check key')
  t.ok(cwd.version === 'preview', 'constructor: check version')
  t.ok(cwd.path === 'index.html', 'constructor: check path')

  cwd.key = 'dterm.hashbase.io'
  t.ok(cwd.key === 'dterm.hashbase.io', 'key setter: check value')
  t.ok(cwd.location === 'dat://dterm.hashbase.io/index.html', 'key setter: check location')
  t.ok(cwd.archive.url === 'dat://dterm.hashbase.io', 'key setter: check archive')
  t.ok(cwd.version === undefined, 'key setter: check version')
  t.ok(cwd.path === 'index.html', 'key setter: check path')
  t.ok(cwd.href === 'dat://example.com/dterm.hashbase.io/index.html', 'key setter: check href')

  cwd.version = 'preview'
  t.ok(cwd.version === 'preview', 'version setter: check version')
  t.ok(cwd.location === 'dat://dterm.hashbase.io+preview/index.html', 'version setter: check location')
  t.ok(cwd.archive.url === 'dat://dterm.hashbase.io+preview', 'version setter: check archive')
  t.ok(cwd.href === 'dat://example.com/dterm.hashbase.io+preview/index.html', 'version setter: check href')

  cwd.version = 'latest'
  t.ok(cwd.version === undefined, 'version unset: drop latest')
  t.ok(cwd.href === 'dat://example.com/dterm.hashbase.io/index.html', 'version unset: check href')
  t.ok(cwd.location === 'dat://dterm.hashbase.io/index.html', 'version unset: check location')

  cwd.path = 'dat.json'
  t.ok(cwd.href === 'dat://example.com/dterm.hashbase.io/dat.json', 'path setter: check href')
  t.ok(cwd.location === 'dat://dterm.hashbase.io/dat.json', 'path setter: check location')
  cwd.path = '/absolute.txt'
  t.ok(cwd.href === 'dat://example.com/dterm.hashbase.io/absolute.txt', 'path setter: handle absolute')

  cwd.location = 'dat://beakerbrowser.com+preview/index.html'
  t.ok(cwd.archive.url === 'dat://beakerbrowser.com+preview', 'location setter: check archive')
  t.ok(cwd.key === 'beakerbrowser.com', 'location setter: check key')
  t.ok(cwd.version === 'preview', 'location setter: check version')
  t.ok(cwd.path === 'index.html', 'location setter: check path')
  t.end()
}
