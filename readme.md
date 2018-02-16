# Find Accounts for Hostname

Find accounts that as closely as possible matches a hostname.

## Installation

```sh
npm install --save @ctrlpanel/find-accounts-for-hostname
```

## Usage

```js
const findAccountsForHostname = require('@ctrlpanel/find-accounts-for-hostname')

const accounts = [
  { hostname: 'github.com', /* any other properties */ },
  { hostname: 'twitter.com', /* any other properties */ },
  { hostname: 'airbnb.com', /* any other properties */ },
  { hostname: 'facebook.com', /* any other properties */ },
  { hostname: 'google.com', /* any other properties */ }
]

console.log(findAccountsForHostname('facebook.com', accounts))
//=> [{ hostname: 'facebook.com', score: 1, /* any other properties */ }]

console.log(findAccountsForHostname('login.github.com', accounts))
//=> [{ hostname: 'github.com', score: 0.8, /* any other properties */ }]

console.log(findAccountsForHostname('travels.airbnb.com', accounts))
//=> [{ hostname: 'airbnb.com', score: 0.6, /* any other properties */ }]

console.log(findAccountsForHostname('twitter.se', accounts))
//=> [{ hostname: 'twitter.com', score: 0.4, /* any other properties */ }]

console.log(findAccountsForHostname('chat.google.se', accounts))
//=> [{ hostname: 'google.com', score: 0.2, /* any other properties */ }]
```
