import {EXT, SEP, resolvePath} from './path.js'
import {DistributedFilesURL} from './url.js'

const DUMMY_APP = 'http://example.com'

export function parseEntry (url, isApp = false) {
  if (url instanceof DistributedFilesEntry) {
    return new DistributedFilesEntry(url.app, url.location)
  }
  url = new URL(url)
  let app = isApp ? url : DUMMY_APP
  let location = isApp ? 'dat:/' + url.pathname : url
  return new DistributedFilesEntry(app, location)
}

export function resolveEntry (location, cwd, home) {
  let entry = new DistributedFilesEntry(DUMMY_APP, cwd.href)
  entry.location = resolvePath(location, cwd, home)
  return entry
}

export class DistributedFilesEntry extends DistributedFilesURL {
  constructor (app, location) {
    console.warn('DistributedFilesEntry is deprecated, use DistributedFilesURL instead')

    super(app)
    this.location = location
    this.unsaved = false
  }

  open () {
    try {
      window.open(this.app === DUMMY_APP ? this.location : this.href)
    } catch (err) {
      return new Error(err)
    }
  }

  async isDirectory () {
    try {
      let stat = await this.archive.stat(this.path)
      return stat.isDirectory()
    } catch (err) {
      if (err.name === 'NotFoundError') {
        return false
      }
      throw err
    }
  }

  async isFile () {
    try {
      let stat = await this.archive.stat(this.path)
      return stat.isFile()
    } catch (err) {
      if (err.name === 'NotFoundError') {
        return false
      }
      throw err
    }
  }

  async read () {
    return this.archive.readFile(this.path)
  }

  async write (contents) {
    this.archive.writeFile(this.path, contents)
    this.unsaved = false
  }

  get app () {
    return this.origin
  }

  set app (url) {
    url = url instanceof URL ? url : new URL(url)
    this.host = url.host
    this.protocol = url.protocol
  }

  get base () {
    return this.path.split(SEP).pop()
  }

  get ext () {
    let match = this.path.match(EXT)
    return match ? match[1] : null
  }

  get name () {
    return this.base.replace(EXT, '')
  }

  get parent () {
    return this.path.split(SEP).slice(0, -1).join(SEP)
  }
}