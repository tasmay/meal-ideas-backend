const categoryRouter = require('express').Router()
const db = require('../db')
const format = require('pg-format');
 
categoryRouter.get('/:id', (req, res, next) => {
  let sql = format(`SELECT category_id, name, image_url, description FROM categories where category_id = %L`, req.params.id)
  console.log(sql)
  db.query(sql, (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result.rows[0])
  })
})

module.exports = categoryRouter