import Bull from 'bull'
import models from '../models'
import * as utils from '../helpers'
import { NotificationServiceSendFactory } from '../services'

const redisURL = process.env.DATABASE_REDIS_URL

/**
 * Converte string em milissegundos
 * @param {string} delayString
 * @returns {number}
 */
const toMilliseconds = (delayString) => {
  let delay = 1000
  let [time, value] = delayString.split(' ')
  time = parseInt(time)
  switch (value) {
    case 'day':
    case 'days':
      delay = 1000 * 60 * 60 * 24 * time
      break

    case 'hour':
    case 'hours':
      delay = 1000 * 60 * 60 * time
      break

    case 'minute':
    case 'minutes':
      delay = 1000 * 60 * time
      break

    case 'second':
    case 'seconds':
      delay = 1000 * time
      break
  }
  return delay
}

/**
 * Envia e-mail
 * @param {object} job
 * @param {function} done
 */
const notifyEmail = (job, done) => {
  const { NotificationDelivery } = models
  notifyFactory(NotificationDelivery.SERVICE_EMAIL, job.data)
    .then(() => done())
    .catch(done)
}

/**
 * Envia sms
 * @param {object} job
 * @param {function} done
 */
const notifySms = (job, done) => {
  const { NotificationDelivery } = models
  notifyFactory(NotificationDelivery.SERVICE_SMS, job.data)
    .then(() => done())
    .catch(done)
}

/**
 * Envia push
 * @param {object} job
 * @param {function} done
 */
const notifyPush = (job, done) => {
  const { NotificationDelivery } = models
  notifyFactory(NotificationDelivery.SERVICE_PUSH, job.data)
    .then(() => done())
    .catch(done)
}

/**
 * Instancia service de notificacao e envia
 * @param {number} service
 * @param {object} data
 * @returns {Promise}
 */
const notifyFactory = (service, data) => {
  const serviceInstance = new NotificationServiceSendFactory({
    ...data,
    service
  })
  return serviceInstance.send().then(result => {
    utils.log('debug', 'notify', {
      service,
      result,
      data
    })
  }).catch(error => {
    utils.log('error', 'notify', {
      service,
      data,
      error: error.message
    })
    throw new Error(error.message)
  })
}

const actions = {
  /**
   * Todas queues
   * @param {object}
   */
  allQueues: {},

  /**
   * Cria uma fila
   * @param {object} item
   * @param {string} item.name
   * @param {number} item.concurrency
   * @param {function} item.fn
   * @returns {object}
   */
  buildQueue (item) {
    const itemQueue = new Bull(item.name, redisURL)
    itemQueue.process(item.concurrency || 1, item.fn)
    return itemQueue
  },

  /**
   * Retorna fila
   * @param {string} name
   * @returns {object}
   */
  getQueue (name) {
    return this.allQueues[name]
  },

  /**
   * Escuta eventos de uma fila
   * @param {string} queueName
   * @param {string} eventName
   * @param {function} fn
   */
  on (queueName, eventName, fn) {
    const events = {
      complete: 'completed',
      fail: 'failed',
      error: 'error',
      waiting: 'waiting',
      active: 'active',
      stalled: 'stalled',
      progress: 'progress',
      paused: 'paused',
      resumed: 'resumed',
      cleaned: 'cleaned',
      drained: 'drained',
      removed: 'removed'
    }
    this.allQueues[queueName].on(events[eventName] || eventName, fn)
  },

  /**
   * Retorna todas filas
   * @returns {Promise}
   */
  getAllQueues () {
    return this.allQueues
  },

  /**
   * Pausa filas para reiniciar servidor
   * @returns {Promise}
   */
  stop () {
    const promises = Object.keys(this.allQueues)
      .map(queue => this.allQueues[queue].pause())
    return Promise.all(promises)
  },

  /**
   * Instala filas
   */
  install () {
    const items = [{
      name: 'notify_email',
      concurrency: 10,
      fn: notifyEmail
    }, {
      name: 'notify_sms',
      concurrency: 1,
      fn: notifySms
    }, {
      name: 'notify_push',
      concurrency: 10,
      fn: notifyPush
    }]

    items.map((item) => {
      this.allQueues[item.name] = actions.buildQueue(item)
      this.allQueues[item.name].resume()
    })

    Object.keys(this.allQueues).forEach(queue => {
      const events = ['waiting', 'error', 'active', 'progress', 'completed', 'failed', 'paused', 'resumed', 'cleaned', 'drained', 'removed']
      events.forEach(event => {
        this.on(queue, event, (job) => {
          const data = {}
          if (typeof job === 'object') {
            data.job_id = job.id
            data.job_data = job.data
          } else {
            data.job_id = job
          }
          utils.log('queue', `${queue}:${event}`, data)
        })
      })
    })
  }
}

export default actions

/**
 * Adiciona job unico na fila
 * @param {string} name
 * @param {object} data
 * @param {string} [delay=now]
 * @param {object} [_options={}]
 */
export const saveUniqueWorker = (name, data, delay = 'now', _options = {}) => {
  const allQueues = actions.getAllQueues()
  if (allQueues[name]) {
    let options = {
      attempts: 5,
      timeout: toMilliseconds('7 minutes'),
      backoff: toMilliseconds('20 minutes'),
      removeOnComplete: true,
      removeOnFail: false,
      delay,
      ..._options
    }
    if (typeof options.delay === 'string') {
      options.delay = toMilliseconds(options.delay)
    }
    return allQueues[name].isReady().then(() => {
      return allQueues[name].add(data, options)
    })
  }
}
