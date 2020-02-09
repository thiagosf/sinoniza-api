'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ignored_words', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      locale_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'locales',
          key: 'id',
        }
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    }).then(() => {
      return queryInterface.addIndex('ignored_words', ['locale_id', 'word'], {
        unique: true,
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ignored_words')
  }
}
