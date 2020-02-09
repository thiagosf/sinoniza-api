import assert from 'assert'
import helper from '../test_helper'
import { SinonimosCrawler } from '../../src/services'

describe('helpers/sinonimos_crawler', function () {
  before(async () => {
    this.models = await helper.syncDatabase()
  })

  beforeEach(async () => {
    await helper.importFixtures('all')
    this.service = new SinonimosCrawler();
  })

  describe('search', () => {
    it('should search synonyms', async () => {
      const synonyms = await this.service.search('esperto')
      assert(synonyms[0].hasOwnProperty('meaning'), 'meaning')
      assert(synonyms[0].hasOwnProperty('synonym'), 'synonym')
    })
  })
})
