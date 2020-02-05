/**
 * Limpa valor
 * @param {string} value
 * @returns {string}
 */
const cleanValue = value => {
  let newValue = value.replace(/('|"|%|$|#)/, '')
  return newValue
}

export default cleanValue
