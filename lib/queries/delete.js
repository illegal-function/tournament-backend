const reject = require('./helpers/reject')

const { TOURNAMENT_COLLECTION } = process.env

module.exports = connection => id => {
  return connection.collection(TOURNAMENT_COLLECTION)
    .then(c => c.findOneAndDelete({ _id: id }))
    .then(r => (
      r.ok === 1 && r.lastErrorObject.n === 1
        ? r.value
        : reject(`Tournament ${id} not found`))
    )
}
