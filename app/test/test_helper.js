import fs from 'fs'
import path from 'path'
import buffer from 'buffer'
import * as utils from '../src/helpers'
import models from '../src/models'

const sequelize = models.sequelize
const isEnabledNock = process.env.NOCK_OFF !== 'true'
let nock

if (isEnabledNock) {
  nock = require('nock')
  require('./nock')
}

module.exports = {
  importFixture (model) {
    return new Promise((resolve, reject) => {
      const filename = path.join(__dirname, 'fixtures', `${model.name}.json`)
      if (fs.existsSync(filename)) {
        const data = JSON.parse(fs.readFileSync(filename).toString())
        model.destroy({ where: {}, force: true }).then(() => {
          return model.bulkCreate(data)
        }).then(resolve).catch(reject)
      } else {
        model.destroy({ where: {}, force: true })
          .then(resolve)
          .catch(reject)
      }
    })
  },
  importFixtures (items) {
    if (items === 'all') {
      const promises = Object.values(models.sequelize.models).map(model => {
        return () => {
          return this.importFixture(model).catch(error => {
            // console.log('-- importFixture error:', error, model.tableName)
          })
        }
      })
      return this.lockKeys().then(() => {
        return utils.queuePromises(promises).then(() => {
          return this.unlockKeys()
        })
      })
    } else {
      const promises = items.map(model => {
        return () => {
          return this.importFixture(model)
        }
      })
      return this.lockKeys().then(() => {
        return utils.queuePromises(promises).then(() => {
          return this.unlockKeys()
        })
      })
    }
  },
  syncDatabase (force = true) {
    return this.lockKeys().then(() => {
      return sequelize.sync({ force }).then(() => {
        return this.unlockKeys().then(() => {
          return models
        })
      })
    })
  },
  lockKeys () {
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
  },
  unlockKeys () {
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })
  },
  getValidToken (id = 1) {
    const { User } = models
    return User.findOne({ where: { id } }).then(user => {
      return user.loginData().then(user => {
        return user.token
      })
    })
  },
  getValidAdminToken (id = 1) {
    const { Admin } = models
    return Admin.findOne({ where: { id } }).then(admin => {
      return admin.loginData().then(admin => {
        return admin.token
      })
    })
  },
  recNock () {
    nock.recorder.rec()
  },
  isEnabledNock () {
    return isEnabledNock
  },
  getBase64Image () {
    const data = fs.readFileSync(path.join(__dirname, 'fixtures/images/image.png'))
    const buf = Buffer.from(data)
    const base64 = buf.toString('base64')
    const prefix = 'data:image/png;base64,'
    return `${prefix}${base64}`
  },
  removeUploadFile (name, dir) {
    fs.unlinkSync(path.join(__dirname, '../public/files', dir, name))
  },
  copyFile (name, dir) {
    const destinationPath = path.join(__dirname, '../public/files', dir)
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath)
    }
    fs.copyFileSync(
      path.join(__dirname, './fixtures/images', 'image.png'),
      path.join(destinationPath, name)
    )
  },

  /**
   * Faz variacoes de request em busca de erro 500
   * @param {object} options
   * @param {object} options.method
   * @param {object} options.path
   * @param {object} options.fields
   * @param {object} options.request
   * @param {object} options.app
   * @param {object} options.mock
   * @returns {Promise}
   */
  fiveHundredDiscovery ({ method, path, fields, request, app, mock, headers }) {
    let promises = []
    const dirt = [
      'Lorem ipsum',
      null,
      undefined,
      -1,
      '',
      '$%#',
      '~1`_)',
      false,
      true,
      [0],
      1,
      0
    ]
    headers = {
      'Accept': 'application/json',
      ...(headers || {})
    }
    const doRequest = data => {
      return new Promise((resolve, reject) => {
        request(app)
          [method](path)
          .send(data)
          .set(headers)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) {
              reject(err)
            } else {
              if (res.body.statusCode === 500) {
                reject({
                  body: res.body,
                  data
                })
              } else {
                resolve(res.body)
              }
            }
          })
      })
    }
    promises.push(() => {
      return doRequest({})
    })
    dirt.forEach(value => {
      promises.push(() => {
        let data = {}
        fields.forEach(field => {
          data[field] = value
        })
        return doRequest(data)
      })
    })
    fields.forEach(mainField => {
      dirt.forEach(value => {
        promises.push(() => {
          let data = {}
          fields.forEach(field => {
            if (mainField === field || !mock) {
              data[field] = value
            } else {
              data[field] = mock[field]
            }
          })
          return doRequest(data)
        })
      })
    })
    return utils.queuePromises(promises)
  }
}
