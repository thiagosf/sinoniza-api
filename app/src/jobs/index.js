// import schedule from 'node-schedule'

const jobs = {
  /**
   * Instala jobs
   * @param {object} options
   * @param {object} options.models
   * @returns {Promise}
   */
  install ({ models }) {
    this.jobs = []

    // this.jobs.push(
    //   schedule.scheduleJob('0 * * * *', () => {
    //     console.log('hello')
    //   })
    // )
  },

  /**
   * Retorna se nao existe jobs em andamento
   * @returns {Promise}
   */
  stop () {
    const promises = this.jobs.map(job => {
      return Promise.all([
        job.cancel(),
        job.cancelNext()
      ])
    })
    return Promise.all(promises).then((r) => console.log(r))
  }
}

export default jobs
