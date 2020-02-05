import path from 'path'
import fs from 'graceful-fs'
import 'buffer'
import sharp from 'sharp'
import axios from 'axios'
import settings from '../settings'
import log from './log'
import uniqueID from './unique_id'

const asset = {
  /**
   * Upload de arquivos em base64
   * @param {object} options
   * @param {string} options.file Arquivo em base64
   * @param {string} options.dir Diretório onde salvará o arquivo
   * @param {string} [options.name] Nome do arquivo
   * @param {string} [options.watermark=false] Adiciona marca dagua
   * @param {string} [options.width] Largura da imagem
   * @param {string} [options.height] Altura da imagem
   * @param {array} [options.sizes] Versoes com tamanhos de imagens
   * @param {string} options.sizes.0.prefix Prefixo do tamanho
   * @param {string} options.sizes.0.width Largura
   * @param {string} options.sizes.0.height Altura
   * @returns {Promise}
   */
  base64Upload (options) {
    /**
     * Retorna extensão da imagem
     * @param {string} fileType
     * @returns {string}
     */
    const parseExtension = (fileType) => {
      let extension = 'jpg'
      switch (fileType) {
        case 'data:image/png;base64':
          extension = 'png'
          break
      }
      return extension
    }

    return new Promise((resolve, reject) => {
      if (options.file) {
        try {
          const pieces = options.file.split(',')
          let fileType = pieces.shift()
          let contentFile = pieces.join(',')
          if (fileType.indexOf('data:image') === -1) {
            fileType = 'data:image/png;base64'
            contentFile = options.file
          }
          let promises = []
          let buf = Buffer.from(contentFile, 'base64')
          const originalBuf = buf
          let composite = []
          let resize = {}
          if (options.watermark) {
            composite = [{
              input: path.join(
                __dirname,
                '../../public/assets',
                options.watermark
              ),
              gravity: 'southeast'
            }]
          }
          if (options.width) {
            resize.width = options.width
          }
          if (options.height) {
            resize.height = options.height
          }
          promises.push(
            sharp(buf)
              .resize(resize)
              .composite(composite)
              .toBuffer()
              .then(result => {
                buf = result
              })
              .catch(error => {
                log('error', 'asset::base64Upload', {
                  sharp: true,
                  error: error.message
                })
              })
          )
          Promise.all(promises).then(() => {
            const extension = parseExtension(fileType)
            const filename = options.name || (uniqueID() + '.' + extension)
            const fullpath = path.join(__dirname, '../../public/files', options.dir)
            if (!fs.existsSync(fullpath)) {
              fs.mkdirSync(fullpath)
            }
            fs.writeFile(path.join(fullpath, filename), buf, (error) => {
              if (error) {
                log('error', 'asset::base64Upload', {
                  error: error.message
                })
                resolve()
              } else {
                let promises = []
                if (options.sizes) {
                  options.sizes.map(size => {
                    promises.push(
                      this.cropImage({
                        file: originalBuf,
                        filename: filename,
                        dir: options.dir,
                        ...size
                      })
                    )
                  })
                }
                const onDone = () => {
                  resolve({
                    name: filename,
                    path: path.join(fullpath, filename)
                  })
                }
                Promise.all(promises)
                  .then(onDone)
                  .catch(onDone)
              }
            })
          }).catch(reject)
        } catch (error) {
          log('error', 'asset::base64Upload', {
            catch: true,
            error: error.message
          })
          resolve()
        }
      } else {
        resolve()
      }
    })
  },

  /**
   * URL do arquivo dentro de public/files
   * @param {string} name Nome do arquivo
   * @param {string} dir Nome do diretório
   * @returns {string}
   */
  fileUrl (name, dir) {
    if (name.indexOf('http') === 0) {
      return name
    }
    const url = `${settings.url.assets}/files/${dir}/${name}`
    return url
  },

  /**
   * Remove arquivo feito por upload
   * @param {object} options
   * @param {string} options.file Arquivo em base64
   * @param {string} options.dir Diretório onde salvará o arquivo
   * @returns {boolean}
   */
  removeUploadFile (options) {
    let output = false
    try {
      const fullpath = path.join(
        __dirname,
        '../../public/files',
        options.dir,
        options.file
      )
      if (fs.existsSync(fullpath)) {
        fs.unlinkSync(fullpath)
        output = true
      }
    } catch (error) {
      log('error', 'asset::removeUploadFile', {
        error: error.message
      })
    }
    return output
  },

  /**
   * baixar imagem
   * @param {object} options
   * @param {string} options.url Arquivo em base64
   * @param {string} options.dir Diretório onde salvará o arquivo
   * @param {string} [options.name] Nome do arquivo
   * @returns {Promise}
   */
  downloadImage (options) {
    return axios.get(options.url, {
      responseType: 'arraybuffer'
    }).then(request => {
      if (request.data) {
        options.file = Buffer.from(request.data).toString('base64')
        return this.base64Upload(options)
      } else {
        return {}
      }
    })
  },

  /**
   * Cropa imagem
   * @param {object} options
   * @param {string} options.file Arquivo
   * @param {string} [options.filename] Nome do arquivo
   * @param {string} options.dir Diretório
   * @param {number} options.prefix
   * @param {number} options.width
   * @param {number} options.height
   * @returns {Promise.<string>}
   */
  cropImage (options) {
    let name = options.filename || options.file
    const fullpath = path.join(
      __dirname,
      '../../public/files',
      options.dir
    )
    let originalPath
    let promises = []
    if (options.file.includes('http')) {
      promises.push(
        this.base64Download(options.file).then(base64 => {
          const buf = Buffer.from(base64, 'base64')
          name = options.file.split('/').pop()
          originalPath = buf
        })
      )
    } else if (Buffer.isBuffer(options.file)) {
      originalPath = options.file
    } else {
      originalPath = path.join(
        fullpath,
        options.file
      )
    }

    let composite = []
    let resize = {}
    if (options.watermark) {
      composite = [{
        input: path.join(
          __dirname,
          '../../public/assets',
          'watermark.png'
        ),
        gravity: 'southeast'
      }]
    }
    if (options.width) {
      resize.width = options.width
    }
    if (options.height) {
      resize.height = options.height
    }
    return Promise.all(promises).then(() => {
      return sharp(originalPath)
        .composite(composite)
        .resize(resize)
        .toBuffer()
        .then(data => {
          const filename = `${options.prefix}_${name}`
          const croppedPath = path.join(fullpath, filename)
          fs.writeFileSync(croppedPath, data)
          return filename
        }).catch(error => {
          log('error', 'asset::cropImage', {
            name,
            error: error.message
          })
        })
    })
  },

  /**
   * Verifica se o arquivo existe
   * @param {string} name Nome do arquivo
   * @param {string} dir Nome do diretório
   * @returns {string}
   */
  fileExists (name, dir) {
    const file = path.join(
      __dirname,
      '../../public/files',
      dir,
      name
    )
    return fs.existsSync(file)
  },

  /**
   * Retorna base64 da url
   * @param {string} url
   * @returns {Promise.<string>}
   */
  base64Download (url) {
    return axios.get(url, {
      responseType: 'arraybuffer'
    }).then(request => {
      if (request.data) {
        return Buffer.from(request.data).toString('base64')
      } else {
        return null
      }
    })
  }
}

export default asset
