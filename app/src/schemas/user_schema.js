import {
  StringNotEmptySchema
} from './commons'

const login = {
  email: {
    message: 'Invalid name',
    type: StringNotEmptySchema,
    required: true
  },
  password: {
    message: 'Invalid password',
    type: StringNotEmptySchema,
    required: true
  }
}

export default { login }
