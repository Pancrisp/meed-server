const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShareSchema = new Schema({
  _id: Schema.Types.ObjectId,
  symbol: String,
  price: Number,
  date: Date,
  name: String,
  priceHistory: [{ date:Date, price: Number }]
})

module.exports = mongoose.model('Shares', ShareSchema)

// vi: sw=2
