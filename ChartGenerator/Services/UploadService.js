let Promise    = require('bluebird')
let formidable = require('formidable')
let path       = require('path')
let fs         = require('fs')

let redisRepository  = require('../Repositories/RedisRepository')
let uploadRepository = require('../Repositories/UploadRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let appRoot    = path.join(path.dirname(require.main.filename), '../userProject/')
let extension  = '.csv'
let filesName  = ['baseSpinData', 'bonusSpinData', 'overallSpinData', 'overallSurvivalRate']
let tablesName = ['basegame', 'freegame', 'overall', 'survivalrate']

let uploadFile = function(token, id, data) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let dir = appRoot + accountId + '/' + id + '/result/'
      let form = new formidable.IncomingForm()
      form.encoding       = 'utf-8'
      form.uploadDir      = dir
      form.keepExtensions = true
      form.multiples      = false
      form.parse(data, (err, fields, files) => {
        if (err) {
          console.log('error')
          reject(errorMsgService.fsError)
          return
        }
        fs.rename(files[fields.name].path, dir + fields.name + extension, (err) => {
          if (err) {
            reject(errorMsgService.fsError)
            return
          }
          let promise
          let flag = true;
          for (index in filesName) {
            if (fields.name === filesName[index]) {
                promise = uploadRepository.upload(id, tablesName[index], dir + fields.name + extension, 'col2' + (fields.name === 'overallSpinData' ? ',col3' : ''))
                flag = false
            }
          }
          if (flag) {
            resolve()
          } else {
            promise.then(() => {
              resolve()
            }).catch(error => {
              reject(errorMsgService.serverError)
            })
          }
        })
      })
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else if (error === 'file error') {
        reject(errorMsgService.fsError)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

module.exports = {
  uploadFile: uploadFile
}
