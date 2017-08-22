let Promise = require('bluebird')

let redisRepository = require('../Repositories/RedisRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let extension = '.csv'
let folder    = './userProject/'

let getOverAllSimulation = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + 'overAll' + extension)
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

let getOverAllTheory = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + 'overAllTheory' + extension)
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

let getBaseGameSimulation = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + 'baseGame' + extension)
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

let getBaseGameTheory = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + 'baseGameTheory' + extension)
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

let getFreeGameSimulation = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + 'freeGame' + extension)
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

let getFreeGameTheory = function (token, id) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + 'freeGameTheory' + extension)
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
  getOverAllSimulation:  getOverAllSimulation,
  getOverAllTheory:      getOverAllTheory,
  getBaseGameSimulation: getBaseGameSimulation,
  getBaseGameTheory:     getBaseGameTheory,
  getFreeGameSimulation: getFreeGameSimulation,
  getFreeGameTheory:     getFreeGameTheory
}