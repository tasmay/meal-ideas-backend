const lovsRouter = require('express').Router()
const db = require('../db')
 
lovsRouter.get('/meals', (req, res, next) => {
  const queryText = 'SELECT meal_id, name FROM meals'
  db.query(queryText, (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

lovsRouter.get('/cuisines', (req, res, next) => {
    const queryText = 'SELECT cuisine_id, name FROM cuisines'
    db.query(queryText, (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result.rows)
    })
  })

  lovsRouter.get('/ingredients', (req, res, next) => {
    const queryText = 'SELECT ingredient_id, name FROM ingredients'
    db.query(queryText, (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result.rows)
    })
  })

module.exports = lovsRouter