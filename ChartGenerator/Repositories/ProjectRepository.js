let Promise = require('bluebird')

let getAllProject = function () {
  return new Promise((resolve, reject) => {
    let result = {}
    // TODO: sql select *
  })
}

let getProjectById = function (id) {
  return new Promise((resolve, reject) => {
    let result = {}

    // TODO: sql select where id = id
  })
}

let createProject = function (request) {
  let name = request.name
  let block = request.block
  let thread = request.thread
  let runTime = request.runTime

  let symbol = request.symbol
  let reels = request.reels
  let rows = request.rows
  let baseStops = request.baseStops
  let bonusStops = request.bonusStops
  let basePayTable = request.basePayTable
  let bonusPayTable = request.bonusPayTable
  let betCost = request.betCost
  let attr = request.attr

  return new Promise((resolve, reject) => {
    // TODO: sql create
  })
}

let updateProject = function (request) {
  let id = request.id
  return new Promise((resolve, reject) => {
    getProjectById(id).then(result => {
      let name = ((request.name != '') ? request.name : result.name)
      let block = ((request.block != '') ? request.block : result.block)
      let thread = ((request.thread != '') ? request.thread : result.thread)
      let runTime = ((request.runTime != '') ? request.runTime : result.runTime)
  
      let symbol = ((request.symbol != '') ? request.symbol : result.symbol)
      let reels = ((request.reels != '') ? request.reels : result.reels)
      let rows = ((request.rows != '') ? request.rows : result.rows)
      let baseStops = ((request.baseStops != '') ? request.baseStops : result.baseStops)
      let bonusStops = ((request.bonusStops != '') ? request.bonusStops : result.bonusStops)
      let basePayTable = ((request.basePayTable != '') ? request.basePayTable : result.basePayTable)
      let bonusPayTable = ((request.bonusPayTable != '') ? request.bonusPayTable : result.bonusPayTable)
      let betCost = ((request.betCost != '') ? request.betCost : result.betCost)
      let attr = ((request.attr != '') ? request.attr : result.attr)

      // TODO: sql update where id
    }).catch(err => {
      reject(err)
    })
  })
}

let deleteProject = function (id) {
  return new Promise((resolve, reject) => {
    // TODO: sql delete where id
  })
}

module.exports = {
  getAllProject: getAllProject,
  getProjectById: getProjectById,
  createProject: createProject,
  updateProject: updateProject,
  deleteProject: deleteProject
}