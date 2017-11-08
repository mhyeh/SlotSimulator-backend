let Promise   = require('bluebird')
let mapify    = require('es6-mapify')
let bigNumber = require('bignumber.js')

let projectRepository = require('./ProjectRepository')

let fileService = require('../Services/FileService')

let model = require('../connect')

// calculate payout distribution
let getDistribution = function (projectId, request) {
  let size          = request.size
  let distributions = JSON.parse(request.distribution)

  let result = new Map()
  let key    = []

  // create a set according to config
  for (let distribution of distributions) {
    for (let i = distribution.lower; i < distribution.upper; i = Math.round((i + distribution.space) * 10) / 10) {
      key.push(i)
      result.set(i, 0)
    }
  }
  
  return new Promise((resolve, reject) => {
    // get the bet cost of project
    projectRepository.getProjectById(projectId).then(project => {
      // 計算每筆 payout 到小數點第一位 以及他的出現次數
      return model.knex(request.table + projectId).select(model.knex.raw('round((`netWin` / ? + 1) * 10) / 10 as payOut, count(*) as count', [project.betCost])).where('id', '<=', size).groupBy('payOut').orderBy('payOut', 'asc')
    }).then(rows => {
      let sum = 0
      let count = 0

      let Q1     = Math.ceil(size / 4)
      let Median = Math.ceil(size / 2)
      let Q3     = Math.ceil(size * 3 / 4)

      let Q1Flag     = true
      let MedianFlag = true
      let Q3Flag     = true

      let tableData = {
        Min: 0,
        Max: 0
      }

      // categorize each payout into the set
      let i = 0
      for (let row of rows) {
        let tmp = i
        while (i < key.length - 1 && key[i] <= row.payOut) {
          i++
        }
        if (i - tmp > 0) {
          i--
        }
        result.set(key[i], result.get(key[i]) + row.count)

        count += row.count // calculate the sum of occurrences time       
        sum   += key[i] * row.count // calculate the sum of payout

        // get Q1, Median and Q3
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

      // get min and max payout
      tableData.Min = key[0]
      tableData.Max = key[i]

      // get average RTP
      tableData.Avg = Math.floor(sum / size * 100) / 100

      resolve({chartData: mapify.demapify(result), tableData: tableData})
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

// get player experience (每 400 筆紀錄一次 RTP)
let getRTP = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size  = request.size
    let step  = request.step
    let range = request.range

    let result = new Map()

    // get the bet cost of project
    projectRepository.getProjectById(projectId).then(project => {
      // 根據指定場數紀錄 RTP，並計算不同 RTP 的出現次數
      return model.knex.raw('select `rtp`, count(*) `count` from (select (sum(`netWin`) / ? + 1) `rtp`, floor((`id` - 1) / ?) `group` from `overall' + projectId + '` where `id` <= ? group by `group`) `result` group by `rtp` order by `rtp` asc', [project.betCost * step, step, size])
    }).then(rtpSet => {
      let sum   = 0
      let count = 0

      let Q1     = Math.ceil(size / step / 4)
      let Median = Math.ceil(size / step / 2)
      let Q3     = Math.ceil(size / step * 3 / 4)

      let Q1Flag     = true
      let MedianFlag = true
      let Q3Flag     = true

      // get min and max RTP
      let tableData = {
        Min: Math.floor(rtpSet[0][0].rtp * 100 / range) * range / 100,
        Max: Math.floor(rtpSet[0][rtpSet[0].length - 1].rtp * 100 / range) * range / 100
      }

      // categorize each RTP into the set
      for (let rtp of rtpSet[0]) {
        let tmp = Math.floor(rtp.rtp * 100 / range)

        count += rtp.count // calculate the sum of occurrences time    
        sum   += tmp * range / 100 * rtp.count // calculate the sum of payout
        
        // get Q1, Median and Q3
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

      // get average RTP
      tableData.Avg = Math.floor(sum * step * 100 / size) / 100

      resolve({chartData: mapify.demapify(result), tableData: tableData})
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

// get player experience (觸發 free game 壓力)
let getTotalNetWin = function (projectId, request) {
  return new Promise((resolve, reject) => {
    let size    = request.size
    let range   = request.range

    let result = new Map()
    result.set(0, 0)

    // get all spin data
    model.knex('overall' + projectId).select().where('id', '<=', size).then(rows => {
      let Min = 0
      let Max = 0

      let netWin = 0
      // categorize each netWin into the set
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

// get player experience (存活率分析)
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

let getRawData = function (projectId, dataFormat) {
  return new Promise((resolve, reject) => {
    model.knex('others' + projectId).select().where('name', dataFormat.name).then(rows => {
      return fileService.readFile(rows[0].data, 'r')
    }).then(data => {
      let rawData = new Buffer(data)
      let formats = dataFormat.format
      let result  = {}

      return parseBinary(rawData, formats, 0, 0, result)
    }).then(result => {
      resolve(result.result)
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let parseBinary = function(rawData, format, deep, index, result) {
  return new Promise((resolve, reject) => {
    if (format.length <= deep) {
      resolve({result: result, index: index})
      return
    }

    if (format[deep].type === 'int') {
      result[format[deep].name] = rawData.readInt32LE(index)
      resolve(parseBinary(rawData, format, deep + 1, index + 4, result))
    } else if (format[deep].type === 'double') {
      result[format[deep].name] = rawData.readDoubleLE(index)
      resolve(parseBinary(rawData, format, deep + 1, index + 8, result))
    } else if (format[deep].type === 'string') {
      result[format[deep].name] = rawData.toString('ascii', index, index + format[deep].length)
      resolve(parseBinary(rawData, format, deep + 1, index + format[deep].length, result))
    } else if (format[deep].type === 'object') {
      parseBinary(rawData, format[deep].content, 0, index, {}).then(res => {
        result[format[deep].name] = res.result
        resolve(parseBinary(rawData, format, deep + 1, res.index, result))
      })
    } else if (format[deep].type === 'array') {
      (function parseArray(arr) {
        return new Promise((resolve, reject) => {
          if (format[deep].length !== undefined) {
            (function loop(i) {
              parseBinary(rawData, format[deep].content, 0, index, {}).then(res => {
                arr.push(res.result[format[deep].content[0].name])
                index = res.index
                if (i < format[deep].length) {
                  loop(i + 1)
                } else {
                  resolve(arr)
                }
              })
            })(1)
            
          } else {
            (function loop() {
              parseBinary(rawData, format[deep].content, 0, index, {}).then(res => {
                arr.push(res.result[format[deep].content[0].name])
                index = res.index
                loop()
              }).catch(() => {
                resolve(arr)
              })
            })()
          }
        })      
      })([]).then(res => {
        result[format[deep].name] = res
        resolve(parseBinary(rawData, format, deep + 1, index, result))
      })
    }
  })
}

module.exports = {
  getDistribution: getDistribution,
  getRTP:          getRTP,
  getTotalNetWin:  getTotalNetWin,
  getSurvivalRate: getSurvivalRate,
  getRawData:      getRawData
}
