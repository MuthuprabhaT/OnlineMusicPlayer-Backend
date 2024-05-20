const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 40,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlists: {
    type: Array,
    required: false,
  },
  randomString: String,
  randomStringExpires: Date,
});

module.exports = mongoose.model("user", userSchema);
