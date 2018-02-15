declare interface Account { hostname: string }
declare interface Scored { score: number }
declare function findAccountsForHostname<T extends Account> (hostname: string, accounts: T[]): (T & Scored)[]
export = findAccountsForHostname
