import assert from 'assert'

const validSynonym = (data) => {
  assert(data.hasOwnProperty('position'), 'position')
  assert(data.hasOwnProperty('value'), 'value')
  assert(data.hasOwnProperty('synonyms'), 'synonyms')
}

export {
  validSynonym
}
