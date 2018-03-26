const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handles GET requests to /users'
  })
})

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handles POST requests to /users'
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
