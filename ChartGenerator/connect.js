let config = require('../config/database')

let knex = require('knex')({
  client: 'mysql',
  connection: config.dev,
  pool: {
    min: 0,
    max: 10
  }
})

module.exports = {
  knex: knex
}