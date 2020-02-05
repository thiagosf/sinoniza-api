import twilio from 'twilio'
import * as utils from '../helpers'
import settings from '../settings'

/**
 * Notificação por sms
 * @class
 */
class SmsNotification {
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
      if (this.user.phone) {
        const accountSid = settings.notifications.sms.sid
        const authToken = settings.notifications.sms.token
        const client = twilio(accountSid, authToken)
        return client.messages
          .create({
            body: utils.__(publicNotification.text.text, publicNotification.text.params),
            from: settings.notifications.sms.phoneNumber,
            to: this.formatNumber(this.user.phone)
          })
          .then(message => {
            if (!message.error_message) {
              return {
                code: message.sid,
                state: 'sended'
              }
            } else {
              throw new Error(message.error_message)
            }
          })
          .catch(error => {
            utils.log('error', 'SmsNotification::send', {
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
          code: 'EMPTY_PHONE',
          state: 'failed'
        }
      }
    })
  }

  /**
   * Formata numero de telefone para enviar na api
   * @param {string} phoneNumber
   * @returns {string}
   */
  formatNumber (phoneNumber) {
    if (phoneNumber) {
      let formatedNumber = phoneNumber.replace(/[^0-9]*/ig, '')
      if (formatedNumber.length <= 11) {
        formatedNumber = `55${formatedNumber}`
      }
      return `+${formatedNumber}`
    }
  }
}

export default SmsNotification
