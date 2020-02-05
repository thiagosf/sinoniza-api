import { saveUniqueWorker } from '../workers'

/**
 * Serviço com intuito de notificar usuários
 * @class
 */
class NotificationService {
  /**
   * Construtor
   * @param {object} data
   * @param {object} data.models
   * @param {NotificationOptions} data.options
   */
  constructor ({ models, options }) {
    this.models = models
    this.options = options
  }

  /**
   * Agenda job para notificar usuário via background
   * @returns {Promise}
   */
  notify () {
    const { Notification } = this.models
    return Notification.create(this.options)
      .then(notification => {
        let items = ['notify_email', 'notify_sms', 'notify_push']
        if (this.options.only) {
          items = items.filter(item => this.options.only.indexOf(item) > -1)
        }
        const payload = {
          user_id: notification.to_user_id,
          notification_id: notification.id
        }
        items.map(item => saveUniqueWorker(item, payload, 'now'))
        return notification
      })
  }
}

export default NotificationService
