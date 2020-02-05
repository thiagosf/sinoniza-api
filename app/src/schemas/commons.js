const IntergerSchema = {
  validate: value => Number.isInteger(+value)
}

const IntergerNotEmptySchema = {
  validate: value => IntergerSchema.validate(value) && +value > 0
}

const DecimalSchema = {
  validate: value => {
    return (
      typeof +value === 'number' &&
      !isNaN(+value) &&
      value !== null &&
      value !== ''
    )
  }
}

const ArraySchema = {
  validate: value => Array.isArray(value)
}

const StringNotEmptySchema = {
  validate: value => value && value.toString().length > 0
}

const ObjectSchema = {
  validate: value => typeof value === 'object'
}

export {
  IntergerSchema,
  IntergerNotEmptySchema,
  DecimalSchema,
  ArraySchema,
  StringNotEmptySchema,
  ObjectSchema
}
