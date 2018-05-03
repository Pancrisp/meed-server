const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = require('dotenv').config()

const User = require('../models/user')
const PasswordReset = require('../models/passwordReset')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (req, res, next) => {
  if (!req.body.email) {
    return res.status(404).json({
      message: 'Bad request'
    });
  }
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({email: userEmail});
    if (!user) {
      return res.status(404).json({
        message: 'No user with that email'
      });
    }
    await PasswordReset.remove({userEmail: userEmail});
    const token = jwt.sign({data:userEmail}, process.env.JWT_SECRET_KEY, {expiresIn: '60'});
    const reset = new PasswordReset({
      _id: new mongoose.Types.ObjectId(),
      requestd: Date.now(),
      userEmail: userEmail,
      token: token
    });
    await reset.save();
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
  } catch (err) {
    const msg = 'Error thrown while sending password reset email';
    console.log(msg);
    return res.status(500).json({
      message: msg
    });
  }
}

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
