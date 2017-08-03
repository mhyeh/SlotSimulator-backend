let Promise = require('bluebird')

let getPassword = function (account) {
  return new Promise((resolve, reject) => {
    // TODO: sql select where account = account
  })
}

let getAccountById = function (id) {
  return new Promise((resolve, reject) => {
    // TODO: sql select where id = id
  })
}

let createAccount = function (account, password, name) {
  return new Promise((resolve, reject) => {
    // TODO: sql insert
  })
}

let updateAccount = function (id, password, name) {
  return new Promise((resolve, reject) => {
    // TODO: sql update where id = id
  })
}

let getUserInfo = function (account) {
  return new Promise((resolve, reject) => {
    // TODO: sql select where account = account
  })
}

module.exports = {
  getPassword:    getPassword,
  getAccountById: getAccountById,
  createAccount:  createAccount,
  updateAccount:  updateAccount,
  getUserInfo:    getUserInfo
}