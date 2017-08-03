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

let set = function (token, account) {
  cache.set(token, account)
  cache.expire(token, existTime)

  cache.set(account, token)
  cache.expire(account, existTime)
}

let checkAccount = function (token, account) {
  let Token = token
  let Account = account

  getAccount(Account).then(result => {
    return cache.delAsync(result)
  }).then(() => {
    return cache.delAsync(Account)
  }).then(() => {
    set(Token, Account)
  }).catch(() => {
    set(Token, Account)
  })
}

let getAccount = function (token) {
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
    getAccount(token).then(result => {
      return AccountRepository.getUserInfo(result)
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
  getAccount:   getAccount,
  getUserData:  getUserData
}