/* global describe it after */

const TOURNAMENT_ID = '1234'
const expect = require('expect.js')
const connection = require('../lib/connection')
const app = require('..')(connection)

describe('tournaments', () => {
  it('can create a tournament', () => {
    return app.create(TOURNAMENT_ID, {
      teamsize: 3,
      signup: 'any',
    }).then(doc => {
      expect(doc.config.teamsize).to.be(3)
      expect(doc.config.signup).to.be('any')
    })
  })

  it('can update a tournament', () => {
    return app.update(TOURNAMENT_ID, {
      teamsize: 2,
      signup: 'solo',
    }).then(doc => {
      expect(doc.config.teamsize).to.be(2)
      expect(doc.config.signup).to.be('solo')
    })
  })

  it('can lock config', done => {
    app.lockConfig(TOURNAMENT_ID)
      .then(doc => app.update(TOURNAMENT_ID, {
        teamsize: 2,
        signup: 'any',
      }))
      .then(ok => done(new Error('Should not be possible since config should be locked')))
      .catch(ok => done())
  })

  it('can join a tournament', () => {
    return app.join(TOURNAMENT_ID, {
      id: '1234',
      username: 'illegal-function',
      rating: 950,
    }).then(doc => {
      expect(doc.joins).to.not.be(undefined)
      expect(doc.joins[0].id).to.be('1234')
      expect(doc.joins[0].rating).to.be(950)
      expect(doc.no_joins).to.be(1)
    })
  })

  it('can not double join', done => {
    app.join(TOURNAMENT_ID, {
      id: '1234',
      username: 'illegal-function',
      rating: 950,
    }).then(whoops => done(new Error('Double join should not be possoble')))
      .catch(ok => done())
  })

  it('fails on innvalid user', done => {
    app.join(TOURNAMENT_ID, {
      id: '5678',
      username: 'illegal-function',
      ok: 1,
    }).then(whoops => done(new Error('Should not accept invalid user')))
      .catch(ok => done())
  })

  it('can unjoin', () => {
    app.unjoin(TOURNAMENT_ID, {
      id: '1234',
    }).then(doc => {
      expect(doc.joins.length).to.be(0)
      expect(doc.no_joins).to.be(0)
    })
  })

  it('fails to unjoin if you haven\'t joned', done => {
    app.unjoin(TOURNAMENT_ID, {
      id: '9876',
    }).then(whoops => done(new Error('Unjoined without having joned')))
      .catch(ok => done())
  })

  it('can lock signup when the numbers of joins allow for it', () => {
    return app.join(TOURNAMENT_ID, { id: '1', username: '1', rating: 1 })
      .then(ok => app.join(TOURNAMENT_ID, { id: '2', username: '2', rating: 2 }))
      .then(ok => app.join(TOURNAMENT_ID, { id: '3', username: '3', rating: 3 }))
      .then(ok => app.join(TOURNAMENT_ID, { id: '4', username: '4', rating: 4 }))
      .then(ok => app.join(TOURNAMENT_ID, { id: '5', username: '5', rating: 5 }))
      .then(ok => app.join(TOURNAMENT_ID, { id: '6', username: '6', rating: 6 }))
      .then(ok => app.lockSignup(TOURNAMENT_ID))
  })

  it('can delete a tournament', () => {
    return app.delete(TOURNAMENT_ID) // .then(console.log)
  })

  after(() => {
    return connection.close()
  })
})
