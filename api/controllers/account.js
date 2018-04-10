const mongoose = require('mongoose')
const Account = require('../models/account')
const User = require('../models/user')
const Price = require('../models/price')

exports.createAccount = (req, res, next) => {
  if (!req.body.userId) {
    return res.json({
      message: 'Bad request'
    });
  }
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
  if (!req.body.accountId
    || !req.body.symbol
    || !req.body.quantity) {
    return res.json({
      message: 'Bad request'
    });
  }
  var value = 0;
  Price.findOne({symbol: req.body.symbol}).exec((err, price) => {
    if (!price) {
      return res.json({
        message: 'Unrecognised symbol'
      });
    }
    value = price.price * req.body.quantity;
  });
  Account.findById(req.body.accountId).exec((err, account) => {
    if (!account) {
      return res.json({
        message: 'No account by that ID'
      });
    }
    if (account.balance < value) {
      return res.json({
        message: 'Insufficient funds'
      });
    }
    account.balance -= value;
    //update networth
    account.networth += (account.balance + value);
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
  if (!req.body.accountId
    || !req.body.symbol
    || !req.body.quantity) {
    return res.json({
      message: 'Bad request'
    });
  }
  var value = 0;
  Price.findOne({symbol: req.body.symbol}).exec((err, price) => {
    if (!price) {
      return res.json({
        message: 'Unrecognised symbol'
      });
    }
    value = price.price * req.body.quantity;
  });
  Account.findById(req.body.accountId).exec((err, account) => {
    if (!account) {
      return res.json({
        message: 'No account by that ID'
      });
    }
    for (var i = 0; i < account.shares.length; i++) {
      if (account.shares[i].symbol == req.body.symbol) {
        if (account.shares[i].quantity < req.body.quantity) {
          return res.json({
            message: 'This account does not have that many shares'
          });
        }
        account.shares[i].quantity -= req.body.quantity;
        account.balance += value;
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

exports.view = (req, res, next) => {
  Account.findById(req.params.accountId).exec((err, account) => {
    //if (err) return error(err, res)
    if(!account) {
      return res.json({
        message: 'No account by that ID'
      })
    }
    res.json(account)
  })
}

//when buy shares update networth
