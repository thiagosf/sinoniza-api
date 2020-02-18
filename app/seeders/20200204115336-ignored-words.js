'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const data = [
      'eu',
      'ela',
      'ele',
      'eles',
      'elas',
      'nós',
      'vós',
      'por',
      'de',
      'da',
      'com',
      'você',
      'vocês',
      'um',
      'uma',
      'esta',
      'estou',
      'que',
      'quão',
      'quem',
      'como',
      'isso',
      'essa',
      'esse',
      'aquele',
      'aquela',
      'para',
      'mim',
    ].map(word => {
      return {
        locale_id: 1,
        word,
        created_at: new Date(),
        updated_at: new Date(),
      }
    })
    return queryInterface.bulkInsert('ignored_words', data, {})
      .catch(error => {
        const name = error.name
        if (name === 'SequelizeUniqueConstraintError') {
          console.log('=== the seed has already been planted')
        } else {
          throw new Error(error)
        }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ignored_words', null, {})
  }
}
