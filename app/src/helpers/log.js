import path from 'path'
import moment from 'moment'
import _ from 'lodash'
import winston from 'winston'

/**
 * Log centralizado
 * @param {string} name
 * @param {string} message
 * @param {object} [options]
 */
const log = (name, message, options = {}) => {
  try {
    let level = name
    const valids = [
      'error',
      'warn',
      'info',
      'verbose',
      'debug',
      'silly'
    ]
    if (!valids.includes(name)) {
      level = 'debug'
    }
    const logger = winston.createLogger({
      level,
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, '../../logs', `${name}.log`)
        })
      ]
    })
    if (!_.isObject(options)) {
      options = { options }
    }
    options.date = moment.utc()
    logger.log(level, message, { data: options })
  } catch (error) {
    console.log('@logError:', error)
  }
}

export default log
