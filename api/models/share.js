const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShareSchema = new Schema({
  _id: Schema.Types.ObjectId,
  symbol: String,
  price: Number,
  date: Date,
  name: String
})

module.exports = mongoose.model('Share', ShareSchema)

// vi: sw=2