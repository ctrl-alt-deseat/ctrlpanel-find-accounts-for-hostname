/* eslint-env mocha */

const assert = require('assert')
const findAccountsForHostname = require('./')

describe('findAccountsForHostname(...)', () => {
  it('should find a direct match', () => {
    const accounts = [
      { hostname: 'facebook.com' },
      { hostname: 'twitter.com' },
      { hostname: 'github.com' }
    ]

    const expected = [
      { hostname: 'facebook.com', score: 1 }
    ]

    const actual = findAccountsForHostname('facebook.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find an account with a common prefix (1)', () => {
    const accounts = [
      { hostname: 'facebook.com' },
      { hostname: 'twitter.com' },
      { hostname: 'github.com' }
    ]

    const expected = [
      { hostname: 'facebook.com', score: 0.8 }
    ]

    const actual = findAccountsForHostname('sso.facebook.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find an account with a common prefix (2)', () => {
    const accounts = [
      { hostname: 'sso.facebook.com' },
      { hostname: 'auth.twitter.com' },
      { hostname: 'login.github.com' }
    ]

    const expected = [
      { hostname: 'sso.facebook.com', score: 0.8 }
    ]

    const actual = findAccountsForHostname('login.facebook.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find an account with a different subdomain (1)', () => {
    const accounts = [
      { hostname: 'hotels.airbnb.com' },
      { hostname: 'travel.facebook.com' }
    ]

    const expected = [
      { hostname: 'hotels.airbnb.com', score: 0.6 }
    ]

    const actual = findAccountsForHostname('travel.airbnb.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find an account with a different subdomain (2)', () => {
    const accounts = [
      { hostname: 'hotels.airbnb.com' },
      { hostname: 'cars.airbnb.com' }
    ]

    const expected = [
      { hostname: 'hotels.airbnb.com', score: 0.6 },
      { hostname: 'cars.airbnb.com', score: 0.6 }
    ]

    const actual = findAccountsForHostname('travel.airbnb.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find an account with a different tld (1)', () => {
    const accounts = [
      { hostname: 'airbnb.co.uk' },
      { hostname: 'example.com' },
      { hostname: 'airbnb.se' }
    ]

    const expected = [
      { hostname: 'airbnb.co.uk', score: 0.4 },
      { hostname: 'airbnb.se', score: 0.4 }
    ]

    const actual = findAccountsForHostname('airbnb.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find an account with a different tld (2)', () => {
    const accounts = [
      { hostname: 'airbnb.co.uk' },
      { hostname: 'example.com' },
      { hostname: 'hotels.airbnb.se' },
      { hostname: 'github.co.uk' }
    ]

    const expected = [
      { hostname: 'hotels.airbnb.se', score: 0.4 },
      { hostname: 'airbnb.co.uk', score: 0.2 }
    ]

    const actual = findAccountsForHostname('hotels.airbnb.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should find accounts of all types', () => {
    const accounts = [
      { hostname: 'airbnb.co.uk' },
      { hostname: 'auth.hotels.airbnb.com' },
      { hostname: 'auth.twitter.com' },
      { hostname: 'example.com' },
      { hostname: 'github.co.uk' },
      { hostname: 'hotels.airbnb.com' },
      { hostname: 'hotels.airbnb.se' },
      { hostname: 'login.github.com' },
      { hostname: 'sso.facebook.com' },
      { hostname: 'travels.airbnb.com' }
    ]

    const expected = [
      { hostname: 'auth.hotels.airbnb.com', score: 1 },
      { hostname: 'hotels.airbnb.com', score: 0.8 },
      { hostname: 'travels.airbnb.com', score: 0.6 },
      { hostname: 'hotels.airbnb.se', score: 0.4 },
      { hostname: 'airbnb.co.uk', score: 0.2 }
    ]

    const actual = findAccountsForHostname('auth.hotels.airbnb.com', accounts)

    assert.deepStrictEqual(actual, expected)
  })

  it('should handle included port/paths', () => {
    const accounts = [
      { hostname: 'mail.google.com' },
      { hostname: 'google.com/mail' },
      { hostname: 'foo.google.com:8000' }
    ]

    const expected = [
      { hostname: 'google.com/mail', score: 1 },
      { hostname: 'mail.google.com', score: 0.6 },
      { hostname: 'foo.google.com:8000', score: 0.6 }
    ]

    const actual = findAccountsForHostname('google.com/login', accounts)

    assert.deepStrictEqual(actual, expected)
  })
})
