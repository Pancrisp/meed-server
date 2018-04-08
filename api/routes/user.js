const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.post('/', UserController.signup)

router.delete('/:userId', UserController.delete)

router.get('/', UserController.viewAll)
router.get('/:userId', UserController.view)
// router.get('/', UserController.update)
// router.get('/', UserController.login)

module.exports = router
