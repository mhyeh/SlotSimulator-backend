let Promise = require('bluebird')
let path    = require('path')
let fs      = Promise.promisifyAll(require('fs'))
let mkdirp  = Promise.promisifyAll(require('mkdirp'))
let rimraf  = Promise.promisify(require('rimraf'))

let appRoot = path.join(path.dirname(require.main.filename), '../')

// create a new file and write content in it
let createFile = function (name, context) {
  return new Promise((resolve, reject) => {
    
    fs.writeFileAsync(path.join(appRoot, name), context).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject('file error')
    })
  })
}

// delete a file
let deleteFile = function (name) {
  return new Promise((resolve, reject) => {
    fs.unlinkAsync(path.join(appRoot, name)).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject('file error')
    })
  })
}

// read a file
let readFile = function (name) {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(path.join(appRoot, name), 'utf8').then(context => {
      resolve(context)
    }).catch(error => {
      console.log(error)
      reject('file error')
    })
  })
}

// create a new folder (can be nested)
let createFolder = function (name) {
  return new Promise((resolve, reject) => {
    mkdirp.mkdirpAsync(name).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject('file error')
    })
  })
}

// delete a folder (can be nested)
let deleteFolder = function (path) {
  return new Promise((resolve, reject) => {
    rimraf(path).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject('file error')
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

