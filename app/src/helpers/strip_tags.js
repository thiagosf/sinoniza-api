import striptags from 'striptags'

/**
 * Remove html do valor
 * @param {string} value
 * @param {string[]} allowedTags
 * @param {string} tagReplacement
 * @returns {string}
 */
const _stripTags = (value, allowedTags = [], tagReplacement = '') => {
  return striptags(value, allowedTags, tagReplacement)
}

export default _stripTags
