const express = require('express')
const router = express.Router()

const PasswordResetController = require('../controllers/passwordReset')

router.post('/', PasswordResetController.sendEmail)
router.post('/reset', PasswordResetController.resetPassword)

module.exports = router

// vi: sw=2
