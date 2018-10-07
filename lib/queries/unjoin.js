const { ObjectID } = require('mongodb')

module.exports = connection => {
  const update = require('./helpers/update')(connection)

  return (id, user) => {
    const search = {
      _id: id,
      state: { $bitsAllClear: 2 },
      joins: { $elemMatch: { id: user.id } },
    }

    return update(search, {
      $pull: { joins: { id: user.id } },
      $set: { last_action_id: new ObjectID() },
    })
  }
}
