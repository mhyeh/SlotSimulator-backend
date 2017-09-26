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
      resolve(project[0])
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
      return getNewestProject(request.userId)
    }).then(project => {
      let promise = []
      promise.push(model.knex.raw('create table overall? (id int auto_increment primary key, netWin bigint, triger int)', [project.id]))
      promise.push(model.knex.raw('create table basegame? (id int auto_increment primary key, netWin bigint)', [project.id]))
      promise.push(model.knex.raw('create table freegame? (id int auto_increment primary key, netWin bigint)', [project.id]))
      promise.push(model.knex.raw('create table survivalrate? (id int auto_increment primary key, hand int, isSurvival text)', [project.id]))
      
      return Promise.all(promise)
    }).then(() => {
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
      let promise = []
      promise.push(model.knex.schema.dropTable('overall'      + id))
      promise.push(model.knex.schema.dropTable('basegame'     + id))
      promise.push(model.knex.schema.dropTable('freegame'     + id))
      promise.push(model.knex.schema.dropTable('survivalrate' + id))

      return Promise.all(promise)
    }).then(() => {
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