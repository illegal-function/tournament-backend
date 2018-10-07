/* global describe it */

const _db = require('..')

describe('compiles', () => {
  it('actually compiles', () => {
    if (_db) {
      return 1
    }
  })
})
