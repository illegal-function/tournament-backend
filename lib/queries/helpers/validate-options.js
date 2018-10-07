const Validator = require('fastest-validator')
const v = new Validator()

const validate = v.compile({
  teamsize: { type: 'number', positive: true, integer: true, min: 2, max: 3 },
  signup: { type: 'string', enum: ['solo', 'team', 'any'] },
})

module.exports = opts => {
  const result = validate(opts)
  if (result === true)
    return Promise.resolve(opts)

  return Promise.reject(new Error('Validation failed'))
}
