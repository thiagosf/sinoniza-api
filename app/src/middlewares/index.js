import rateLimiterMiddleware from './rate_limiter_middleware'
import i18nMiddleware from './i18n_middleware'
import compression from './compression'
import gzip from './gzip'

export default {
  i18nMiddleware,
  rateLimiterMiddleware,
  compression,
  gzip
}
