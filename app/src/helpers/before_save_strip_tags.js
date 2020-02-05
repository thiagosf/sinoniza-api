import stripTags from './strip_tags'

/**
 * Hook para limpar dados do objeto sequelize antes de salvar
 * Atenção: esse metodo altera diretamente o objeto com valores
 * @param {object} options
 * @param {object} options.instance Instancia do model
 * @param {object} options.model Modelo
 * @param {object} options.options Opcoes do hook
 * @param {object} options.settings Configuracoes
 * @param {object} [options.settings.ignore] Campos para ignorar
 * @param {object} [options.settings.allowedTags] Tags permitidas
 */
const beforeSaveStripTags = options => {
  const model = options.model
  const instance = options.instance
  let ignore = []
  let allowedTags = []
  if (options.settings) {
    if (options.settings.ignore) {
      ignore = options.settings.ignore
    }
    if (options.settings.allowedTags) {
      allowedTags = options.settings.allowedTags
    }
  }
  const isString = field => {
    const fieldData = model.tableAttributes[field]
    if (fieldData) {
      return (
        fieldData.type.constructor.key === 'STRING' ||
        fieldData.type.constructor.key === 'TEXT'
      )
    }
    return false
  }
  for (let field in instance.dataValues) {
    let value = instance.dataValues[field]
    if (!ignore.includes(field)) {
      if (value && isString(field)) {
        instance[field] = stripTags(value, allowedTags)
      }
    }
  }
}

export default beforeSaveStripTags
