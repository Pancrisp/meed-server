const express = require('express')
const router = express.Router()

const PriceController = require('../controllers/price')
router.get('/', PriceController.viewAll)
router.get('/:symbol', PriceController.view)

module.exports = router
