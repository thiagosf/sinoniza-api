import * as utils from '../helpers'

export default (sequelize, DataTypes) => {
  let Word

  /**
   * Synonyms
   * @class
   */
  const Synonym = sequelize.define('Synonym', {
    word_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'words',
        key: 'id'
      }
    },
    synonym_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'words',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
    tableName: 'synonyms'
  })

  /**
   * Associa models
   * @param {object} models Models
   */
  Synonym.associate = function (models) {
    Word = models.Word
    Synonym.belongsTo(Word, {
      onDelete: 'CASCADE',
      foreignKey: 'word_id',
      as: 'word'
    })
    Synonym.belongsTo(Word, {
      onDelete: 'CASCADE',
      foreignKey: 'synonym_id',
      as: 'synonym'
    })
  }

  /**
   * Dados públicos
   * @returns {Promise}
   */
  Synonym.prototype.publicData = async function () {
    let output = {
      id: this.id,
      word_id: this.word_id,
      synonym_id: this.synonym_id,
      word: null,
      synonym: null
    }
    if (this.word) {
      const word = await this.word.publicData()
      output.word = word
    }
    if (this.synonym) {
      const synonym = await this.synonym.publicData()
      output.synonym = synonym
    }
    return output
  }

  /**
   * Atualiza com strong params
   * @param {object} data Dados para atualizar
   * @returns {Promise}
   */
  Synonym.prototype.strongUpdate = function (data) {
    data = utils.strongParams(data, [
      'word_id',
      'synonym_id'
    ])
    return this.update(data)
  }

  /**
   * Cria com strong params
   * @param {object} data Dados
   * @returns {Promise}
   */
  Synonym.strongCreate = function (data) {
    data = utils.strongParams(data, [
      'word_id',
      'synonym_id'
    ])
    return Synonym.create(data)
  }

  return Synonym
}
