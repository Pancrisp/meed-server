const mongoose = require('mongoose')
const Account = require('../models/account')
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
        message: 'User not found'
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
    // If we already have shares in this symbol
    for (var i = 0; i < account.shares.length; i++) {
      if (account.shares[i].symbol == req.body.symbol) {
        account.shares[i].quantity += req.body.quantity;
        account.save()
        return res.json({
          message: 'Shares added to account',
          account: account
        });
      }
    }
    // If we could not find any existing shares in this symbol
    account.shares.push({
      symbol: req.body.symbol,
      quantity: req.body.quantity
    });
    account.save();
    return res.json({
      message: 'Shares purchased',
      account: account
    });
  })
}

exports.sell = (req, res, next) => {
  Account.findById(req.body.accountId).exec((err, account) => {
    for (var i = 0; i < account.shares.length; i++) {
      if (account.shares[i].symbol == req.body.symbol) {
        if (account.shares[i].quantity < req.body.quantity) {
          return res.json({
            message: 'This account does not have that many shares'
          });
        }
        account.shares[i].quantity -= req.body.quantity;
        account.save();
        return res.json({
          message: 'Shares sold.',
          account: account
        });
      }
    }
    return res.json({
      message: 'This account does not have any shares in that symbol'
    });
  });
}

