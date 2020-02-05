import 'buffer'
import crypto from 'crypto'
import settings from '../settings'

/**
 * Retorna texto criptografado
 * @returns {string}
 */
const encrypt = text => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(settings.salt), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export default encrypt
