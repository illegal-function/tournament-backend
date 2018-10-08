const { ObjectID } = require('mongodb')
const validate = require('./helpers/validate-options')

module.exports = connection => {
  const update = require('./helpers/update')(connection)

  return (id, params) => {
    return validate(params)
      .then(params => {
        const search = {
          _id: id,
          state: { $bitsAllClear: 1 },
          status: 'active',
        }

        return update(search, {
          $set: { config: params, last_action_id: new ObjectID() },
        })
      })
  }
}
