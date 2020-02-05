import FCM from 'fcm-node'
import settings from '../settings'

/**
 * Envia push notification
 * @param {object} options
 * @param {string} options.to
 * @param {object} options.notification
 * @param {string} options.notification.title Título da notificação
 * @param {string} [options.notification.body] Texto da notificação (opcional)
 * @param {object} [options.data] Dados específicos do aplicativo nativo (opcional)
 * @returns {Promise.<object>}
 */
const sendPush = options => {
  return new Promise((resolve, reject) => {
    const fcm = new FCM(settings.notifications.push.key)
    const message = {
      to: options.to,
      notification: options.notification,
      data: options.data
    }
    fcm.send(message, (error, response) => {
      try {
        if (error) {
          error = JSON.parse(error)
          if (error.results) {
            reject(new Error(error.results[0].error))
          } else {
            reject(new Error(JSON.stringify(error)))
          }
        } else {
          response = JSON.parse(response)
          resolve(response)
        }
      } catch (error) {
        reject(error)
      }
    })
  })
}

export default sendPush
