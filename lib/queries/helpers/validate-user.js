const Validator = require('fastest-validator')
const v = new Validator()

const validate = v.compile({
  id: { type: 'string' },
  username: { type: 'string' },
  rating: { type: 'number', integer: true },
})

module.exports = opts => {
  const result = validate(opts)
  if (result === true)
    return Promise.resolve(opts)

  return Promise.reject(new Error('Validation failed'))
}
