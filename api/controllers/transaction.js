const mongoose = require('mongoose')
const Transaction = require('../models/transaction')

exports.createAccount = (req, res, next) => {
  const account = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    share: req.body.share,
    quantity: req.body.quantity,
    price: req.body.price,
    action: req.body.action
  })
  account.save()
  .then(result => {
    console.log(result)
    res.status(201).json({
      message: 'Transaction successfully created',
      user: user
    })
  })
}
