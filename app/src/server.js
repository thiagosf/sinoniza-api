import { createServer } from 'http'
import app from './app'

const server = createServer(app)

app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), app.get('host'), () => {
  console.log(`Express listening on port: ${app.get('port')}`)
})

process.on('SIGINT', () => {
  console.info('SIGINT signal received.')
  server.close((error) => {
    if (error) {
      console.error(error)
      process.exit(1)
    } else {
      app.stopApp().then(() => {
        process.exit(0)
      }).catch(error => {
        console.error(error)
        process.exit(1)
      })
    }
  })
})

export default app
