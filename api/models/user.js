const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // validation
    // match: [some crazy regex]
  },
  password: { type: String, required: true }
})

module.exports = mongoose.model('Users', UserSchema)

// vi: sw=2
