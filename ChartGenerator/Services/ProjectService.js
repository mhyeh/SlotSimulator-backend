let Promise = require('bluebird')

let redisRepository       = require('../Repositories/RedisRepository')
let projectRepoisitory    = require('../Repositories/ProjectRepository')
let projectTypeRepository = require('../Repositories/ProjectTypeRepository')

let fileService     = require('./FileService')
let errorMsgService = require('./ErrorMsgService')

let dataSet  = ['name', 'typeId', 'block', 'thread', 'runTime', 'symbol', 'reels', 'rows', 'betCost']
let fileName = ['baseStops', 'bonusStops', 'basePayTable', 'bonusPayTable', 'attr']

let extension = '.csv'
let folder    = './userProject/'

// get all project
let getAllProject = function (token) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      return projectRepoisitory.getAllProject(accountId)
    }).then(allProject => {
      resolve(allProject)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

//get spectify project
let getProjectById = function (token, id) {
  return new Promise((resolve, reject) => {
    let data = {}
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      return projectRepoisitory.getProjectById(id)
    }).then(projectInfo => {
      //之後不會用到 要改寫
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

//get all type of project 
let getAllProjectType = function (token) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      return projectTypeRepository.getAllType()
    }).then(type => {
      resolve(type)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

// get spectify type of project 
let getProjectTypeById = function (token, id) {
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      return projectTypeRepository.getTypeById(id)
    }).then(type => {
      resolve(type)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else if (error === 'Project type error') {
        reject(errorMsgService.noProjectType)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

// create a new project (需要改寫)
let create = function (token, body) {
  let userId
  let data = {}
  let id
  let path
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      userId = accountId
      data = {
        userId: userId
      }

      for (let i of dataSet) {
        if (body[i] === undefined) {
          reject(errorMsgService.emptyInput)
          return
        } else {
          data[i] = body[i]
        }
      }

      for (let i of fileName) {
        if (body[i] === undefined) {
          reject(errorMsgService.emptyInput)
          return
        } else {
          data[i] = './'
        }
      }
      return projectTypeRepository.getTypeById(data.typeId)
    }).then(() => {
      return projectRepoisitory.createProject(data)
    }).then(() => {
      return projectRepoisitory.getNewestProject(userId)
    }).then(projectInfo => {
      id = projectInfo.id
      path = folder + userId + '/' + id
      return fileService.createFolder(path)
    }).then(() => {
      return fileService.createFolder(path + '/result')
    }).then(() => {
      for (let i of fileName) {
        data[i] = path + '/' + i + extension
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
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
      } else if (error === 'Project type error') {
        reject(errorMsgService.noProjectType)
      } else if (error === 'file error') {
        reject(errorMsgService.fsError)
      } else {
        reject(errorMsgService.serverError)
      }
    })
  })
}

// update project (需要改寫)
let update = function (token, id, body) {
  let data
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      let userId = accountId
      let path   = folder + userId + '/' + id
  
      data = {
        userId: userId
      }
  
      for (let i of dataSet) {
        if (body[i] === undefined) {
          reject(errorMsgService.emptyInput)
          return
        } else {
          data[i] = body[i]
        }
      }
  
      for (let i of fileName) {
        if (body[i] === undefined) {
          reject(errorMsgService.emptyInput)
          return
        } else {
          data[i] = path + '/' + i + extension
        }
      }
      
      return projectTypeRepository.getTypeById(data.typeId)
    }).then(() => {
      let promise = []
      promise.push(projectRepoisitory.updateProject(id, data))
      for (let i of fileName) {
        promise.push(fileService.createFile(data[i], body[i]))
      }
    
      return Promise.all(promise)
    }).then(() => {
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

//delete project
let deleteProject = function (token, id) {
  let userId
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      userId = accountId
      return projectRepoisitory.deleteProject(id)
    }).then(() => {
      return fileService.deleteFolder(folder + userId + '/' + id)
    }).then(() => {
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
  getAllProject:      getAllProject,
  getProjectById:     getProjectById,
  getAllProjectType:  getAllProjectType,
  getProjectTypeById: getProjectTypeById,
  create:             create,
  update:             update,
  deleteProject:      deleteProject
}