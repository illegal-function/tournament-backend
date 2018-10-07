/* global describe it after */

const TOURNAMENT_ID = '1234'

const validator = new (require('fastest-validator'))()
const connection = require('../lib/connection')

const debug = require('debug')('trn:test')

const app = require('..')(connection, {
  onCreate (options) {
    const schema = {
      teamsize: { type: 'number', positive: true, integer: true, min: 2, max: 3 },
      signup: { type: 'string', enum: ['solo', 'team', 'any'] },
    }

    const res = validator.validate(options, schema)

    if (res !== true) {
      debug(res)
      return Promise.reject(new Error('Validation failed'))
    }

    return Promise.resolve(options)
  },
})

describe('tournaments', () => {
  it('can create a tournament', () => {
    return app.create(TOURNAMENT_ID, {
      teamsize: 2,
      signup: 'any',
    })
  })

  it('can delete a tournament', () => {
    return app.delete(TOURNAMENT_ID)
  })

  after(() => {
    return connection.close()
  })
})
