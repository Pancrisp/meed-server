const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handles GET requests to /users'
  })
})

router.post('/', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      })
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      user.save()
      .then(result => {
        console.log(result)
        res.status(201).json({
          message: 'User created',
          user: user
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      })
    }
  })
})

router.get('/:userId', (req, res, next) => {
  const id = req.params.userId

  if (id === '1337') {
    res.status(200).json({
      message: 'Begone, script kiddie!',
      id: id
    })
  } else {
    res.status(200).json({
      message: 'User with ID you specified'
    })
  }
})

router.patch('/:userId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated a user'
  })
})

router.delete('/:userId', (req, res, next) => {
  res.status(200).json({
    message: "Deleted a user"
  })
})

module.exports = router
