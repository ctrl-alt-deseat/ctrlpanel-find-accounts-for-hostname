const parseHostname = require('parse-hostname')
const stripCommonPrefixes = require('@ctrlpanel/strip-common-prefixes')

function stripPath (input) {
  const idx = input.indexOf('/')
  return (idx === -1 ? input : input.slice(0, idx))
}

function scoreAccountFactory (hostname) {
  const hostnameWithoutPath = stripPath(hostname)
  const hostnameWithoutPrefix = stripCommonPrefixes(hostnameWithoutPath)
  const hostnameParts = parseHostname(hostnameWithoutPrefix)

  function scoreAccount (acc) {
    const withoutPath = stripPath(acc.hostname)
    if (withoutPath === hostnameWithoutPath) return 1

    const withoutPrefix = stripCommonPrefixes(withoutPath)
    if (withoutPrefix === hostnameWithoutPrefix) return 0.8

    const parts = parseHostname(withoutPrefix)
    if (parts[1] === hostnameParts[1] && parts[2] === hostnameParts[2]) return 0.6
    if (parts[0] === hostnameParts[0] && parts[1] === hostnameParts[1]) return 0.4
    if (parts[1] === hostnameParts[1]) return 0.2

    return 0
  }

  return scoreAccount
}

function findAccountsForHostnameFactory (hostname) {
  const scoreAccount = scoreAccountFactory(hostname)

  function findAccountsForHostname (accounts) {
    return accounts
      .map(acc => Object.assign({}, acc, { score: scoreAccount(acc) }))
      .filter(acc => acc.score > 0)
      .sort((lhs, rhs) => rhs.score - lhs.score)
  }

  return findAccountsForHostname
}

module.exports = function findAccountsForHostname (hostname, accounts) {
  return findAccountsForHostnameFactory(hostname)(accounts)
}
