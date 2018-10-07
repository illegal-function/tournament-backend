const { ObjectID } = require('mongodb')

module.exports = connection => {
  const update = require('./helpers/update')(connection)
  return id => {
    return update({ _id: id }, {
      $bit: { state: { or: 1 } },
      $set: { last_action_id: new ObjectID() },
    })
  }
}
