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
  githubAccessToken: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true });

UserSchema.virtual('githubConnected').get(function () {
  return Boolean(this.githubAccessToken);
});

UserSchema.statics.hasGithubConnection = async function (userId) {
  const user = await this.exists({
    _id: userId,
    githubAccessToken: { $exists: true, $nin: [null, ''] }
  });
  return Boolean(user);
};

module.exports = mongoose.model('User', UserSchema);