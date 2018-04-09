const mongoose = require('mongoose')
const Account = require('../models/account')
const ShareHolding = require('../models/shareHolding')
const User = require('../models/user')

exports.createAccount = (req, res, next) => {
  User.findById(req.body.userId).exec((err, user) => {
    const account = new Account({
      _id: new mongoose.Types.ObjectId(),
      balance: 2000000,
      networth: 0,
    })
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    account.save()
    user.accounts.push(account._id)
    user.save()
      .then(result => {
        console.log(result)
        res.status(201).json({
          message: 'Account successfully created',
          account: account
        })
      })
  })
}

exports.buy = (req, res, next) => {
  Account.findById(req.body.accountId).exec((err, account) => {
    const holding = new ShareHolding({
      _id: new mongoose.Types.ObjectId(),
      symbol: req.body.symbol,
      quantity: req.body.quantity
    })
    holding.save()
    account.shareHoldings.push(holding._id)
    account.save()
  })
}

exports.sell = (req, res, next) => {
}

