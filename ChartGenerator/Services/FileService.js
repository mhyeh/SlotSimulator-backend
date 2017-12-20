let Promise       = require('bluebird')
let path          = require('path')
let fs            = Promise.promisifyAll(require('fs'))
let mkdirp        = Promise.promisifyAll(require('mkdirp'))
let rimraf        = Promise.promisify(require('rimraf'))
let formidable    = require('formidable')
let child_process = require('child-process-promise')

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
let readFile = function (name, type = undefined) {
  return new Promise((resolve, reject) => {
    let promise
    if (type !== undefined) {
      promise = fs.readFileAsync(path.join(appRoot, name), type)
    } else {
      promise = fs.readFileAsync(path.join(appRoot, name))
    }
    promise.then(context => {
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

let processFormData = function (data) {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm()
    form.encoding       = 'utf-8'
    form.keepExtensions = true
    form.multiples      = true

    form.parse(data, (err, fields, files) => {
      if (err) {
        console.log('error')
        reject('file error')
        return
      }

      let promise = []
      for (let i in files) {
        if (Array.isArray(files[i])) {
          for (let j in files[i]) {
            promise.push(child_process.exec("tr -d '\r' < " + files[i][j].path + ' > ' + files[i][j].path))
          }
        } else {
          promise.push(child_process.exec("tr -d '\r' < " + files[i].path + ' > ' + files[i].path))
        }
      }
      Promise.all(promise).then(() => {
        resolve({fields: fields, files: files})
      }).catch(error => {
        console.log(error)
        reject()
      })
    })
  })
}

let moveFile = function (from, to) {
  return new Promise((resolve, reject) => {
    fs.rename(from, path.join(appRoot, to), err => {
      if (err) {
        reject('file error')
        return
      }
      resolve()
    })
  })
}

let copyFile = function (from, to) {
  return new Promise((resovle, reject) => {
    fs.copyFile(from, to, err => {
      if (err) {
        reject('file error')
        return
      }
      resovle()
    })
  })
}

module.exports = {
  createFile:      createFile,
  deleteFile:      deleteFile,
  readFile:        readFile,
  createFolder:    createFolder,
  deleteFolder:    deleteFolder,
  processFormData: processFormData,
  moveFile:        moveFile,
  copyFile:        copyFile
}

