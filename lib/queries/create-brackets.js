const { ObjectID } = require('mongodb')
const { TOURNAMENT_COLLECTION } = process.env

const reject = require('./helpers/reject')
const roundRobin = require('../brackets/round-robin')

module.exports = connection => {
  const update = require('./helpers/update')(connection)

  return id => {
    return connection.collection(TOURNAMENT_COLLECTION)
      .then(c => c.findOne({ _id: id, state: { $bitsAllSet: 3 | 8, $bitsAllClear: 16 } }))
      .then(doc => doc || reject('can\'t do that'))
      .then(doc => {
        // nothing about this looks good
        // but it works for now
        // TODO: rewrite
        const bracket = roundRobin(doc.teams.map(e => e.id))
        const matches = []
        const b = []

        bracket.forEach(round => {
          b.push([])
          round.forEach(match => {
            const id = new ObjectID()
            b[b.length - 1].push(id)
            matches.push({ id, teams: match, score: [] })
          })
        })

        return update({ _id: id, state: { $bitsAllSet: 3 | 8, $bitsAllClear: 16 } }, {
          $bit: { state: { or: 16 } },
          $set: {
            bracket: b,
            matches,
            score: doc.teams.map(e => ({
              id: e.id,
              games: 0,
              wins: 0,
              tb: 0,
              pts: 0,
            })),
            last_action_id: new ObjectID(),
          },
        })
      })
  }
}
