const express = require('express')
const router = express.Router()

const TransactionController = require('../controllers/transaction')
router.post('/', TransactionController.createAccount)

module.exports = router
