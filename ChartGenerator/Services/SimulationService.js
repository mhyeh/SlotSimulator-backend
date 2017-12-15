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

queue.process('makeFile', (job, done) => {
  child_process.exec('sh ' + config.makeFile.path + config.makeFile.target + ' ' + config.makeFile.path + ' ' + job.data.path).then(() => {
    done()
  }).catch(error => {
    console.log(error)
    done(new Error(error))
  })
})

queue.process('simulation', (job, done) => {
  child_process.exec(job.data.path + 'Simulation ' + job.data.path + 'input.csv ' + job.data.path + 'result/ ' + job.data.data.runTime + ' ' + job.data.data.block + ' ' + job.data.data.thread).then(() => {
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