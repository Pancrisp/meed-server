const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
  _id: Schema.Types.ObjectId,
  balance: {type: Number},
  networth: {type: Number}
  // user: type: mongoose.Schema.Types.ObjectId, ref: 'User'
    // transactions: [
    //   type:{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}
    // ]
})

module.exports = mongoose.model('Accounts', AccountSchema)
