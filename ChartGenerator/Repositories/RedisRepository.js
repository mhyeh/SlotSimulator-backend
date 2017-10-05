var Promise = require('bluebird')
var redis = Promise.promisifyAll(require('redis'))

var accountRepository = require('./AccountRepository')

var existTime = 60 * 60 * 2
var cache = redis.createClient()

cache.on('ready', error => {
  console.log('ready')
})

cache.on('error', error => {
  console.log(error)
})

// set new account and token into redis
let set = function (token, accountId) {
  cache.set(token, accountId)
  cache.expire(token, existTime)

  cache.set(accountId, token)
  cache.expire(accountId, existTime)
}

// check if account or token are exist in redis
let checkAccount = function (token, accountId) {
  let Token = token
  let AccountId = accountId

  getAccountId(AccountId).then(result => {
    return cache.delAsync(result)
  }).then(() => {
    return cache.delAsync(AccountId)
  }).then(() => {
    set(Token, AccountId)
  }).catch(() => {
    set(Token, AccountId)
  })
}

// get account id by token
let getAccountId = function (token) {
  return new Promise((resolve, reject) => {
    cache.getAsync(token).then(accountId => {
      if (accountId) {
        resolve(accountId)
      } else {
        reject('token expired')
      }
    }).catch(error => {
      reject('token expired')
    })
  })
}

// get account data by token
let getAccountInfo = function (token) {
  return new Promise((resolve, reject) => {
    getAccountId(token).then(accountId => {
      return accountRepository.getAccountById(accountId)
    }).then(accountInfo => {
      resolve(accountInfo)
    }).catch(error => {
      console.log(error)
      reject(error)
    })
  })
}

module.exports = {
  set:             set,
  checkAccount:    checkAccount,
  getAccountId:    getAccountId,
  getAccountInfo:  getAccountInfo
}
