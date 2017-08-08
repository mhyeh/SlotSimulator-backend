let Promise = require('bluebird')

let model = require('../connect')

let getRTP = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size  = request.size
    let step  = request.step
    let range = request.range

    let result = []
    model.knex('overall').select(model.knex.row('((sum(`netWin`) + ?) / ?) as rtp, floor( (`id` - 1) / ?) as `group`', 
      [size * step, step, step])).where('id', '<', size).groupBy('group').orderBy('rtp', 'asc')
    .then(rtpSet => {
      for (let rtp of rtpSet) {
        while (rtp.rtp / range >= result.length) {
          result.push(0)
        }
        result[rtp.rtp / range]++
      }
      resolve(result)
    }).catch(error => {
      console.log(error)
      reject()
    })
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