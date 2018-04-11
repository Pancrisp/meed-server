const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PriceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  symbol: String,
  price: Number,
  date: Date,
  name: String
})

module.exports = mongoose.model('Price', PriceSchema)

// vi: sw=2
