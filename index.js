module.exports = (connection) => ({
  load: require('./lib/queries/load')(connection),
  create: require('./lib/queries/create')(connection),
  update: require('./lib/queries/update')(connection),
  delete: require('./lib/queries/delete')(connection),
})
