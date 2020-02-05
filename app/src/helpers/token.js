import jwt from 'jsonwebtoken'
import settings from '../settings'

const jwtSecret = settings.jwtSecret

const token = {
  /**
   * Gera token
   * @param {object} data
   * @param {object} options
   * @returns {string}
   */
  generate (data, options = {}) {
    return jwt.sign(data, jwtSecret, Object.assign({
      expiresIn: '7d'
    }, options))
  },

  /**
   * Dados do token
   * @param {string} token
   * @returns {Promise.<object>}
   */
  data (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          let message = 'Invalid token'
          if (err.message.indexOf('expired')) {
            message = 'Expired token'
          }
          reject(new Error(message))
        } else {
          resolve(decoded)
        }
      })
    })
  }
}

export default token
