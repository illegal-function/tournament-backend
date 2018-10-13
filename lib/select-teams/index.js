// this is just an ugly prototype
// there's no randomness to this,
// but it works for testing purposes

const splitInTwo = arr => {
  const joins = [...arr].sort((e1, e2) => {
    return e1.rating - e2.rating
  })
  const chunkSize = arr.length / 2

  return [
    joins.slice(0, chunkSize),
    joins.slice(chunkSize),
  ]
}

const splitInThree = arr => {
  const chunkSize = arr.length / 3

  return [
    arr.slice(0, chunkSize),
    arr.slice(chunkSize, chunkSize * 2),
    arr.slice(chunkSize * 2),
  ]
}

module.exports = tournament => {
  const result = []
  if (tournament.config.teamsize === 2) {
    const [group1, group2] = splitInTwo(tournament.joins)

    for (let i = 0; i < tournament.joins.length / 2; i++) {
      result.push([
        group1.shift().id,
        group2.shift().id,
      ])
    }
  } else if (tournament.config.teamsize === 3) {
    const [group1, group2, group3] = splitInThree(tournament.joins)
    for (let i = 0; i < tournament.joins.length / 3; i++) {
      result.push([
        group1.shift().id,
        group2.shift().id,
        group3.shift().id,
      ])
    }
  }
  return result.map(e => ({
    id: e[0],
    team: e,
  }))
}
