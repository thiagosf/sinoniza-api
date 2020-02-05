import home from './home'

export default {
  configure (path, router) {
    router.get(path, home)
  }
}
