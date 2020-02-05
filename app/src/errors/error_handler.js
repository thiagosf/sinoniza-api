export default (err, req, res, next) => {
  const isDev = (
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'development'
  )
  if (isDev) {
    console.log(err)
  }
  let statusCode = 200
  let message = err.message
  if (err) {
    if (err.status) {
      statusCode = err.status
    }
    if (err.errors) {
      message = err.errors.map(i => res.__(i.message)).join(', ')
      err.status = 422
    }
  }
  if (message && message.indexOf('Expired token') > -1) {
    statusCode = 401
  }
  message = res.__(message)
  res.status(statusCode)
  res.send({
    success: false,
    message,
    error: isDev ? err : {},
    statusCode: err.status || 500
  })
}
