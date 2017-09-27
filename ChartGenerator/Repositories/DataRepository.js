let Promise   = require('bluebird')
let mapify    = require('es6-mapify')
let bigNumber = require('bignumber.js')

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
      return model.knex(table[tableIndex] + projectId).select(model.knex.raw('round((`netWin` / ? + 1) * 10) / 10 as payOut, count(*) as count', [project.betCost])).where('id', '<=', size).groupBy('payOut').orderBy('payOut', 'asc')
    }).then(rows => {
      let sum   = new bigNumber(0)
      let count = 0

      let Q1  = Math.ceil(size / 4)
      let Median = Math.ceil(size / 2)
      let Q3  = Math.ceil(size * 3 / 4)

      let Q1Flag  = true
      let MedianFlag = true
      let Q3Flag  = true

      let tableData = {
        Min: 0,
        Max: 0
      }

      let i = 0
      for (let row of rows) {
        while (key[i++] < row.payOut) {}
        i--
        if (i >= key.length) {
          i = key.length - 1
        }
        result.set(key[i], result.get(key[i]) + row.count)

        count += row.count
        sum = sum.plus(new bigNumber(key[i]).times(row.count).dividedBy(50))

        if (Q1Flag && count > Q1) {
          tableData.Q1 = key[i]
          Q1Flag = false
        }
        if (MedianFlag && count > Median) {
          tableData.Median = key[i]
          MedianFlag = false
        }
        if (Q3Flag && count > Q3) {
          tableData.Q3 = key[i]
          Q3Flag = false
        }
      }

      tableData.Min = key[0]
      tableData.Max = key[i]

      tableData.Avg = sum.dividedBy(size).times(100).floor().dividedBy(100).times(50)

      resolve({chartData: mapify.demapify(result), tableData: tableData})
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
      return model.knex.raw('select `rtp`, count(*) `count` from (select (sum(`netWin`) / ? + 1) `rtp`, floor((`id` - 1) / ?) `group` from `overall' + projectId + '` where `id` <= ? group by `group`) `result` group by `rtp` order by `rtp` asc', [project.betCost * step, step, size])
    }).then(rtpSet => {
      let sum   = new bigNumber(0)
      let count = 0

      let Q1  = Math.ceil(size / step / 4)
      let Median = Math.ceil(size / step / 2)
      let Q3  = Math.ceil(size / step * 3 / 4)

      let Q1Flag  = true
      let MedianFlag = true
      let Q3Flag  = true

      let tableData = {
        Min: Math.floor(rtpSet[0][0].rtp * 100 / range) * range / 100,
        Max: Math.floor(rtpSet[0][rtpSet[0].length - 1].rtp * 100 / range) * range / 100
      }

      for (let rtp of rtpSet[0]) {
        let tmp = Math.floor(rtp.rtp * 100 / range)
        count += rtp.count
        sum = sum.plus(new bigNumber(tmp).times(range).dividedBy(100).times(rtp.count))
        
        if (Q1Flag && count > Q1) {
          tableData.Q1 = tmp * range / 100
          Q1Flag = false
        }
        if (MedianFlag && count > Median) {
          tableData.Median = tmp * range / 100
          MedianFlag = false
        }
        if (Q3Flag && count > Q3) {
          tableData.Q3 = tmp * range / 100
          Q3Flag = false
        }

        while (tmp >= result.size) {
          result.set(result.size * range / 100, 0)
        }
        result.set(tmp * range / 100, result.get(tmp * range / 100) + rtp.count)
      }

      tableData.Avg = sum.times(step).times(100).dividedBy(size).floor().dividedBy(100)

      resolve({chartData: mapify.demapify(result), tableData: tableData})
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
      let Min = 0
      let Max = 0

      let netWin = 0
      for (let row of rows) {
        if (row.triger === 0) {
          netWin += row.netWin
        } else {
          let tmp = Math.floor(netWin / range)
          while (tmp < Min || tmp > Max) {
            if (tmp < Min) {
              result.set((--Min) * range, 0)
            } else {
              result.set((++Max) * range, 0)
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
  return new Promise((resolve, reject) => {
    let size = request.size
    model.knex('survivalrate' + projectId).select().where('id', '<=', size).then(rows => {
      resolve(rows)
    }).catch(error => {
      console.log(error)
      reject()
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
