let Promise = require('bluebird')
let mapify  = require('es6-mapify')

let model = require('../connect')

let getOverAll = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size  = request.size
    let range = request.range

    let result = new Map()
  })
}

let getRTP = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size    = request.size
    let step    = request.step
    let range   = request.range
    let betCost = request.betCost

    let result = new Map()
    model.knex('overall' + projectId).
      select(model.knex.raw('((sum(`netWin`) + ?) / ?) as rtp, floor( (`id` - 1) / ?) as `group`', 
        [betCost * step, step, step])).where('id', '<', size).groupBy('group').orderBy('rtp', 'asc').then(rtpSet => {
        console.log(rtpSet)
        for (let rtp of rtpSet) {
          let tmp = Math.floor(rtp.rtp / range)
          while (tmp >= result.size) {
            result.set(range * result.size, 0)
          }
          result.set(range * tmp, result.get(range * tmp) + 1)
        }
        resolve(mapify.demapify(result))
      }).catch(error => {
        console.log(error)
        reject()
      })
  })
}

let getTotalNetWin = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size    = request.size
    let range   = request.range
    let betCost = request.betCost

    let result = new Map()
    result.set(0, 0)
    model.knex('overall' + projectId).select().where('id', '<', size).then(rows => {
      let min = 0
      let max = 0

      let netWin = 0
      for (let row of rows) {
        if (row.triger === 0) {
          netWin += row.netWin
        } else {
          let tmp = Math.floor(netWin / range)
          while (tmp < min || tmp > max) {
            if (tmp < min) {
              result.set((--min) * range, 0)
            } else {
              result.set((++max) * range, 0)
            }
          }
          netWin = 0
          result.set(range * tmp, result.get(range * tmp) + 1)
        }
      }
      resolve(mapify.demapify(result))
    }).catch(error => {
      console.log(error)
      reject()
    })
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