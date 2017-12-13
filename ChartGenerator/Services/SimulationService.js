let Promise       = require('bluebird')
let child_process = require('child_process')

let errorMsgService = require('./ErrorMsgService')

let config = require('../../config/config').dev.cuda

let makeFile = function (path) {
  return new Promise((resolve, reject) => {
    let sh = child_process.spawn('sh',[config.makeFile.path + config.makeFile.target, config.makeFile.path, path])
    sh.stderr.on('data', data => {
      console.log(data)
      reject(data)
      return
    })
    sh.stdout.on('data', data => {
      console.log(data)
      resolve()
    })
  })
}

let simulation = function (path, simIndex) {
  return new Promise((resolve, reject) => {
    child_process.exec(path + 'Simulation ' + path + 'input.csv', (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve()
    })
  })
}

module.exports = {
  makeFile:   makeFile,
  simulation: simulation
}