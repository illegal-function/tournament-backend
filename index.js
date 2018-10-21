module.exports = (connection) => ({
  load: require('./lib/queries/load')(connection),
  create: require('./lib/queries/create')(connection),
  update: require('./lib/queries/update')(connection),
  lockConfig: require('./lib/queries/lock-config')(connection),
  join: require('./lib/queries/join')(connection),
  unjoin: require('./lib/queries/unjoin')(connection),
  lockSignup: require('./lib/queries/lock-signup')(connection),
  selectTeams: require('./lib/queries/select-teams')(connection),
  createBrackets: require('./lib/queries/create-brackets')(connection),
  reportScore: require('./lib/queries/report-score')(connection),
  delete: require('./lib/queries/delete')(connection),
})
