require('dotenv').config()

module.exports = {
  apps : [{
    name: 'sinoniza-api',
    script: 'dist/server.js',
    instances: 1,
    autorestart: true,
    watch: false
  }]
}
