const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema({
  _id: Schema.Types.ObjectId,
  requested: Date,
  userEmail: String,
  token: String
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);

// vi: sw=2
