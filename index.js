module.exports = (connection, plugin) => {
  const reject = str => Promise.reject(new Error(str))
  const collection = () => connection.collection(
    plugin.collection || 'tournaments'
  )

  return {
    load (id) {
      return collection()
        .then(c => c.findOne({ _id: id }))
        .then(result => result || reject(`Tournament ${id} not found`))
    },
    create (id, params) {
      return Promise.resolve(plugin.onCreate(params))
        .then(config => {
          return collection()
            .then(c => {
              const doc = {
                _id: id,
                state: 0,
                status: 'active',
                config,
              }

              return c.insertOne(doc)
                .then(r => doc)
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
