const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.post('/signup', UserController.signup)

router.delete('/:userId', UserController.delete)

router.get('/', UserController.viewAll)
router.get('/:userId', UserController.view)
router.put('/', UserController.update)
router.post('/login', UserController.login)

module.exports = router

// vi: sw=2
