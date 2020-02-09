import assert from 'assert'
import helper from '../test_helper'

describe('helpers/sinonimos_crawler', function () {
  before(async () => {
    this.models = await helper.syncDatabase()
  })

  beforeEach(async () => {
    await helper.importFixtures('all')
  })

  describe('addWordAndSynonyms', () => {
    it('should add word and synonyms', async () => {
      const { Word } = this.models
      const result = await Word.addWordAndSynonyms({
        localeId: 1,
        word: 'oi',
        synonyms: [{
          meaning: 'saudação',
          synonym: 'olá'
        }, {
          meaning: 'saudação',
          synonym: 'e aí'
        }]
      })
      assert(result !== null)
    })
  })
})


