/* global describe it after */

const TOURNAMENT_ID = '1234'
const connection = require('../lib/connection')
const app = require('..')(connection)

describe('tournaments', () => {
  it('can create a tournament', () => {
    return app.create(TOURNAMENT_ID, {
      teamsize: 2,
      signup: 'any',
    })
  })

  it('can update a tournament', () => {
    return app.update(TOURNAMENT_ID, {
      teamsize: 3,
      signup: 'solo',
    })
  })

  it('can delete a tournament', () => {
    return app.delete(TOURNAMENT_ID)
  })

  after(() => {
    return connection.close()
  })
})
