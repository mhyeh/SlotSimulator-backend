let Promise = require('bluebird')

let dataRepository  = require('../Repositories/DataRepository')
let redisRepository = require('../Repositories/RedisRepository')

let errorMsgService = require('./ErrorMsgService')

let getOverAll = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.distribution === undefined || request.betCost === undefined) {
        reject(errorMsgService.emptyInput)
        return
      }
      return dataRepository.getOverAll(projectId, request)
    }).then(overAll => {
      resolve(overAll)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let getBaseGame = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.distribution === undefined || request.betCost === undefined) {
        reject(errorMsgService.emptyInput)
        return
      }
      return dataRepository.getBaseGame(projectId, request)
    }).then(baseGame => {
      resolve(baseGame)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let getFreeGame = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.distribution === undefined) {
        reject(errorMsgService.emptyInput)
        return
      }
      return dataRepository.getFreeGame(projectId, request)
    }).then(freeGame => {
      resolve(freeGame)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let getRTP = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size  === undefined || request.step    === undefined || 
         request.range === undefined || request.betCost === undefined) {
        reject(errorMsgService.emptyInput)
        return
      }
      return dataRepository.getRTP(projectId, request)
    }).then(RTP => {
      resolve(RTP)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let getTotalNetWin = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.range === undefined || request.betCost === undefined) {
        reject(errorMsgService.emptyInput)
        return
      }
      return dataRepository.getTotalNetWin(projectId, request)
    }).then(totalNetWin => {
      resolve(totalNetWin)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

let getSurvivalRate = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      return dataRepository.getSurvivalRate(projectId, request)
    }).then(survivalRate => {
      resolve(survivalRate)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

module.exports = {
  getOverAll:      getOverAll,
  getBaseGame:     getBaseGame,
  getFreeGame:     getFreeGame,
  getRTP:          getRTP,
  getTotalNetWin:  getTotalNetWin,
  getSurvivalRate: getSurvivalRate
}