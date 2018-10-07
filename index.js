module.exports = (connection) => ({
  load: require('./lib/queries/load')(connection),
  create: require('./lib/queries/create')(connection),
  update: require('./lib/queries/update')(connection),
  lockConfig: require('./lib/queries/lock-config')(connection),
  join: require('./lib/queries/join')(connection),
  delete: require('./lib/queries/delete')(connection),
})
