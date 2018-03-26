const mongoose = require('mongoose')
const passport = require('passport')

const User = require('../models/user')

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
}

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
}

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
}
