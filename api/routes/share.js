const express = require('express')
const router = express.Router()

const ShareController = require('../controllers/share')
router.get('/', ShareController.viewAll)
router.get('/:symbol', ShareController.view)

module.exports = router
