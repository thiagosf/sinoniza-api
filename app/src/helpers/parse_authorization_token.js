/**
 * Parse authorization token
 * @param {string} token Description
 * @returns {string}
 */
const parseAuthorizationToken = token => {
  if (token) {
    const pieces = token.toString().split(' ')
    if (pieces.length === 2) {
      return pieces[1]
    }
    return token
  }
}

export default parseAuthorizationToken
