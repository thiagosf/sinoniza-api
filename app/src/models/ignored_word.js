import * as utils from '../helpers'

export default (sequelize, DataTypes) => {
  /**
   * IgnoredWords
   * @class
   */
  const IgnoredWord = sequelize.define('IgnoredWord', {
    locale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'locales',
        key: 'id'
      }
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'ignored_words',
    hooks: {
      beforeSave: (instance, options) => {
        const model = IgnoredWord
        const settings = {}
        utils.beforeSaveStripTags({ model, instance, options, settings })
      }
    }
  })

  /**
   * Associa models
   * @param {object} models Models
   */
  IgnoredWord.associate = function (models) {
  }

  /**
   * Verifica se é uma palavra a ser ignorada
   * @param {object} options
   * @param {number} options.localeId
   * @param {string} options.word
   * @returns {Promise<boolean>}
   */
  IgnoredWord.isIgnored = async function ({ localeId, word }) {
    const count = await IgnoredWord.count({
      where: {
        locale_id: localeId,
        word: word
      }
    })
    return count > 0
  }

  return IgnoredWord
}
