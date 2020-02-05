import i18n from 'i18n'
import path from 'path'

i18n.configure({
  defaultLocale: 'pt-BR',
  locales: ['pt-BR', 'en'],
  directory: path.join(__dirname, '../locales'),
  queryParameter: 'locale',
  updateFiles: false
})

export default i18n

/**
 * Traducao
 * @param {string} text
 * @param {object} params
 * @returns {string}
 */
export const translate = (text, params = {}) => {
  return i18n.__(text, params)
}
