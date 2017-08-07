let Promise = require('bluebird')

let dataRepository  = require('../Repositories/DataRepository')
let redisRepository = require('../Repositories/RedisRepository')

let getRTP = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      return dataRepository.getRTP(projectId, request)
    }).then(RTP => {
      resolve(RTP)
    }).catch(error => {
      reject()
    })
  })
}

let getTotalNetWin = function (token, projectId, request) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      return dataRepository.getTotalNetWin(projectId, request)
    }).then(totalNetWin => {
      resolve(totalNetWin)
    }).catch(error => {
      reject()
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
      reject()
    })
  })
}

module.exports = {
  getRTP:          getRTP,
  getTotalNetWin:  getTotalNetWin,
  getSurvivalRate: getSurvivalRate
}