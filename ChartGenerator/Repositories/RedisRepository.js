var Promise = require('bluebird')
var AccountRepository = require('./AccountRepository')
var redis = Promise.promisifyAll(require('redis'))

var existTime = 60 * 30
var cache = redis.createClient()

cache.on('ready', err => {
  console.log('ready')
})

cache.on("error", err => {
  console.log(err)
})

let set = function (token, accountId) {
  cache.set(token, accountId)
  cache.expire(token, existTime)

  cache.set(accountId, token)
  cache.expire(accountId, existTime)
}

let checkAccount = function (token, accountId) {
  let Token = token
  let AccountId = accountId

  getAccount(AccountId).then(result => {
    return cache.delAsync(result)
  }).then(() => {
    return cache.delAsync(AccountId)
  }).then(() => {
    set(Token, AccountId)
  }).catch(() => {
    set(Token, AccountId)
  })
}

let getAccountId = function (token) {
  return new Promise((resolve, reject) => {
    cache.getAsync(token).then(result => {
      if (result) {
        resolve(result)
      } else {
        reject()
      }
    })
  })
}

let getUserData = function (token) {
  return new Promise((resolve, reject) => {
    getAccountId(token).then(result => {
      return AccountRepository.getAccountById(result)
    }).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}

module.exports = {
  set:          set,
  checkAccount: checkAccount,
  getAccountId: getAccountId,
  getUserData:  getUserData
}