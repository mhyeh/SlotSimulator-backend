let Promise    = require('bluebird')
let formidable = require('formidable')
let path       = require('path')
let fs         = Promise.promisifyAll(require('fs'))

let redisRepository = require('../Repositories/RedisRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let appRoot = path.join(path.dirname(require.main.filename), '../')

let filesName = ['baseSimPar', 'bonusSimPar', 'overallSimPar', 'baseTheoryPar', 'bonusTheoryPar', 'overallTheoryPar', 'baseSpinData', 'bonusSpinData', 'overallSpinData']

let uploadFile = function(token, id, data) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let dir = appRoot + accountId + '/' + id + '/'
      let form = new formidable.IncomingForm()
      form.encoding  = 'utf-8'
      form.uploadDir = dir
      form.type      = true
      form.multiples = false
  
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(errorMsgService.fsError)
          return
        }
        let promises = []
        for (let fileName of filesName) {
          let extension = '.' + files[fileName].type
          promises.push(fs.rename(dir + files[fileName].name + extension, dir + fileName + extension))
        }
        Promise.all(promises).then(() => {
          resolve()
        }).catch(error => {
          reject(errorMsgService.fsError)
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
