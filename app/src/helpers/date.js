import moment from 'moment'

const date = {
  /**
   * Formata data
   * @param {string} date
   * @returns {string}
   */
  formatDatetime (date) {
    return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
  }
}

export default date
