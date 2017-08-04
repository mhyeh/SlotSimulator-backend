let Promise = require('bluebird')
let fs      = Promise.promisifyAll(require('fs'))
let mkdirp  = Promise.promisifyAll(require('mkdirp'))
let rimraf  = Promise.promisify(require('rimraf'))

let createFile = function (name, context) {
  return new Promise((resolve, reject) => {
    fs.writeFileAsync(name, context).then(() => {
      resolve()
    }).catch(error => {
      reject()
    })
  })
}

let deleteFile = function (name) {
  return new Promise((resolve, reject) => {
    fs.unlinkAsync(name).then(() => {
      resolve()
    }).catch(error => {
      reject()
    })
  })
}

let readFile = function (name) {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(name).then((context) => {
      resolve(context)
    }).catch(error => {
      reject()
    })
  })
}

let createFolder = function (name) {
  return new Promise((resolve, reject) => {
    mkdirp.mkdirpAsync(name).then(() => {
      resolve()
    }).catch(error => {
      reject()
    })
  })
}

let deleteFolder = function (path) {
  return new Promise((resolve, reject) => {
    rimraf(path).then(() => {
      resolve()
    }).catch(error => {
      reject()
    })
  })
}

module.exports = {
  createFile:   createFile,
  deleteFile:   deleteFile,
  readFile:     readFile,
  createFolder: createFolder,
  deleteFolder: deleteFolder
}

