let Promise = require('bluebird')

let model = require('../connect')

let upload = function (id, table, path, field) {
  return new Promise((resolve, reject) => {
    model.knex(table + id).del().then(() => {
      let query = 'ALTER TABLE ' + table + id + ' AUTO_INCREMENT = 1'
      return model.knex.raw(query)
    }).then(() => {
      let query = "LOAD DATA LOCAL INFILE '" + path + "' INTO TABLE "  + table + id +
      " TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (" + field + ")"
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