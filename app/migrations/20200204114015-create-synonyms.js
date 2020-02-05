'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('synonyms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      word_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'words',
          key: 'id',
        }
      },
      synonym_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'words',
          key: 'id',
        }
      },
    }).then(() => {
      return queryInterface.addIndex('synonyms', ['word_id', 'synonym_id'], {
        unique: true,
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('synonyms')
  }
}
