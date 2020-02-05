import 'buffer'
import crypto from 'crypto'
import settings from '../settings'

/**
 * Retorna texto decryptografado
 * @returns {string}
 */
const decrypt = text => {
  let textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(settings.salt), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export default decrypt
