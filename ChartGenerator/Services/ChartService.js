let Promise = require('bluebird')

let dataRepository  = require('../Repositories/DataRepository')
let redisRepository = require('../Repositories/RedisRepository')

let errorMsgService = require('./ErrorMsgService')

/*
//get overall distribution
let getOverAll = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.distribution === undefined) {
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

//get base game distribution
let getBaseGame = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.distribution === undefined) {
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

//get bonus game distribution
let getFreeGame = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
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
*/

let getDistribution = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.distribution === undefined) {
        reject(errorMsgService.emptyInput)
        return
      }
      return dataRepository.getDistribution(projectId, request)
    }).then(freeGame => {
      resolve(freeGame)
    }).catch(error => {
      reject(errorMsgService.serverError)
    })
  })
}

//get player experience (每 400 筆紀錄一次 RTP)
let getRTP = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.step === undefined || request.range === undefined) {
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

// get player experience (觸發 free game 壓力)
let getTotalNetWin = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      if(request.size === undefined || request.range === undefined) {
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

// get player experience (存活率分析)
let getSurvivalRate = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
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
  getDistribution: getDistribution,
  getRTP:          getRTP,
  getTotalNetWin:  getTotalNetWin,
  getSurvivalRate: getSurvivalRate
}