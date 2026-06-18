const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  githubId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);