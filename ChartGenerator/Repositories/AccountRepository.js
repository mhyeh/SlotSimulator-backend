let Promise = require('bluebird')

let model = require('../connect')

let getPassword = function (account) {
  return new Promise((resolve, reject) => {
    model.knex.select('password').from('account').where('account', account).then(password => {
      resolve(password)
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let getAccountById = function (id) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('account').where('id', id).then(accountInfo => {
      resolve(accountInfo)
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let createAccount = function (account, password, name) {
  return new Promise((resolve, reject) => {
    model.knex('account').insert({account: account, password: password, name: name}).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let updateAccount = function (id, password, name) {
  return new Promise((resolve, reject) => {
    model.knex('account').where('id', id).update({password: password, name: name}).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let getAccount = function (account) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('account').where('account', account).then(accountInfo => {
      resolve(accountInfo)
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

module.exports = {
  getPassword:    getPassword,
  getAccountById: getAccountById,
  createAccount:  createAccount,
  updateAccount:  updateAccount,
  getAccount:     getAccount
}