let Promise = require('bluebird')
let mapify  = require('es6-mapify')

let projectRepository = require('./ProjectRepository')

let model = require('../connect')

let calPayOutDistribution = function (tableIndex, projectId, request) {
  let table = ['overall', 'basegame', 'freegame']

  let size          = request.size
  let distributions = JSON.parse(request.distribution)

  let result = new Map()
  let key    = []

  for (let distribution of distributions) {
    for (let i = distribution.lower; i < distribution.upper; i = Math.round((i + distribution.space) * 10) / 10) {
      key.push(i)
      result.set(i, 0)
    }
  }
  
  return new Promise((resolve, reject) => {
    projectRepository.getProjectById(projectId).then(project => {
      return model.knex(table[tableIndex] + projectId).select(model.knex.raw('round((`netWin` / ? + 1) * 10) / 10 as payOut', [project.betCost])).where('id', '<=', size).orderBy('payOut', 'asc')
    }).then(rows => {
      let i = 0
      
      for (let row of rows) {
        while (key[i++] < row.payOut) {}
        i--
        result.set(key[i], result.get(key[i]) + 1)
      }

      resolve(mapify.demapify(result))
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let getOverAll = function (projectId, request) {
  return new Promise((resolve, reject) => {
    calPayOutDistribution(0, projectId, request).then(result => {
      resolve(result)
    }).catch(() => {
      reject()
    })
  })
}

let getBaseGame = function (projectId, request) {
  return new Promise((resolve, reject) => {
    calPayOutDistribution(1, projectId, request).then(result => {
      resolve(result)
    }).catch(() => {
      reject()
    })
  })
}

let getFreeGame = function (projectId, request) {
  return new Promise((resolve, reject) => {
    calPayOutDistribution(2, projectId, request).then(result => {
      resolve(result)
    }).catch(() => {
      reject()
    })
  })
}

let getRTP = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size  = request.size
    let step  = request.step
    let range = request.range

    let result = new Map()

    projectRepository.getProjectById(projectId).then(project => {
      return model.knex('overall' + projectId).select(model.knex.raw('((sum(`netWin`) + ?) / ?) as rtp, floor((`id` - 1) / ?) as `group`', [project.betCost * step, step, step])).where('id', '<=', size).groupBy('group').orderBy('rtp', 'asc')
    }).then(rtpSet => {
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

    let result = new Map()
    result.set(0, 0)

    model.knex('overall' + projectId).select().where('id', '<=', size).then(rows => {
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
  getOverAll:      getOverAll,
  getBaseGame:     getBaseGame,
  getFreeGame:     getFreeGame,
  getRTP:          getRTP,
  getTotalNetWin:  getTotalNetWin,
  getSurvivalRate: getSurvivalRate
}