import list from './list'

export default {
  configure (path, router) {
    router.get(path, list)
  }
}
