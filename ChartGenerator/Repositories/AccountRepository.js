let Promise = require('bluebird')

let model = require('../connect')

// get account's password
let getPassword = function (account) {
  return new Promise((resolve, reject) => {
    model.knex.select('password').from('account').where('account', account).then(account => {
      resolve(((account[0] === undefined) ? '' : account[0].password))
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

// get account data by id
let getAccountById = function (id) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('account').where('id', id).then(accountInfo => {
      resolve(accountInfo[0])
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

// create a new account
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

// update account data
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

// get account data by account
let getAccount = function (account) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('account').where('account', account).then(accountInfo => {
      resolve(accountInfo[0])
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