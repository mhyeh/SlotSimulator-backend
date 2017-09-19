let Promise = require('bluebird')

let model = require('../connect')

let upload = function (id, table, path, field) {
  return new Promise((resolve, reject) => {
    model.knex.raw('load data local infile ? into table ? (?)', path, table + 'id', field).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
      reject()
    })
  })
}

module.exports = {
    upload: upload
  }