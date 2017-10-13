let Promise    = require('bluebird')
let formidable = require('formidable')
let path       = require('path')
let fs         = require('fs')

let redisRepository  = require('../Repositories/RedisRepository')
let uploadRepository = require('../Repositories/UploadRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let extension  = '.csv'
let filesName  = ['baseSpinData', 'bonusSpinData', 'overallSpinData', 'overallSurvivalRate']
let tablesName = ['basegame', 'freegame', 'overall', 'survivalrate']

// upload files of the result of simulation
let uploadFile = function(token, id, data) {
  let dir 
  let fields
  let files
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      dir = 'userProject/' + accountId + '/' + id + '/result/'
      return fileService.processFormData(data)
    }).then(result => {
      fields = result.fields
      files  = result.files

      return fileService.moveFile(files[fields.name].path, dir + fields.name + extension)
    }).then(() => {
      for (let index in filesName) {
        if (fields.name === filesName[index]) {
          if (fields.name !== 'overallSurvivalRate') {
            uploadRepository.upload(id, tablesName[index], dir + fields.name + extension, 'netWin' + ((fields.name === 'overallSpinData') ? ',triger' : ''))
          } else {
            uploadRepository.upload(id, tablesName[index], dir + fields.name + extension, 'id,hand,isSurvival')
          }
        }
      }
      resolve()
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
