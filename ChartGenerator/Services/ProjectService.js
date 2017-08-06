let Promise = require('bluebird')

let redisRepository    = require('../Repositories/RedisRepository')
let projectRepoisitory = require('../Repositories/ProjectRepository')
let fileService        = require('./FileService')

let dataSet  = ['name', 'block', 'thread', 'runTime', 'symbol', 'reels', 'rows', 'betCost']
let fileName = ['baseStops', 'bonusStops', 'basePayTable', 'bonusPayTable', 'attr']

let extension = '.csv'
let folder    = './'

let getAllProject = function (token) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      return projectRepoisitory.getAllProject(accountId)
    }).then(allProject => {
      resolve(allProject)
    }).catch(error => {
      reject()
    })
  })
}

let getProjectById = function (token, id) {
  return new Promise((resolve, reject) => {
    let data = {}
    redisRepository.getAccountId(token).then(accountId => {
      return projectRepoisitory.getProjectById(id)
    }).then(projectInfo => {
      data = projectInfo
      let readFile = {}
      for (let i of fileName) {
        readFile[i] = fileService.readFile(data[i])
      }
      return Promise.props(readFile)
    }).then(fileContext => {
      for (let i of fileName) {
        data[i] = fileContext[i]
      }
      resolve(data)
    }).catch(error => {
      reject()
    })
  })
}

let create = function (token, body) {
  let userId
  let data = {}
  let id
  let path
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      userId = accountId
      data = {
        userId: userId
      }

      for (let i of dataSet) {
        if (body[i] === undefined) {
          reject()
          return
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

      return projectRepoisitory.createProject(data)
    }).then(() => {
      return projectRepoisitory.getNewestProject(userId)
    }).then(projectInfo => {
      id = projectInfo.id
      path = folder + userId + '/' + id
      return fileService.createFolder(path)
    }).then(() => {
      for (let i of fileName) {
        data[i] = path + '/' + i + extension
      }
      
      let promise = []
      promise.push(projectRepoisitory.updateProject(id, data))
      for (let i of fileName) {
        promise.push(fileService.createFile(data[i], body[i]))
      }

      Promise.all(promise).then(() => {
        resolve()
      }).catch(error => {
        reject()
      })
    }).catch(error => {
      reject()
    })
  })
}

let update = function (token, id, body) {
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let userId = accountId
      let path   = folder + userId + '/' + id
  
      let data = {
        userId: userId
      }
  
      for (let i of dataSet) {
        if (body[i] === undefined) {
          reject()
          return
        } else {
          data[i] = body[i]
        }
      }
  
      for (let i of fileName) {
        if (body[i] === undefined) {
          reject()
          return
        } else {
          data[i] = path + '/' + i + extension
        }
      }
  
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
  })
}

let deleteProject = function (token, id) {
  let userId
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      userId = accountId
      return projectRepoisitory.deleteProject(id)
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