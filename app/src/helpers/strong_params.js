import _ from 'lodash'

/**
 * Strong params
 * @param {object} data
 * @param {string[]} permited
 * @returns {Promise}
 */
const strongParams = (data, permited) => {
  return _.pick(data, permited)
}

export default strongParams
