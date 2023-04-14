const config = require('../utils/config')
const { Pool } = require('pg')
 
const pool = new Pool({
  user: config.POSTGRES_USER,
  host: config.POSTGRESQL_HOST,
  database: config.POSTGRES_DATABASE,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}