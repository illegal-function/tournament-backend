const { ObjectID } = require('mongodb')

module.exports = connection => {
  const update = require('./helpers/update')(connection)
  return id => {
    const search = {
      _id: id,
      $where: `
        function() {
          let valid = true

          this.matches.forEach(e => {
            if (e.left > 0 && e.right > 0) {
              valid = false
            }
          })

          return valid
        }
      `,
    }
    return update(search, {
      $set: {
        state: 16383,
        last_action_id: new ObjectID(),
        status: 'ended',
      },
    })
  }
}
