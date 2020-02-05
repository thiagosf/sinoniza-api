import bcrypt from 'bcrypt'

const saltRounds = 10

const hash = {
  /**
   * Gera hash
   * @param {object} data
   * @returns {string}
   */
  generate (data) {
    return bcrypt.hashSync(data, saltRounds)
  },

  /**
   * Compara hashs
   * @param {string} hash
   * @returns {boolean}
   */
  compare (hash, compared) {
    return bcrypt.compareSync(hash, compared)
  }
}

export default hash
