import models from '../models'
import {
  EmailNotification,
  SmsNotification,
  PushNotification
} from '../notifications'

/**
 * Serviço para notificar por e-mail
 * @class
 */
class NotificationServiceSendFactory {
  /**
   * Construtor
   * @param {object} options
   * @param {number} options.service
   * @param {number} options.user_id
   * @param {number} options.notification_id
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Envia notifição de acordo com service
   * @returns {Promise}
   */
  send () {
    const { User, Notification, NotificationDelivery } = models
    const data = {
      notification_id: this.options.notification_id,
      service: this.options.service
    }
    return NotificationDelivery.getOrCreate(data)
      .then(notificationDelivery => {
        if (notificationDelivery.exceedAttempts()) {
          return notificationDelivery.update({
            status: NotificationDelivery.STATUS_FAILED
          })
        } else if (notificationDelivery.isPending()) {
          return User.findByPk(this.options.user_id)
            .then(user => {
              return Notification.findByPk(this.options.notification_id)
                .then(notification => {
                  if (user && notification) {
                    const serviceNames = {
                      [NotificationDelivery.SERVICE_EMAIL]: EmailNotification,
                      [NotificationDelivery.SERVICE_SMS]: SmsNotification,
                      [NotificationDelivery.SERVICE_PUSH]: PushNotification
                    }
                    let ServiceName = serviceNames[this.options.service]
                    if (ServiceName) {
                      const service = new ServiceName({
                        user,
                        notification,
                        models
                      })
                      return service.send().then(result => {
                        return notificationDelivery.saveResult(result)
                      })
                    }
                  }
                })
            })
        }
      })
  }
}

export default NotificationServiceSendFactory
