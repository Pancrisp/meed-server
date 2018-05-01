const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/account')
router.post('/', AccountController.createAccount)
router.post('/buy', AccountController.buy)
router.post('/sell', AccountController.sell)
router.get('/:accountId', AccountController.view)
router.delete('/:accountId', AccountController.delete)

module.exports = router
