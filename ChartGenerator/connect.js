// connect database
let database = require('../config/config').dev.database
let knex = require('knex')({
  client: 'mysql',
  connection: database,
  pool: {
    min: 0,
    max: 10
  }
})

module.exports = {
  knex: knex
}
