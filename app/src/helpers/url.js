import settings from '../settings'

export default {
  /**
   * Retorna URL do site
   * @param {string} path
   * @returns {string}
   */
  siteURL (path) {
    let url = settings.url.site
    if (path) {
      url += path
    }
    return url
  },

  /**
   * Retorna URL do dashboard
   * @param {string} path
   * @returns {string}
   */
  dashboardURL (path) {
    let url = settings.url.dashboard
    if (path) {
      url += path
    }
    return url
  },

  /**
   * Retorna URL do webapp
   * @param {string} path
   * @returns {string}
   */
  appURL (path) {
    let url = settings.url.app
    if (path) {
      url += path
    }
    return url
  },

  /**
   * Retorna URL da api
   * @param {string} path
   * @returns {string}
   */
  apiURL (path) {
    let url = settings.url.api
    if (path) {
      url += path
    }
    return url
  }
}
