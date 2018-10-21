const { ObjectID } = require('mongodb')

module.exports = connection => (id, match, score) => {
  const update = require('./helpers/update')(connection)

  if (score[0] > score[1]) {
    const search = {
      _id: id,
      state: { $bitsAllSet: 16, $bitsAllClear: 32 },
      $and: [{ 'matches.right': { $ne: 0 } }, { 'matches.left': { $gt: 0 } }],
    }

    return update(search, {
      $inc: { 'matches.$.left': -1 },
      $push: {
        'matches.$.score': score,
      },
      $set: { last_action_id: new ObjectID() },
    })
  } else if (score[0] < score[1]) {
    const search = {
      _id: id,
      state: { $bitsAllSet: 16, $bitsAllClear: 32 },
      $and: [{ 'matches.right': { $gt: 0 } }, { 'matches.left': { $ne: 0 } }],
    }

    return update(search, {
      $inc: { 'matches.$.right': -1 },
      $push: {
        'matches.$.score': score,
      },
      $set: { last_action_id: new ObjectID() },
    })
  } else return Promise.reject(new Error('Equal score'))
}
