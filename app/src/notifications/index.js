/**
 * @typedef {object} NotificationOptions
 * @property {number} to_user_id ID do usuário que receberá a notificação
 * @property {number} from_user_id ID do usuário que disparou a notificação
 * @property {number} activity_type Tipo da atividade da notificação
 * @property {number} source Fonte do registro de referência
 * @property {number} source_id ID da fonte do registro de referência
 * @property {string[]} [only] Tipos de nofiticações a serem enviadas
 */

/**
 * @typedef {object} NotificationState Possíveis status de pagamento
 * @property {string} sended Enviado com sucesso
 * @property {string} failed Falha ao enviar
 */

/**
 * @typedef {object} NotificationSend
 * @property {string} code Código da notificação
 * @property {NotificationState} state Código da notificação
 */

import EmailNotification from './email_notification'
import SmsNotification from './sms_notification'
import PushNotification from './push_notification'

export {
  EmailNotification,
  SmsNotification,
  PushNotification
}
