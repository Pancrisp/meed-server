const mongoose = require('mongoose')
const Transaction = require('../models/transaction')

exports.createAccount = async (req, res, next) => {
  if (!req.body.share
    || !req.body.quantity
    || !req.body.price
    || !req.body.action) {
    return res.json({
      message: 'Bad request'
    });
  }
  const account = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    share: req.body.share,
    quantity: req.body.quantity,
    price: req.body.price,
    action: req.body.action
  })
  await account.save();
  res.status(201).json({
    message: 'Transaction successfully created',
    user: user
  });
}
