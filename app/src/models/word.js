import * as utils from '../helpers'

export default (sequelize, DataTypes) => {
  let Locale
  let Synonym
  const { Op } = sequelize

  /**
   * Words
   * @class
   */
  const Word = sequelize.define('Word', {
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
    meaning: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'words',
    hooks: {
      beforeSave: (instance, options) => {
        const model = Word
        const settings = {}
        utils.beforeSaveStripTags({ model, instance, options, settings })
      }
    }
  })

  /**
   * Associa models
   * @param {object} models Models
   */
  Word.associate = function (models) {
    Locale = models.Locale
    Synonym = models.Synonym
    Word.belongsTo(Locale, {
      onDelete: 'CASCADE',
      as: 'locale'
    })
    Word.hasMany(Synonym, {
      as: 'synonyms'
    })
  }

  /**
   * Dados públicos
   * @returns {Promise}
   */
  Word.prototype.publicData = async function () {
    let output = {
      id: this.id,
      word: this.word,
      meaning: this.meaning,
      synonyms: []
    }
    if (this.synonyms) {
      for (let item of this.synonyms) {
        const synonym = await item.publicData()
        output.synonyms.push(synonym)
      }
    }
    return output
  }

  /**
   * Atualiza com strong params
   * @param {object} data Dados para atualizar
   * @returns {Promise}
   */
  Word.prototype.strongUpdate = function (data) {
    data = utils.strongParams(data, [
      'locale_id',
      'word',
      'meaning'
    ])
    return this.update(data)
  }

  /**
   * Cria com strong params
   * @param {object} data Dados
   * @returns {Promise}
   */
  Word.strongCreate = function (data) {
    data = utils.strongParams(data, [
      'locale_id',
      'word',
      'meaning'
    ])
    return Word.create(data)
  }

  /**
   * Adiciona palavra e sinonimos
   * @param {object} options
   * @param {number} options.localeId
   * @param {string} options.word
   * @param {string} options.synonyms
   * @returns {Promise}
   */
  Word.addWordAndSynonyms = async function ({ localeId, word, synonyms }) {
    const meaning = null
    const result = await Word.findOrCreate({
      where: {
        locale_id: localeId,
        word,
        meaning
      }
    })
    const mainWord = result[0]

    const clearValue = value => {
      return (value || '').toString()
        .replace(/(\xC2|\x96)/g, '')
        .replace(/\r?\n|\r/g, '')
        .trim()
        .split(' ')
        .filter(v => v && v.length > 0)
        .join(' ')
    }

    const createWordAndSynonym = async (word, synonym) => {
      const result = await Word.findOrCreate({
        where: {
          locale_id: localeId,
          word: clearValue(synonym.synonym)
        },
        defaults: {
          locale_id: localeId,
          word: clearValue(synonym.synonym),
          meaning: clearValue(synonym.meaning)
        }
      })
      const synonymWord = result[0]
      await Synonym.findOrCreate({
        where: {
          [Op.or]: [{
            word_id: word.id,
            synonym_id: synonymWord.id
          }, {
            word_id: synonymWord.id,
            synonym_id: word.id
          }]
        },
        defaults: {
          word_id: word.id,
          synonym_id: synonymWord.id
        }
      })
      return synonymWord
    }

    await utils.queuePromises(
      synonyms.map(item => {
        return async () => {
          try {
            const synonym = await createWordAndSynonym(mainWord, item)
            for (let another of synonyms) {
              if (item !== another) {
                await createWordAndSynonym(synonym, another)
              }
            }
          } catch (error) {
            console.log('Word::addWordAndSynonyms error:', word, item, error)
          }
        }
      })
    )
    return mainWord
  }

  return Word
}
