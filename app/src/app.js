import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'
import models from './models'
import middlewares from './middlewares'
import jobs from './jobs'
import { notFound, errorHandler } from './errors'
import './helpers/stringify_error'

const app = express()

jobs.install({ models })

app.use((req, res, next) => {
  req.models = models
  next()
})

for (let middleware in middlewares) {
  app.use(middlewares[middleware])
}

app.use(cors())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use('/', routes)
app.use(notFound)
app.use(errorHandler)

/**
 * Verifica se existe jobs em andamento,
 * caso tenha, bloqueia o restart do pm2 e
 * aguarda até a finalização do job/worker
 * @returns {Promise}
 */
app.stopApp = function () {
  const promises = [
    jobs.stop()
  ]
  return Promise.all(promises)
}

export default app
