let Promise = require('bluebird')

let redisRepository = require('../Repositories/RedisRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let extension = '.csv'
let folder    = './userProject/'

let getTable = function (token, id, type) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      let path = folder + accountId + '/' + id  + '/result/'
      return fileService.readFile(path + type + 'Par' + extension)
    }).then(result => {
      resolve(result)
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
  getTable: getTable
}