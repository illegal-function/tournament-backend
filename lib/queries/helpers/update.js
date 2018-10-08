const reject = require('./reject')

const { TOURNAMENT_COLLECTION } = process.env

module.exports = connection => (search, changes) => {
  return connection.collection(TOURNAMENT_COLLECTION)
    .then(c => c.findOneAndUpdate(search, changes, { returnOriginal: false }))
    .then(r => (
      r.ok === 1 && r.lastErrorObject.n === 1
        ? r.value
        : reject('Update failed')
    ))
}
