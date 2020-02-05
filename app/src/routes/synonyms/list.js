import _ from 'lodash'

export default async (req, res, next) => {
  try {
    const { phrase } = req.query
    const minPhraseLength = 2
    const minWordLength = 2
    const maxPieces = 50

    if (!phrase || phrase.toString().length < minPhraseLength) {
      throw new Error('Empty phrase')
    }

    const pieces = _.uniq(
      phrase.split(' ')
        .map(item => item.trim())
        .filter(item => item.length > 1)
    )

    if (pieces.length > maxPieces) {
      throw new Error('Phrase too large')
    }

    const { Word, Synonym } = req.models
    const { Op } = req.models.sequelize

    // @todo: make cache that by phrase
    const list = await Promise.all(
      phrase.split(' ').map(async (value, position) => {
        let synonyms = []

        if (value.length >= minWordLength) {
          try {
            const word = await Word.findOne({
              where: {
                word: value
              }
            })
            if (word) {
              const allSynonyms = await Synonym.findAll({
                where: {
                  [Op.or]: [{
                    word_id: word.id
                  }, {
                    synonym_id: word.id
                  }]
                },
                include: [{
                  model: Word,
                  as: 'word'
                }, {
                  model: Word,
                  as: 'synonym'
                }]
              })
              synonyms = await Promise.all(
                allSynonyms.map(item => {
                  return {
                    id: item.id,
                    value: item.word_id === word.id
                      ? item.synonym.word
                      : item.word.word
                  }
                })
              )
            }
          } catch (error) {
            console.log(error)
          }
        }

        return {
          position,
          value,
          synonyms
        }
      })
    )

    let randomPhrase = list.map(item => {
      let output = item.value
      if (item.synonyms.length > 0) {
        const index = _.random(0, item.synonyms.length - 1)
        output = item.synonyms[index].value
      }
      return output
    }).join(' ')

    const data = {
      list,
      original_phrase: phrase,
      suggest_phrase: randomPhrase
    }

    res.send({ success: true, data })
  } catch (error) {
    next(error)
  }
}
