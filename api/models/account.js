const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
  _id: Schema.Types.ObjectId,
  balance: {type: Number},
  networth: {type: Number},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  transactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transactions'}],
  shares: [{symbol: String, quantity: Number}]
})

module.exports = mongoose.model('Accounts', AccountSchema)
