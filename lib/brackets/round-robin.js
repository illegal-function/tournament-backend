module.exports = (teams) => {
  if (teams.length % 2) teams = teams.concat([null])

  return Array(teams.length - 1).fill().map((_, i) => {
    const blue = teams.slice(0, teams.length / 2)
    const orange = teams.filter(e => !blue.includes(e)).reverse()

    const result = blue.map((v, i) => {
      return [v, orange[i]]
    })

    const fixed = teams[0]
    const rotated = teams.filter(e => e !== fixed)

    rotated.unshift(rotated.pop())
    teams = [fixed].concat(rotated)

    // remove byes
    return result.reduce((acc, cur) => {
      if (!cur.includes(null))
        acc.push(cur)
      return acc
    }, [])
  })
}
