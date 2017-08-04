let Promise = require('bluebird')
let bcrypt  = require('bcrypt-nodejs')

let AccountRepository = require('../Repositories/AccountRepository')
let RedisRepository   = require('../Repositories/RedisRepository')

let getUnusedToken = function () {
  let token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20)
  return new Promise((resolve, reject) => {
    RedisRepository.getAccountId(token).then(accountId => {
      getUnusedToken().then(resolve)
    }).catch(() => {
      resolve(token)
    })
  })
}

let createToken = function (accountId) {
  return new Promise((resolve, reject) => {
    getUnusedToken().then(token => {
      RedisRepository.checkAccount(token, accountId)
      resolve(token)
    })
  })
}

let login = function (user) {
  return new Promise((resolve, reject) => {
    if (user.account === undefined || user.password === undefined) {
      res.json({error: 'serverError'})
    }
      
    AccountRepository.getPassword(user.account).then(password => {
      if (!bcrypt.compareSync(user.password, password)) {
        reject()
      } else {
        return AccountRepository.getAccount(user.account)
      }
    }).then(accountInfo => {
      return createToken(accountInfo.id)
    }).then(token => {
      resolve(token)
    }).catch(error => {
      reject()
    })
  })
}

let register = function (user) {
  return new Promise((resolve, reject) => {
    if (user.password === undefined || user.checkPassword === undefined || user.account === undefined || 
      user.password != user.checkPassword || user.name === undefined) {
      reject()
    }
  
    let hsahPassword = bcrypt.hashSync(user.password);
  
    AccountRepository.getPassword(user.account).then(() => {
      reject()
    }).catch(() => {
      AccountRepository.createAccount(user.account, hsahPassword, user.name).then(() => {
        return AccountRepository.getAccount(user.account)
      }).then(accountInfo => {
        return createToken(accountInfo.id)
      }).then(token => {
        resolve(token)
      }).catch(error => {
        reject()
      })
    })
  })
}

let update = function (token, updateData) {
  return new Promise((resolve, reject) => {
    let userData = {}
    RedisRepository.getAccountId(token).then(accountId => {
      return AccountRepository.getAccountById(accountId)
    }).then((accountInfo) => {
      userData = accountInfo
  
      if (updateData.password === undefined || !bcrypt.compareSync(updateData.password, userData.password)) {
        res.json({error: 'serverError'})
      }
  
      updateData.newName     = ((updateData.newName != undefined) ? updateData.newName : userData.newName)
      updateData.newPassword = ((updateData.newPassword != undefined && updateData.checkNewPassword != undefined &&
                                 updateData.newPassword === updateData.checkNewPassword) ? 
                                 bcrypt.hashSync(updateData.newPassword) : userData.password)
      
      return AccountRepository.updateAccount(userData.id, updateData.newPassword, updateData.newName)
      }).then(() => {
      return createToken(userData.id)
      }).then(token => {
      resolve(oken)
    }).catch(error => {
      reject()
    })
  })
}

let checkAccount = function (account) {
  return new Promise((resolve, reject) => {
    if (account === undefined) {
      reject()
    }
    
    AccountRepository.getPassword(account).then(password => {
      reject()
    }).catch(() => {
      resolve()
    })
  }) 
}

let getAccount = function (token) {
  return new Promise((resolve, reject) => {
    RedisRepository.getAccountId(token).then(accountId => {
      return AccountRepository.getAccountById(accountId)
    }).then(accountInfo => {
      resolve(accountInfo)
    }).catch(error => {
      reject()
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