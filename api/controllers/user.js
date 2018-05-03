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

exports.signup = (req, res, next) => {
  if (!req.body.name
    || !req.body.email
    || !req.body.password) {
    return res.json({
      message: 'Bad request'
    });
  }
  // prevents users from signing up with the same email
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'An account with this email already exists.'
        })
      } else {
        // hash passwords and create new user
        // if they pass the email check
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash
            })
            user.save()
            .then(result => {
              res.status(201).json({
                message: 'User successfully created',
                user: user
              })
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({
                error: err
              })
            })
          }
        })
      }
    })
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
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
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h"
            }
          );
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
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User successfully deleted'
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

exports.viewAll = (req, res, next) => {
  User.find().exec((err, users) => {
    if (err) return error(err, res)
    res.json(users)
  })
}

exports.view = (req, res, next) => {
  User.findById(req.params.userId).exec((err, user) => {
    if (err) return error(err, res)
    res.json(user)
  })
}

exports.update = (req, res, next) => {
  if (!req.body._id
    || !req.body.name
    || !req.body.email
    || !req.body.password) {
    return res.json({
      message: 'Bad request'
    });
  }
  User.findById(req.body._id).exec((err, user) => {
    if (err) return error(err, res)
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password
    user.save((err, updatedUser) => {
      if (err) return error(err, res)
      res.json(updatedUser)
    })
  })
}

// vi: sw=2
