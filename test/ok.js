/* global describe it after */

const TOURNAMENT_ID = '1234'
const expect = require('expect.js')
const connection = require('../lib/connection')
const app = require('..')(connection)

describe('tournaments', () => {
  it('can create a tournament', () => {
    return app.create(TOURNAMENT_ID, {
      teamsize: 2,
      signup: 'any',
    }).then(doc => {
      expect(doc.config.teamsize).to.be(2)
      expect(doc.config.signup).to.be('any')
    })
  })

  it('can update a tournament', () => {
    return app.update(TOURNAMENT_ID, {
      teamsize: 3,
      signup: 'solo',
    }).then(doc => {
      expect(doc.config.teamsize).to.be(3)
      expect(doc.config.signup).to.be('solo')
    })
  })

  it('can delete a tournament', () => {
    return app.delete(TOURNAMENT_ID)
  })

  after(() => {
    return connection.close()
  })
})
