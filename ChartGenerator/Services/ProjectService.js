let Promise = require('bluebird')

let redisRepository    = require('../Repositories/RedisRepository')
let projectRepoisitory = require('../Repositories/ProjectRepository')
let fileService        = require('./FileService')

let dataSet  = ['name', 'block', 'thread', 'runTime', 'symbol', 'reels', 'rows', 'betCost']
let fileName = ['baseStops', 'bonusStops', 'basePayTable', 'bonusPayTable', 'path']

let extension = '.csv'
let folder    = './'

let getAllProject = function (token) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(req.get('Authorization')).then(result => {
      return projectRepoisitory.getAllProject(result)
    }).then(result => {
      resolve(result)
    }).catch(error => {
      reject()
    })
  })
}

let getProjectById = function (token, id) {
  return new Promise((resolve, reject) => {
    let data = {}
    redisRepository.getAccountId(token).then(result => {
      return projectRepoisitory.getProjectById(result, id)
    }).then(result => {
      data = result
  
      let readFile = {}
      for (let i of fileName) {
        readFile[i] = fileService.ReadFile(data[i])
      }
      
      return Promise.props(readFile)
    }).then(result => {
      for (let i of fileName) {
        data[i] = result[i]
      }
      resolve(data)
    }).catch(err => {
      reject()
    })
  })
}

let create = function (token, body) {
  let userId
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(result => {
      userId = result

      for (let i of dataSet) {
        if (body[i] === undefined) {
          reject()
        } else {
          data[i] = body[i]
        }
      }

      for (let i of fileName) {
        if (body[i] === undefined) {
          reject()
        } else {
          data[i] = './'
        }
      }

      return projectRepoisitory.createProject(userId, data)
    }).then(() => {
      return projectRepoisitory.getNewestProject(userId)
    }).then(result => {
      let path = folder + userId + '/' + result.id
  
      for (let i of fileName) {
        data[i] = path + '/' + i + extension
      }
    
      let promise = []
      promise.push(projectRepoisitory.updateProject(userId, data))
      for (let i of fileName) {
        promise.push(fileService.createFile(data[i], body[i]))
      }
    
      Promise.all(promise).then(() => {
        resolve()
      }).catch(error => {
        reject()
      })
    }).catch(err => {
      reject()
    })
  })
}

let update = function (token, id, body) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(result => {
      let userId = result
      let path   = folder + userId + '/' + id
  
      let data = {
        userId: userId
      }
  
      for (let i of dataSet) {
        if (body[i] === undefined) {
          res.json({error: 'serverError'})
        } else {
          data[i] = body[i]
        }
      }
  
      for (let i of fileName) {
        if (body[i] === undefined) {
          res.json({error: 'serverError'})
        } else {
          data[i] = path + '/' + i + extension
        }
      }
  
      let promise = []
      for (let i of fileName) {
        promise.push(fileService.deleteFile(data[i], body[i]))
      }
  
      Promise.all(promise).then(() => {
        let promise = []
        promise.push(projectRepoisitory.updateProject(id, data))
        for (let i of fileName) {
          promise.push(fileService.createFile(data[i], body[i]))
        }
      
        return Promise.all(promise)
      }).then(() => {
        resolve()
      }).catch(error => {
        reject()
      })
    }).catch(error => {
      reject()
    })
  })
}

let deleteProject = function (token, id) {
  let userId
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(result => {
      userId = result
      return projectRepoisitory.deleteProject(userId, id)
     }).then(() => {
      return fileService.deleteFolder(folder + userId + '/' + id)
     }).then(() => {
      resolve()
     }).catch(error => {
      reject()
     })
  })
}

module.exports = {
  getAllProject:  getAllProject,
  getProjectById: getProjectById,
  create:         create,
  update:         update,
  deleteProject:  deleteProject
}