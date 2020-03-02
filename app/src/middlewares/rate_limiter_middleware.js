import { RateLimiterMySQL } from 'rate-limiter-flexible'

const rateLimiterMiddleware = (req, res, next) => {
  const options = {
    points: +(process.env.RATE_LIMITER_POINTS || 10),
    duration: +(process.env.RATE_LIMITER_DURATION || 15),
    storeClient: req.models.sequelize,
    dbName: req.models.sequelize.config.database,
    tableName: 'rate_limiter'
  }
  if (process.env.NODE_ENV === 'test') {
    options.points = 500
  }
  const rateLimiter = new RateLimiterMySQL(options, (err) => {
    if (err) {
      console.log('-- rate limiter middleware error:', err)
      next()
    } else {
      rateLimiter.consume(req.headers['x-forwarded-for'])
        .then((rateLimiterRes) => {
          next()
        })
        .catch(error => {
          res.status(429).send({
            success: false,
            message: 'Too Many Requests',
            error: error.message
          })
        })
    }
  })
}

export default rateLimiterMiddleware
