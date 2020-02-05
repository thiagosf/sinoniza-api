export default (req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`)
  err.status = 404
  next(err)
}
