import * as utils from '../helpers'

export default (sequelize, DataTypes) => {
  let Word

  /**
   * Locales
   * @class
   */
  const Locale = sequelize.define('Locale', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: false,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
    tableName: 'locales'
  })

  /**
   * Associa models
   * @param {object} models Models
   */
  Locale.associate = function (models) {
    Word = models.Word
    Locale.hasMany(Word, {
      as: 'words'
    })
  }

  /**
   * Dados públicos
   * @returns {Promise}
   */
  Locale.prototype.publicData = async function () {
    const output = {
      id: this.id,
      name: this.name,
      locale: this.locale
    }
    return output
  }

  /**
   * Atualiza com strong params
   * @param {object} data Dados para atualizar
   * @returns {Promise}
   */
  Locale.prototype.strongUpdate = function (data) {
    data = utils.strongParams(data, [
      'name',
      'locale'
    ])
    return this.update(data)
  }

  /**
   * Cria com strong params
   * @param {object} data Dados
   * @returns {Promise}
   */
  Locale.strongCreate = function (data) {
    data = utils.strongParams(data, [
      'name',
      'locale'
    ])
    return Locale.create(data)
  }

  return Locale
}
