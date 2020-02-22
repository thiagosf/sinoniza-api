import assert from 'assert'
import helper from '../test_helper'
import { DicioCrawler } from '../../src/services'

describe('helpers/dicio_crawler', function () {
  before(async () => {
    this.models = await helper.syncDatabase()
  })

  beforeEach(async () => {
    await helper.importFixtures('all')
    this.service = new DicioCrawler();
  })

  describe('search', () => {
    it('should search synonyms', async () => {
      const synonyms = await this.service.search('bonito')
      assert(synonyms[0].hasOwnProperty('meaning'), 'meaning')
      assert(synonyms[0].hasOwnProperty('synonym'), 'synonym')
    })
  })
})
