import {joinPath, resolvePath} from './path.js'

const archives = new Map()

export function parseUrl (url) {
  return new DistributedFilesURL(url)
}

export function resolveUrl (location, cwd, home) {
  let url = new DistributedFilesURL(cwd)
  url.location = resolvePath(location, cwd, home)
  return url
}

export class DistributedFilesURL extends URL {
  constructor (url) {
    super(url)
  }

  get archive () {
    if (archives.has(this.key)) {
      return archives.get(this.key).checkout(this.version)
    } else {
      let archive = new DatArchive(`dat://${this.key}`)
      archives.set(this.key, archive)
      return archive.checkout(this.version)
    }
  }

  set archive (_) {
    throw new Error('dfurl.archive property is readonly')
  }

  get key () {
    let versionKey = this.pathname.split('/')[1]
    return versionKey.split('+')[0]
  }

  set key (key) {
    this.pathname = joinPath('/', key, this.path)
  }

  get location () {
    return joinPath(this.archive.url, this.path)
  }

  set location (location) {
    let url = new URL(location)
    this.pathname = joinPath('/', url.host, url.pathname)
  }

  get path () {
    return this.pathname.split('/').slice(2).join('/')
  }

  set path (path) {
    this.pathname = joinPath(this.key, path.replace(/^\//, ''))
  }

  get version () {
    let versionKey = this.pathname.split('/')[1]
    return versionKey.split('+')[1]
  }

  set version (version) {
    if (version == undefined || version === 'latest') {
      this.pathname = joinPath(this.key, this.path)
    } else {
      this.pathname = joinPath(`/${this.key}+${version}`, this.path)
    }
  }
}
