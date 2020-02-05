import pAll from 'p-all'

/**
 * Executa promises em fila de acordo com a concorrencia
 * @param {Promise[]} promises
 * @param {number} [concurrency=1]
 * @returns {Promise}
 */
const queuePromises = (promises, concurrency = 1) => {
  return pAll(promises, { concurrency })
}

export default queuePromises
