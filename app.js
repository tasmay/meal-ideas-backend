const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const recipesRouter = require('./routes/recipes')
const lovsRouter = require('./routes/lovs')
const categoryRouter = require('./routes/category')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/recipes', recipesRouter)
app.use('/api/lovs', lovsRouter)
app.use('/api/category', categoryRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app