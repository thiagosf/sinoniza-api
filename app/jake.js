// Bugfix: usando babel-node para poder utilizar
// import, const, etc
require('jake')

// Le .env para funcionar em producao
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
})

const args = process.argv.slice(2)
jake.run.apply(jake, args)
