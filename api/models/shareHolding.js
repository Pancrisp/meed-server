const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShareHoldingSchema = new Schema({
  _id: Schema.Types.ObjectId,
  symbol: String,
  quantity: Number
})

module.exports = mongoose.model('ShareHolding', ShareHoldingSchema)

// vi: sw=2
