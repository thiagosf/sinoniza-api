import request from 'supertest'
import assert from 'assert'
import helper from '../test_helper'
import app from '../../src/app'
import { validSynonym } from '../valid_entities'

describe('routes/synonyms', function () {
  before(async () => {
    this.models = await helper.syncDatabase()
  })

  beforeEach(async () => {
    await helper.importFixtures('all')
  })

  describe('list', () => {
    it('should list synonyms', done => {
      request(app)
        .get('/synonyms')
        .query({
          phrase: 'você é muito esperto e legal'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert(res.body.success, res.body.message)
          validSynonym(res.body.data.list[0])
          done()
        })
    })
  })
})
