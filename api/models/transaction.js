const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  share: {type: String},
  quantity: {type: Number},
  price: {type: Number},
  action: {type: String}
})

module.exports = mongoose.model('Transactions', TransactionSchema)
