/**
 * Adiciona metodo toJSON para usar com JSON.stringify
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Error"] }] */
if (!('toJSON' in Error.prototype)) {
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      let alt = {}
      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key]
      }, this)
      return alt
    },
    configurable: true,
    writable: true
  })
}
