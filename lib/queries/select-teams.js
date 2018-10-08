const { ObjectID } = require('mongodb')
const { TOURNAMENT_COLLECTION } = process.env

const reject = require('./helpers/reject')
const selectTeams = require('../select-teams')

module.exports = connection => {
  const update = require('./helpers/update')(connection)

  return id => {
    return connection.collection(TOURNAMENT_COLLECTION)
      .then(c => c.findOne({
        _id: id,
        state: { $bitsAllSet: 3, $bitsAllClear: 8 },
      }))
      .then(doc => doc || reject('Tournament not found'))
      .then(selectTeams)
      .then(teams => {
        const search = {
          _id: id,
          state: { $bitsAllSet: 3, $bitsAllClear: 8 },
        }

        return update(search, {
          $bit: { state: { or: 8 } },
          $set: {
            no_teams: teams.length,
            teams,
            last_action_id: new ObjectID(),
          },
        })
      })
  }
}
