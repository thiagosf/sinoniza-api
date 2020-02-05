'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('locales', [{
      id: 1,
      name: 'Português',
      locale: 'pt-BR',
    }], {}).catch(error => {
      const name = error.name
      if (name === 'SequelizeUniqueConstraintError') {
        console.log('=== the seed has already been planted')
      } else {
        throw new Error(error)
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('locales', null, {})
  }
}
