const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/account')
router.post('/', AccountController.createAccount)
router.post('/buy', AccountController.buy)
router.post('/sell', AccountController.sell)

module.exports = router
