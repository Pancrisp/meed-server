const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config()

const User = require('../models/user')
const PasswordReset = require('../models/passwordReset')

exports.sendEmail = (req, res, next) => {
  if (!req.body.email) {
    return res.status(404).json({
      message: 'Bad request'
    });
  }
  const userEmail = req.body.email;
  User.findOne({email: userEmail}).then(function(user) {
    if (!user) {
      return res.status(404).json({
        message: 'No user with that email'
      });
    }
    const token = jwt.sign(userEmail, process.env.JWT_SECRET_KEY);
    const reset = new PasswordReset({
      _id: new mongoose.Types.ObjectId(),
      requestd: Date.now(),
      userEmail: userEmail,
      token: token
    });
    reset.save().then(function() {
      const resetUrl = 'https://www.frontend.com/password_reset?email='
        + userEmail + '&token=' + token;
      // email the user and respond OK
    });
  });
};

exports.resetPassword = (req, res, next) => {
};

// vi: sw=2
