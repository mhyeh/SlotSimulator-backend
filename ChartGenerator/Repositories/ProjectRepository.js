let Promise = require('bluebird')

let model = require('../connect')

let getAllProject = function (userId) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('project').where('userId', userId).then(rows => {
      let allProject = []
      for (let row of rows) {
        let result = {
          id: row.id,
          name: row.name
        }
        allProject.push(result)
      }
      resolve(allProject)
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let getProjectById = function (id) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('project').where('id', id).then(project => {
      resolve(project)
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let getNewestProject = function (userid) {
  return new Promise((resolve, reject) => {
    model.knex.select().from('project').where('userid', userid).orderBy('id', 'desc').then(project => {
      resolve(project[0])
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let createProject = function (request) {
  return new Promise((resolve, reject) => {
    model.knex('project').insert(request).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let updateProject = function (id, request) {
  return new Promise((resolve, reject) => {
    model.knex('project').where('id', id).update(request).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

let deleteProject = function (id) {
  return new Promise((resolve, reject) => {
    model.knex('project').where('id', id).del().then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject()
    })
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