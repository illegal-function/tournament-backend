const v = new (require('fastest-validator'))()
const { ObjectID } = require('mongodb')

const reject = str => Promise.reject(new Error(str))
const validate = (obj, schema) => {
  const res = v.validate(obj, schema)
  return res ? Promise.resolve(obj) : reject('Input validation failed')
}

module.exports = (connection) => {
  const collection = () => connection.collection('tournaments')

  const update = (search, changes) => {
    return collection()
      .then(c => c.findOneAndUpdate(search, changes, { returnOriginal: false }))
      .then(r => (
        r.ok === 1 && r.lastErrorObject.n === 1
          ? r.value
          : reject('Update failed')
      ))
  }

  return {
    load (id) {
      return collection()
        .then(c => c.findOne({ _id: id }))
        .then(result => result || reject(`Tournament ${id} not found`))
    },
    create (id, params) {
      const schema = {
        teamsize: { type: 'number', positive: true, integer: true, min: 2, max: 3 },
        signup: { type: 'string', enum: ['solo', 'team', 'any'] },
      }

      return validate(params, schema)
        .then(config => {
          return collection()
            .then(c => {
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
    },

    update (id, params) {
      const schema = {
        teamsize: { type: 'number', positive: true, integer: true, min: 2, max: 3 },
        signup: { type: 'string', enum: ['solo', 'team', 'any'] },
      }

      return validate(params, schema)
        .then(config => {
          const search = {
            _id: id,
            state: { $bitsAllClear: 1 },
            status: 'active',
          }

          return update(search, {
            $set: { config, last_action_id: new ObjectID() },
          })
        })
    },

    // should only be used for testing
    delete (id) {
      return collection()
        .then(c => c.findOneAndDelete({ _id: id }))
        .then(r => (
          r.ok === 1 && r.lastErrorObject.n === 1
            ? r.value
            : reject(`Tournament ${id} not found`))
        )
    },
  }
}
