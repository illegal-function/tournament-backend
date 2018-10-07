const { ObjectID } = require('mongodb')
const validate = require('./helpers/validate-user')

module.exports = connection => {
  const update = require('./helpers/update')(connection)

  return (id, user) => {
    const search = {
      _id: id,
      state: { $bitsAllClear: 2 },
      joins: { $not: { $elemMatch: { id: user.id } } },
    }

    return validate(user)
      .then(user => update(search, {
        $push: { joins: user },
        $set: { last_action_id: new ObjectID() },
      }))
  }
}
