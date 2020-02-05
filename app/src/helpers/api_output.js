/**
 * Saida da api
 * @param {object} data
 * @param {boolean} [success=true]
 * @returns {<object>}
 */
const apiOutput = (data, success = true) => {
  return { success, data }
}

export default apiOutput
