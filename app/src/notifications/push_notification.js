import * as utils from '../helpers'

/**
 * Notificação por push
 * @class
 * @see https://firebase.google.com/docs/cloud-messaging/admin/send-messages
 */
class PushNotification {
  /**
   * Constructor
   * @param {object} data Dados
   * @param {object} data.user Usuário
   * @param {object} data.notification Notificação
   * @param {object} data.models Models
   */
  constructor ({ user, notification, models }) {
    this.user = user
    this.notification = notification
    this.models = models
  }

  /**
   * Envia notificação
   * @returns {Promise.<NotificationSend>}
   */
  send () {
    return this.notification.publicData().then(publicNotification => {
      if (this.user.push_token) {
        const text = utils.__(publicNotification.text.text, publicNotification.text.params)
        return utils.sendPush({
          to: this.user.push_token,
          notification: {
            title: text
          }
        }).then(result => {
          return {
            code: result.multicast_id,
            state: 'sended'
          }
        }).catch(error => {
          utils.log('error', 'PushNotification::send', {
            notification_id: this.notification.id,
            error: error.message
          })
          return {
            code: null,
            state: 'failed'
          }
        })
      } else {
        return {
          code: 'EMPTY_PUSH_TOKEN',
          state: 'failed'
        }
      }
    })
  }
}

export default PushNotification
