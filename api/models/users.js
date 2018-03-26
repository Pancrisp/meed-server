const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Users', UserSchema)
