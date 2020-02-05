module.exports = {
  apps : [{
    name: 'sinoniza-api',
    script: 'src/server.js',
    instances: 1,
    autorestart: false,
    watch: ['src'],
    exec_mode: 'fork',
    exec_interpreter: 'babel-node',
    kill_timeout: 60000
  }]
}
