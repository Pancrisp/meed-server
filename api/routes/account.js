const express = require('express')
const router = express.Router()
const isAuthenticated = require('../middleware/auth.js')

const AccountController = require('../controllers/account')

router.post('/', isAuthenticated, AccountController.createAccount)
router.post('/buy', isAuthenticated, AccountController.buy)
router.post('/sell', isAuthenticated, AccountController.sell)
router.get('/:accountId', AccountController.view)
router.delete('/:accountId', AccountController.delete)

module.exports = router
