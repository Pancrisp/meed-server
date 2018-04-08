const mongoose = require('mongoose')
const Account = require('../models/account')

exports.createAccount = (req, res, next) => {
  const account = new Account({
    _id: new mongoose.Types.ObjectId(),
    balance: req.body.balance,
    networth: req.body.networth,
    user: req.body.user
  })
  account.save()
  .then(result => {
    console.log(result)
    res.status(201).json({
      message: 'Account successfully created',
      user: user
    })
  })
}
