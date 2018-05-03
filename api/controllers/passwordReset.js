const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = require('dotenv').config()

const User = require('../models/user')
const PasswordReset = require('../models/passwordReset')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    PasswordReset.remove({userEmail: userEmail}, function(err) {
      if (err) return handleError(err);
    });
    const token = jwt.sign({data:userEmail}, process.env.JWT_SECRET_KEY, {expiresIn: '60'});
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
      const msg = {
        to: userEmail,
        from: 'noreply@meed.com',
        subject: 'Password Reset',
        text: 'Please click on the following link to reset your password: ' +resetUrl,
      };
      sgMail.send(msg);
      res.json({
        message: "Email sent"
      });
    });
  });
};

exports.resetPassword = async (req, res, next) => {
  resetRecord = await PasswordReset.findOne({userEmail:req.body.email});

  if(!resetRecord) {
    return res.status(404).json({
      message: 'No password reset request for this user'
    });
  }

  //check token against database
  try {
    jwt.verify(req.body.token,process.env.JWT_SECRET_KEY);

    if(resetRecord.token != req.body.token) {
      throw "Token not found";
    }
  } catch (err) {
    return res.status(404).json({
      message: 'Token not valid'
    });
  }
  //reset password if match
  userFound = await User.findOne({email:req.body.email});

  if(!userFound) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  //find user with email, and hash password and replace it
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    userFound.password = hash;
    await userFound.save();
    return res.json({
      message: "Password Updated"
    });
  });
};

// vi: sw=2
