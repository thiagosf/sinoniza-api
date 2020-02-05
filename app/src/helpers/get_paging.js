/**
 * Retorna limit e offset
 * @param {object} query
 * @returns {<object>}
 */
const getPaging = query => {
  let page = parseInt(query.page || 1)
  if (page <= 0) page = 1
  const limit = parseInt(query.limit || 10)
  const offset = limit * (page - 1)
  return { limit, offset, page }
}

export default getPaging
