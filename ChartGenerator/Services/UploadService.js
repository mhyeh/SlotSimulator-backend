let Promise    = require('bluebird')
let formidable = require('formidable')
let path       = require('path')
let fs         = require('fs')

let redisRepository = require('../Repositories/RedisRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let appRoot   = path.join(path.dirname(require.main.filename), '../userProject/')
let extension = '.csv'
// let filesName = ['baseSimPar', 'bonusSimPar', 'overallSimPar', 'baseTheoryPar', 'bonusTheoryPar', 'overallTheoryPar', 'baseSpinData', 'bonusSpinData', 'overallSpinData', 'overallSurvivalRate']

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
          resolve()
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
