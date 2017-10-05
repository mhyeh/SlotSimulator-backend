let Promise = require('bluebird')
let bcrypt  = require('bcrypt-nodejs')

let accountRepository = require('../Repositories/AccountRepository')
let redisRepository   = require('../Repositories/RedisRepository')

let errorMsgService = require('./ErrorMsgService')

// get unused token
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

// create a new token
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

// login
let login = function (user) {
  return new Promise((resolve, reject) => {
    // check if datas aren't empty
    if (user.account === undefined || user.password === undefined) {
      reject(errorMsgService.emptyInput)
      return
    }
    
    // compare account
    accountRepository.getPassword(user.account).then(password => {
      if (password === '') {
        reject(errorMsgService.accountError)
        return
      }
      // cpmpare password
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

// register
let register = function (user) {
  return new Promise((resolve, reject) => {
    // check if datas aren't empty
    if (user.password === undefined || user.checkPassword === undefined || user.account === undefined || 
      user.password != user.checkPassword || user.name === undefined) {
      reject(errorMsgService.emptyInput)
      return
    } 
    
    // hash password
    let hsahPassword = bcrypt.hashSync(user.password)
  
    // check if the account is unused
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

// update account data
let update = function (token, updateData) {
  return new Promise((resolve, reject) => {
    let userData = {}

    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      return accountRepository.getAccountById(accountId)
    }).then((accountInfo) => {
      userData = accountInfo

      // check if the password is correct
      if (updateData.password === undefined) {
        reject(errorMsgService.emptyInput)
        return
      } 
      if (!bcrypt.compareSync(updateData.password, userData.password)) {
        reject(errorMsgService.pwdError)
        return
      } 
      
      // get update data
      updateData.newName     = ((updateData.newName != undefined) ? updateData.newName : userData.name)
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

// check if the account is unused
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

// get account data
let getAccount = function (token) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
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
