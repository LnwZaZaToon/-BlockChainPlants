// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
    unique: true, // Ensures that UserID is unique
  },
  Username: {
    type: String,
    required: true,
  },
  granted: {
    type: String,
    required: true,
  },
},{collection: 'User'});

const User = mongoose.model('User', userSchema);

module.exports = User;
