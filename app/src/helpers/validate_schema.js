import _ from 'lodash'

/**
 * Validacao de schema
 * @param {object} data
 * @return {Promise.<boolean>}
 */
const validateSchema = (data, schema) => {
  return new Promise((resolve, reject) => {
    let errors = []
    let promises = []
    const validate = (data, schema) => {
      for (let field in schema) {
        const dataItem = data[field]
        let schemaItem = schema[field]
        if (schemaItem.required || dataItem) {
          if (Array.isArray(dataItem)) {
            dataItem.map(dataItemArray => {
              promises.push(
                validate(dataItemArray, schemaItem.children)
              )
            })
          } else {
            const output = schemaItem.type.validate(dataItem, data)
            if (output) {
              if (schemaItem.children) {
                promises.push(
                  validate(dataItem, schemaItem.children)
                )
              }
            } else {
              errors.push(schemaItem.message)
            }
          }
        }
      }
    }
    validate(data, schema)
    return Promise.all(promises).then(() => {
      if (errors.length > 0) {
        errors = _.uniq(errors)
        throw new Error(errors.join(', '))
      }
      resolve()
    }).catch(reject)
  })
}

export default validateSchema
