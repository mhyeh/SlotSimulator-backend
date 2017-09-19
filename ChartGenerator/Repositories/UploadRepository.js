let Promise = require('bluebird')

let model = require('../connect')

let upload = function (id, table, path, field) {
  return new Promise((resolve, reject) => {
    model.knex(table + id).del().then(() => {
      let query = 'load data local infile \'' + path + '\' into table ' + table + id + ' (' + field + ')'
      return model.knex.raw(query)
    }).then(() => {
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