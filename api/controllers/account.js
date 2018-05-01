const mongoose = require('mongoose')
const Account = require('../models/account')
const User = require('../models/user')
const Share = require('../models/share')
const Transaction = require('../models/transaction')

exports.createAccount = (req, res, next) => {
  if (!req.body.userId) {
    return res.json({
      message: 'Bad request'
    });
  }
  User.findById(req.body.userId).exec((err, user) => {
    const account = new Account({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      balance: 1000000,
      networth: 1000000,
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
    return res.status(400).json({
      message: 'Bad request'
    });
  }

  Share.findOne({symbol: req.body.symbol}).exec((err, share) => {
    if (!share) {
      return res.status(409).json({
        message: 'Unrecognised symbol'
      });
    }
    const price = share.price;
    const value = price * req.body.quantity;
    const brokerage = value * 0.01 + 50;
    const total = value + brokerage;
    Account.findById(req.body.accountId)
      .populate('shares.share')
      .exec((err, account) => {
        if (!account) {
          return res.status(409).json({
            message: 'No account by that ID'
          });
        }
        if (account.balance < total) {
          return res.status(409).json({
            message: 'Insufficient funds'
          });
        }
        account.balance -= total;
        account.networth -= brokerage;
        // Add a transaction record for this purchase
        trans = new Transaction({
          _id: new mongoose.Types.ObjectId(),
          share: req.body.symbol,
          quantity: req.body.quantity,
          price: price,
          action: 'buy',
          date: Date.now()
        });
        trans.save();
        account.transactions.push(trans._id);
        // If we already have shares in this symbol
        for (var i = 0; i < account.shares.length; i++) {
          if (account.shares[i].share.symbol == req.body.symbol) {
            found = true;
            account.shares[i].quantity += req.body.quantity;
            account.save()
            return res.status(201).json({
              message: 'New share added to account',
              account: account
            });
          }
        }
        // If we could not find any existing shares in this symbol
        account.shares.push({
          share: share._id,
          quantity: req.body.quantity
        });
        account.save();
        return res.status(201).json({
          message: 'Shares purchased',
          account: account
        });
      });
  });
}

exports.sell = (req, res, next) => {
  if (!req.body.accountId
    || !req.body.symbol
    || !req.body.quantity) {
    return res.status(400).json({
      message: 'Bad request'
    });
  }

  Share.findOne({symbol: req.body.symbol}).exec((err, share) => {
    if (!share) {
      return res.status(409).json({
        message: 'Unrecognised symbol'
      });
    }
    const price = share.price;
    const value = price * req.body.quantity;
    const brokerage = value * 0.0025 + 50;
    const total = value - brokerage;
    Account.findById(req.body.accountId)
      .populate('shares.share')
      .exec((err, account) => {
        if (err) console.log(err);
        if (!account) {
          return res.status(409).json({
            message: 'No account by that ID'
          });
        }
        for (var i = 0; i < account.shares.length; i++) {
          if (account.shares[i].share.symbol == req.body.symbol) {
            if (account.shares[i].share.quantity < req.body.quantity) {
              return res.status(409).json({
                message: 'This account does not have that many shares'
              });
            }
            account.shares[i].quantity -= req.body.quantity;
            // if we sold the last shares, remove the share record
            if (account.shares[i].quantity == 0) {
              account.shares.splice(i, 1);
            }
            account.balance += total;
            account.networth -= brokerage;
            // Add a transaction record for this purchase
            trans = new Transaction({
              _id: new mongoose.Types.ObjectId(),
              share: req.body.symbol,
              quantity: req.body.quantity,
              price: price,
              action: 'sell',
              date: Date.now()
            });
            trans.save();
            account.transactions.push(trans._id);
            account.markModified('shares');
            account.save();
            return res.status(200).json({
              message: 'Shares sold.',
              account: account
            });
          } // if (account.shares[i].share.symbol == req.body.symbol)
        } // for (var i = 0; i < account.shares.length; i++)
        return res.json({
          message: 'This account does not have any shares in that symbol'
        });
      });
  });
}

exports.view = (req, res, next) => {
  Account.findById(req.params.accountId)
    .populate('transactions')
    .populate('shares.share')
    .exec((err, account) => {
      //if (err) return error(err, res)
      if(!account) {
        return res.json({
          message: 'No account by that ID'
        })
      }
      res.json(account)
    })
}

exports.delete = (req, res, next) => {
  Account.remove({ _id: req.params.accountId }, function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Failed to delete account'
      });
    }
    // remove the account from the User who had it
    User.findOne({ accounts: req.params.accountId })
      .then(function(user) {
        if (!user) {
          return res.status(500).json({
            message: 'There was no user with that account'
          });
        }
        const i = user.accounts.indexOf(req.params.accountId);
        user.accounts.splice(i, 1);
        user.save().then(function() {
          return res.json({
            message: 'Account deleted'
          });
        });
      });
  });
};

// vi: sw=2
