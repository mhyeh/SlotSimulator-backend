let Promise       = require('bluebird')
let child_process = require('child-process-promise')
let kue           = require('kue')

let errorMsgService = require('./ErrorMsgService')

let config = require('../../config/config').dev.cuda

let queue = kue.createQueue()

queue.watchStuckJobs(1000)
queue.on('ready', () => {
  console.log('ready')
})
queue.on('error', error => {
  console.log(error)
})

queue.process('makeFile', (data, done) => {
  child_process.exec('sh ' + config.makeFile.path + config.makeFile.target + ' ' + config.makeFile.path + ' ' + data.path).then((result) => {
    console.log(result.stdout)
    done()
  }).catch(error => {
    console.log(error)
    done(new Error(error))
  })
})

queue.process('simulation', (data, done) => {
  child_process.exec(data.path + 'Simulation ' + data.path + 'input.csv ' + data.path + 'result/ ' + data.data.runTime + ' ' + data.data.block + ' ' + data.data.thread).then((result) => {
    console.log(result.stdout)
    done()
  }).catch(error => {
    console.log(error)
    done(new Error(error))
  })
})


let makeFile = function (path) {
  return new Promise((resolve, reject) => {
    let job = queue.create('makeFile', {path: path})
      .priority('critical')
      .removeOnComplete(true)
      .save()
    
    job.on('complete', () => {
      resolve()
    }).on('failed', () => {
      reject()
    })
  })
}

let simulation = function (path, data) {
  return new Promise((resolve, reject) => {
    let job = queue.create('simulation', {path: path, data: data})
    .priority('critical')
    .removeOnComplete(true)
    .save()

    job.on('complete', () => {
      resolve()
    }).on('failed', () => {
      reject()
    })
  })
}

module.exports = {
  makeFile:   makeFile,
  simulation: simulation
}