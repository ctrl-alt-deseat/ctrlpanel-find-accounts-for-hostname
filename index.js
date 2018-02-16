const parseHostname = require('parse-hostname')
const stripCommonPrefixes = require('@ctrlpanel/strip-common-prefixes')

function scoreAccountFactory (hostname) {
  const hostnameWithoutPrefix = stripCommonPrefixes(hostname)
  const hostnameParts = parseHostname(hostnameWithoutPrefix)

  function scoreAccount (acc) {
    if (acc.hostname === hostname) return 1

    const withoutPrefix = stripCommonPrefixes(acc.hostname)
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
