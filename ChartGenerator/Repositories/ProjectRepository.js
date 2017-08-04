let Promise = require('bluebird')
let squel   = require('squel')

let getAllProject = function (userId) {
  return new Promise((resolve, reject) => {
    let result = {}
    // TODO: sql select *
  })
}

let getProjectById = function (userId, id) {
  return new Promise((resolve, reject) => {
    let result = {}

    // TODO: sql select where id = id
  })
}

let getNewestProject = function (userid) {
  return new Promise((resolve, reject) => {
    let result = {}

  })
}

let createProject = function (request) {
  return new Promise((resolve, reject) => {
    // TODO: sql insert
  })
}

let updateProject = function (id, request) {
  return new Promise((resolve, reject) => {
    // TODO: sql update where id
  })
}

let deleteProject = function (userId, id) {
  return new Promise((resolve, reject) => {
    // TODO: sql delete where id
  })
}

module.exports = {
  getAllProject:    getAllProject,
  getProjectById:   getProjectById,
  getNewestProject: getNewestProject,
  createProject:    createProject,
  updateProject:    updateProject,
  deleteProject:    deleteProject
}