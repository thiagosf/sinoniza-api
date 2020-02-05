import path from 'path'
import pug from 'pug'
import sgMail from '@sendgrid/mail'
import settings from '../settings'
import { translate } from './i18n'

/**
 * Envia e-mail
 * @param {object} options
 * @param {string} options.template
 * @param {object} options.data
 * @param {string} options.from
 * @param {string} options.to
 * @param {string} options.subject
 * @returns {Promise}
 */
const sendMail = options => {
  const filepath = path.join(
    __dirname,
    '../views/emails',
    `${options.template}.pug`
  )
  let promises = []
  const pugOptions = {
    ...options.data,
    __: translate
  }
  promises.push(pug.compileFile(filepath)(pugOptions))
  return Promise.all(promises).then(result => {
    const template = result.pop()
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'dev'
    ) {
      const statusCode = 202
      return Promise.resolve({ statusCode, template })
    } else {
      sgMail.setApiKey(settings.notifications.mail.key)
      return sgMail.send({
        from: options.from || settings.mail.email,
        to: options.to,
        subject: options.subject,
        html: template
      })
    }
  })
}

export default sendMail
