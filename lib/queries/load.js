const { TOURNAMENT_COLLECTION } = process.env
const reject = require('./helpers/reject')

module.exports = connection => id => {
  return connection.collection(TOURNAMENT_COLLECTION)
    .then(c => c.findOne({ _id: id }))
    .then(doc => doc || reject(`Tournament '${id}' not found.`))
}
