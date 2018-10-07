const { ObjectID } = require('mongodb')
const validate = require('./helpers/validate-options')
const reject = require('./helpers/reject')

const { TOURNAMENT_COLLECTION } = process.env

module.exports = connection => {
  const update = (search, changes) => {
    return connection.collection(TOURNAMENT_COLLECTION)
      .then(c => c.findOneAndUpdate(search, changes, { returnOriginal: false }))
      .then(r => (
        r.ok === 1 && r.lastErrorObject.n === 1
          ? r.value
          : reject('Update failed')
      ))
  }

  return (id, params) => {
    return validate(params)
      .then(params => {
        const search = {
          _id: id,
          state: { $bitsAllClear: 1 },
          status: 'active',
        }

        return update(search, {
          $set: { params, last_action_id: new ObjectID() },
        })
      })
  }
}
