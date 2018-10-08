const { TOURNAMENT_COLLECTION } = process.env

const { ObjectID } = require('mongodb')
// const reject = require('./helpers/reject')
const validate = require('./helpers/validate-options')

module.exports = connection => (id, params) => {
  return validate(params)
    .then(params => {
      return connection.collection(TOURNAMENT_COLLECTION)
        .then(c => {
          return validate(params)
            .then(config => {
              const doc = {
                _id: id,
                state: 0,
                status: 'active',
                config,
                last_action_id: new ObjectID(),
              }

              return c.insertOne(doc)
                .then(r => doc)
            })
        })
    })
}
