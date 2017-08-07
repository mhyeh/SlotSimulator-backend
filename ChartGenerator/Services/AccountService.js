let Promise = require('bluebird')
let bcrypt  = require('bcrypt-nodejs')

let accountRepository = require('../Repositories/AccountRepository')
let redisRepository   = require('../Repositories/RedisRepository')

let errorMsgService = require('./ErrorMsgService')

let getUnusedToken = function () {
  let token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20)
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      getUnusedToken().then(resolve)
    }).catch(() => {
      resolve(token)
    })
  })
}

let createToken = function (accountId) {
  return new Promise((resolve, reject) => {
    getUnusedToken().then(token => {
      redisRepository.checkAccount(token, accountId)
      resolve(token)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let login = function (user) {
  return new Promise((resolve, reject) => {
    if (user.account === undefined || user.password === undefined) {
      reject(errorMsgService.emptyInput)
      return
    }
      
    accountRepository.getPassword(user.account).then(password => {
      if (password === '') {
        reject(errorMsgService.accountError)
        return
      }
      if (!bcrypt.compareSync(user.password, password)) {
        reject(errorMsgService.pwdError)
        return
      } else {
        return accountRepository.getAccount(user.account)
      }
    }).then(accountInfo => {
      return createToken(accountInfo.id)
    }).then(token => {
      resolve(token)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let register = function (user) {
  return new Promise((resolve, reject) => {
    if (user.password === undefined || user.checkPassword === undefined || user.account === undefined || 
      user.password != user.checkPassword || user.name === undefined) {
      reject(errorMsgService.emptyInput)
      return
    } 
    
    let hsahPassword = bcrypt.hashSync(user.password)
  
    accountRepository.getPassword(user.account).then(password => {
      if (password != '') {
        reject(errorMsgService.accountUsed)
        return
      } 
      
      return accountRepository.createAccount(user.account, hsahPassword, user.name)
    }).then(() => {
      return accountRepository.getAccount(user.account)
    }).then(accountInfo => {
      return createToken(accountInfo.id)
    }).then(token => {
      resolve(token)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let update = function (token, updateData) {
  return new Promise((resolve, reject) => {
    let userData = {}
    redisRepository.getAccountId(token).then(accountId => {
      return accountRepository.getAccountById(accountId)
    }).then((accountInfo) => {
      userData = accountInfo
      if (updateData.password === undefined) {
        reject(errorMsgService.emptyInput)
        return
      } 
      if (!bcrypt.compareSync(updateData.password, userData.password)) {
        reject(errorMsgService.pwdError)
        return
      } 
      
      updateData.newName     = ((updateData.newName != undefined) ? updateData.newName : userData.newName)
      updateData.newPassword = ((updateData.newPassword != undefined && updateData.newCheckPassword != undefined &&
                                 updateData.newPassword === updateData.newCheckPassword) ? 
        bcrypt.hashSync(updateData.newPassword) : userData.password)

      return accountRepository.updateAccount(userData.id, updateData.newPassword, updateData.newName)
    }).then(() => {
      redisRepository.set(token, userData.id)
      resolve(token)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

let checkAccount = function (account) {
  return new Promise((resolve, reject) => {
    if (account === undefined) {
      reject(errorMsgService.emptyInput)
    } else {
      accountRepository.getPassword(account).then(password => {
        if (password === '') {
          resolve()
        } else {
          reject(errorMsgService.accountUsed)
        }
      }).catch(error => {
        reject(errorMsgService.serverError)
      })
    }
  }) 
}

let getAccount = function (token) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      return accountRepository.getAccountById(accountId)
    }).then(accountInfo => {
      resolve(accountInfo)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

module.exports = {
  login:        login,
  register:     register,
  update:       update,
  checkAccount: checkAccount,
  getAccount:   getAccount
}