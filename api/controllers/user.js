const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

function error(err, res) {
  console.log(err)
  return res.status(500).json({
    error: err
  })
}

exports.signup = async (req, res, next) => {
  if (!req.body.name
    || !req.body.email
    || !req.body.password) {
    return res.json({
      message: 'Bad request'
    });
  }
  try {
    // prevents users from signing up with the same email
    const user = await User.find({ email: req.body.email });
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      })
    }
    // hash passwords and create new user
    // if they pass the email check
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        })
      }
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      await user.save();
      res.status(201).json({
        message: 'User successfully created',
        user: user
      });
    });
  } catch(err) {
    console.log(err)
    res.status(500).json({
      error: err
    });
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.length < 1) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      if (result) {
        const token = jwt.sign({
          email: user.email,
          userId: user._id
        }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
        return res.status(200).json({
          message: "Authentication successful",
          token: token,
          userId: user._id
        });
      }
      res.status(401).json({
        message: "Authentication failed"
      });
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await User.remove({ _id: req.params.userId });
    return res.status(200).json({
      message: 'User successfully deleted'
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
};

exports.viewAll = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return error(err, res);
  }
}

exports.view = async (req, res, next) => {
  try {
    const user  = await User.findById(req.params.userId);
    res.json(user)
  } catch (err) {
    return error(err, res);
  }
}

exports.update = async (req, res, next) => {
  if (!req.body._id
    || !req.body.name
    || !req.body.email
    || !req.body.password) {
    return res.json({
      message: 'Bad request'
    });
  }
  try {
    const user = await User.findById(req.body._id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save(err, updatedUser);
    return res.json(updatedUser);
  } catch (err) {
    return error(err, res);
  }
}

// vi: sw=2
