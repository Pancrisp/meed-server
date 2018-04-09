const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SharePriceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  symbol: String,
  price: Number,
  date: Date
})

module.exports = mongoose.model('SharePrice', SharePriceSchema)

// vi: sw=2
