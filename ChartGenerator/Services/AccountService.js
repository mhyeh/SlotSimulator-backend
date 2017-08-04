let Promise = require('bluebird')
let bcrypt  = require('bcrypt-nodejs')

let AccountRepository = require('../Repositories/AccountRepository')
let RedisRepository   = require('../Repositories/RedisRepository')

let getUnusedToken = function () {
  let token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20)
  return new Promise((resolve, reject) => {
    RedisRepository.getAccountId(token).then(result => {
      getUnusedToken().then(resolve)
    }).catch(() => {
      resolve(token)
    })
  })
}

let createToken = function (accountId) {
  return new Promise((resolve, reject) => {
    getUnusedToken().then(result => {
      RedisRepository.checkAccount(result, accountId)
      resolve(result)
    })
  })
}

let login = function (user) {
  return new Promise((resolve, reject) => {
    if (user.account === undefined || user.password === undefined) {
      res.json({error: 'serverError'})
    }
      
    AccountRepository.getPassword(user.account).then(result => {
      if (!bcrypt.compareSync(user.password, result)) {
        reject()
      } else {
        return AccountRepository.getUserInfo(user.account)
      }
    }).then(result => {
      return createToken(result.id)
    }).then(result => {
      resolve(result)
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
        return AccountRepository.getUserInfo(user.account)
      }).then(result => {
        return createToken(result.id)
      }).then(result => {
        resolve(result)
      }).catch(error => {
        reject()
      })
    })
  })
}

let update = function (token, updateData) {
  return new Promise((resolve, reject) => {
    let userData = {}
    RedisRepository.getAccountId(token).then(result => {
      return AccountRepository.getAccountById(result)
    }).then((result) => {
      userData = result
  
      if (updateData.password === undefined || !bcrypt.compareSync(updateData.password, userData.password)) {
        res.json({error: 'serverError'})
      }
  
      updateData.newName     = ((updateData.newName != undefined) ? updateData.newName : userData.newName)
      updateData.newPassword = ((updateData.newPassword != undefined && updateData.checkNewPassword != undefined &&
                                 updateData.newPassword === updateData.checkNewPassword) ? 
                                 bcrypt.hashSync(updateData.newPassword) : userData.password)
      
      return AccountRepository.updateAccount(userData.id, updateData.newPassword, updateData.newName)
    }).then(result => {
      return createToken(userData.id)
    }).then(result => {
      resolve(result)
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
    
    AccountRepository.getPassword(account).then(() => {
      reject()
    }).catch(() => {
      resolve()
    })
  }) 
}

let getAccount = function (token) {
  return new Promise((resolve, reject) => {
    RedisRepository.getAccountId(token).then(result => {
      return AccountRepository.getAccountById(result)
    }).then(result => {
      resolve(result)
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