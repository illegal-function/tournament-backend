const url = require('url')
const { MongoClient } = require('mongodb')
const { MONGODB_URI } = process.env

const connection = {
  connect () {
    if (connection._instance)
      return Promise.resolve(connection._instance)

    return MongoClient.connect(MONGODB_URI, { useNewUrlParser: true })
      .then(client => client.db(
        // sry about this, but a mongodb connection string
        // isn't allways compliant.
        url.parse(MONGODB_URI.split(',').pop()).pathname.substring(1))
      )
      .then(db => (connection._instance = db))
  },
  collection (name) {
    return this.connect().then(c => c.collection(name))
  },
  close () {
    return this.connect().then(c => {
      connection._instance = null
      return c.s.topology.close()
    })
  },
}

module.exports = connection
