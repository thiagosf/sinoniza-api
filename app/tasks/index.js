import fs from 'fs'
import path from 'path'

const basename = path.basename(__filename)

let tasks = {}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const name = file.replace('.js', '')
    tasks[name] = require(path.join(__dirname, file)).default
  })

export default tasks
