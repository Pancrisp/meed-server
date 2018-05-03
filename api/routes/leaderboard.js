const express = require('express')
const router = express.Router()

const LeaderboardController = require('../controllers/leaderboard')

router.get('/', LeaderboardController.view)

module.exports = router

// vi: sw=2
