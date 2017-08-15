let Promise = require('bluebird')

let redisRepository = require('../Repositories/RedisRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let extension = '.csv'
let folder    = './userProject/'

let getOverAll = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      let promise = {}
      promise.simulation = fileService.readFile(path + 'overAll'       + extension)
      promise.theory     = fileService.readFile(path + 'overAllTheory' + extension)
      return Promise.props(promise)
    }).then(result => {
      resolve(result)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else if (error === 'file error') {
        reject(errorMsgService.fsError)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

let getBaseGame = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      let promise = {}
      promise.simulation = fileService.readFile(path + 'baseGame'       + extension)
      promise.theory     = fileService.readFile(path + 'baseGameTheory' + extension)
      return Promise.props(promise)
    }).then(result => {
      resolve(result)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else if (error === 'file error') {
        reject(errorMsgService.fsError)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

let getFreeGame = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      let promise = {}
      promise.simulation = fileService.readFile(path + 'freeGame'       + extension)
      promise.theory     = fileService.readFile(path + 'freeGameTheory' + extension)
      return Promise.props(promise)
    }).then(result => {
      resolve(result)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else if (error === 'file error') {
        reject(errorMsgService.fsError)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

module.exports = {
  getOverAll:  getOverAll,
  getBaseGame: getBaseGame,
  getFreeGame: getFreeGame
}