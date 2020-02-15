import _ from 'lodash'
import { queuePromises } from '../../helpers'
import { SinonimosCrawler } from '../../services'

export default async (req, res, next) => {
  try {
    const localeId = 1
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

    const { Synonym, Word, IgnoredWord } = req.models
    const service = new SinonimosCrawler()

    let list = []
    await queuePromises(
      phrase.split(' ').map((value, position) => {
        return async () => {
          const formatedValue = value.replace(/(,|\.|;|:|\?|!)/g, '')
          let synonyms = []

          if (
            formatedValue.length >= minWordLength &&
            !formatedValue.includes('*')
          ) {
            try {
              const isIgnored = await IgnoredWord.isIgnored({
                localeId,
                word: formatedValue
              })
              if (!isIgnored) {
                synonyms = await Synonym.getSynonyms(formatedValue)
                console.log('synonyms', synonyms)
                if (synonyms.length === 0) {
                  const count = await Word.count({
                    where: {
                      locale_id: localeId,
                      word: formatedValue
                    }
                  })
                  if (count === 0) {
                    const newSynonyms = await service.search(formatedValue)
                    console.log('newSynonyms', newSynonyms)
                    await Word.addWordAndSynonyms({
                      localeId,
                      word: formatedValue,
                      synonyms: newSynonyms
                    })
                    if (newSynonyms.length > 0) {
                      synonyms = await Synonym.getSynonyms(formatedValue)
                    }
                  }
                }
              }
            } catch (error) {
              console.log('-- error:', value, formatedValue, error)
            }
          }

          list.push({
            position,
            value,
            synonyms
          })
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
