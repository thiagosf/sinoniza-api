import * as utils from '../helpers'
import settings from '../settings'

/**
 * Notificação por e-mail
 * @class
 */
class EmailNotification {
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
      const template = `notification_${this.notification.activity_type}`
      const data = {
        title: settings.title,
        name: this.user.name,
        textParams: publicNotification.text.params
      }
      return utils.sendMail({
        to: this.user.email,
        subject: utils.__(publicNotification.text.text, publicNotification.text.params),
        data: data,
        template
      }).then((result) => {
        const item = result[0]
        if (item) {
          return {
            code: null,
            state: item.statusCode === 202 ? 'sended' : 'failed'
          }
        } else {
          throw new Error('Empty result')
        }
      }).catch(error => {
        utils.log('error', 'EmailNotification::send', {
          notification_id: this.notification.id,
          error: error.message
        })
        return {
          code: null,
          state: 'failed'
        }
      })
    })
  }
}

export default EmailNotification
