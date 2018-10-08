const { ObjectID } = require('mongodb')

module.exports = connection => {
  const update = require('./helpers/update')(connection)
  return id => {
    const search = {
      _id: id,
      $or: [
        {
          'config.teamsize': 2,
          $and: [
            { no_joins: { $mod: [2, 0] } },
            { no_joins: { $gt: 4 } },
          ] },
        {
          'config.teamsize': 3,
          $and: [
            { no_joins: { $mod: [3, 0] } },
            { no_joins: { $gt: 6 } },
          ],
        },
      ],
    }
    return update(search, {
      $bit: { state: { or: 2 } },
      $set: { last_action_id: new ObjectID() },
    })
  }
}
