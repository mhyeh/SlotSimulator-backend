let Promise       = require('bluebird')
let child_process = require('child_process')

let redisRepository       = require('../Repositories/RedisRepository')
let projectRepoisitory    = require('../Repositories/ProjectRepository')
let projectTypeRepository = require('../Repositories/ProjectTypeRepository')

let simulationService = require('./SimulationService')
let fileService       = require('./FileService')
let errorMsgService   = require('./ErrorMsgService')

let dataSet  = ['name', 'block', 'thread', 'runTime', 'reels', 'rows', 'betCost']
let fileName = ['symbol', 'stops', 'payTable', 'attr', 'basePattern', 'bonusPattern']

let csv    = '.csv'
let folder = './userProject/'

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
      resolve(projectInfo)
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

// create a new project 
let create = function (token, body) {
  let userId
  let data
  let id
  let path
  let fields
  let files
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      userId = accountId
      data = {
        userId: userId
      }

      return fileService.processFormData(body)
    }).then(result => {
      fields = result.fields
      files  = result.files

      for (let i of dataSet) {
        if (fields[i] === undefined) {
          reject(errorMsgService.emptyInput)
          return
        } else {
          data[i] = fields[i]
        }
      }

      for (let i of fileName) {
        data[i] = './'
      }

      data.config    = './'
      data.gameLogic = './'

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
      let promise = []
      for (let i of fileName) {
        if (files[i] !== undefined) {
          if (!Array.isArray(files[i])) {
            data[i] = path + '/' + i + csv
            promise.push(fileService.moveFile(files[i].path, data[i]))
          } else {
            data[i] = ''
            for (let j in files[i]) {
              let filePath = path + '/' + i + j + csv
              data[i] += filePath + ','
              promise.push(fileService.moveFile(files[i][j].path, filePath))
            }
            data[i] = data[i].slice(0, -1)
          }
        }
      }
      
      if (files.config !== undefined) {
        data.config = path + '/config.js'
        promise.push(fileService.moveFile(files.config.path, data.config))
      }
      if (files.gameLogic !== undefined) {
        data.gameLogic = path + '/gameLogic.cu'
        promise.push(fileService.moveFile(files.gameLogic.path, data.gameLogic))
      }

      let inputFile = data['symbol']
      for (let i of ['reels', 'rows', 'betCost']) {
        inputFile += ',' + data[i]
      }
      inputFile += '\n'
      for (let i of ['', '', '', 'stops', 'payTable', 'attr', 'basePattern']) {
        if (files[i] !== undefined) {
          inputFile += i + csv + ','
        } else {
          inputFile += ','
        }
        inputFile = inputFile.slice(0, -1)
      }
      inputFile += '\n'
      for (let i of ['', '', '', 'stops', 'payTable', '', 'bonusPattern']) {
        if (files[i] !== undefined) {
          inputFile += i + csv + ','
        } else {
          inputFile += ','
        }
        inputFile = inputFile.slice(0, -1)
      }
      promise.push(fileService.createFile(path + '/input.csv', inputFile))
      promise.push(projectRepoisitory.updateProject(id, data))

      return Promise.all(promise)
    }).then(() => {
      return simulationService.makeFile(path)
    }).then(() => {
      return simulationService.simulation(path)
    }).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
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

// update project 
let update = function (token, id, body) {
  let data
  let userId
  let path
  let fields
  let files
  return new Promise((resolve, reject) => {
    // check if the token is valid
    redisRepository.getAccountId(token).then(accountId => {
      userId = accountId
      path   = folder + userId + '/' + id
  
      data = {
        userId: userId
      }

      return fileService.processFormData(body)
    }).then(result => {
      fields = result.fields
      files = result.files

      for (let i of dataSet) {
        if (fields[i] === undefined) {
          reject(errorMsgService.emptyInput)
          return
        } else {
          data[i] = fields[i]
        }
      }

      let promise = []

      for (let i of fileName) {
        if (files[i] !== undefined) {
          data[i] = path + '/' + i + csv
          promise.push(fileService.moveFile(files[i].path, data[i]))
        }
      }

      if (files.config !== undefined) {
        data.config = path + '/config.js'
        promise.push(fileService.moveFile(files.config.path, data.config))
      }
      if (files.gameLogic !== undefined) {
        data.gameLogic = path + '/gameLogic.cu'
        promise.push(fileService.moveFile(files.gameLogic.path, data.gameLogic))
      }

      let inputFile = data['symbol']
      for (let i of ['reels', 'rows', 'betCost']) {
        inputFile += ',' + data[i]
      }
      inputFile += '\n'
      for (let i of ['', '', '', 'baseStops', 'basePayTable', 'attr', 'basePattern']) {
        if (files[i] !== undefined) {
          inputFile += ',' + data[i]
        } else {
          inputFile += ','
        }
      }
      inputFile += '\n'
      for (let i of ['', '', '', 'bonusStops', 'bonusPayTable', '', 'bonusPattern']) {
        if (files[i] !== undefined) {
          inputFile += ',' + data[i]
        } else {
          inputFile += ','
        }
      }
      promise.push(fileService.createFile(path + '/input.csv', inputFile))
      promise.push(projectRepoisitory.updateProject(id, data))
    
      return Promise.all(promise)
    }).then(() => {
      return simulationService.makeFile(path)
    }).then(() => {
      return simulationService.simulation(path)
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

let getConfig = function (token, id) {
  let userId
  return new Promise((resolve, reject) => {
    redisRepository.getAccountId(token).then(accountId => {
      let path = '../../userProject/' + accountId + '/' + id + '/config'
      let config = require(path)
      resolve(config.config)
    }).catch(error => {
      if (error === 'token expired') {
        reject(errorMsgService.tokenExpired)
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
  deleteProject:      deleteProject,
  getConfig:          getConfig
}