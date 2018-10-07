const { MongoClient } = require('mongodb')

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(client => {
    console.log('connected')
    return client.close()
  })
