let Promise = require('bluebird')

let getRTP = function (projectId, request) {
  let size  = request.size
  let step  = request.step
  let range = request.range

  return new Promise((resolve, reject) => {
    let result = {}
  })
}

let getTotalNetWin = function (projectId, request) {
  let size  = request.size
  let range = request.range

  return new Promise((resolve, reject) => {
    let result = {}
  })
}

let getSurvivalRate = function (projectId, request) {
  let handle     = request.handle
  let bet        = request.bet
  let lowerBound = request.lowerBound
  let upperBound = request.upperBound
  let round      = request.round

  return new Promise((resolve, reject) => {
    let result = {}
  })
}

module.exports = {
  getRTP:          getRTP,
  getTotalNetWin:  getTotalNetWin,
  getSurvivalRate: getSurvivalRate
}