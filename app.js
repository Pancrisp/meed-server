const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const userRoutes = require('./api/routes/user')

mongoose.Promise = global.Promise
// Connect to mLab database server
// mongoose.connect('mongodb://meed:' + process.env.MLAB_PW +)

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


// Routes to handle requests, these are our API endpoints
app.use('/users', userRoutes)

// Temporary handler for root endpoint
app.use((req, res, next) => {
  res.status(200).json({
    message: 'Express is working!'
  })
})

// Error handling for HTTP requests
app.use((req, res, next) => {
  const error = new Error('Not found!')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
