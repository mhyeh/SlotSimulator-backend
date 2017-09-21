let Promise = require('bluebird')

let model = require('../connect')

let upload = function (id, table, path, field) {
  model.knex(table + id).del().then(() => {
    let query = 'ALTER TABLE ' + table + id + ' AUTO_INCREMENT = 1'
    return model.knex.raw(query)
  }).then(() => {
    let query = 'LOAD DATA LOCAL INFILE ' + path + ' INTO TABLE '  + table + id +
    ' IGNORE 1 LINES (' + field + ')'
    model.knex.raw(query)
  }).catch(error => {
    console.log(error)
  })
}

module.exports = {
  upload: upload
}
