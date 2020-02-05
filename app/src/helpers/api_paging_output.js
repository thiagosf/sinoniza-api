/**
 * Saida da api com paginacao
 * @param {object} data
 * @param {object} paging
 * @param {boolean} [success=true]
 * @returns {<object>}
 */
const apiPagingOutput = (data, paging, success = true) => {
  return { success, data, paging }
}

export default apiPagingOutput
