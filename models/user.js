const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userPhoto: {
    type: String,
  },
  userLatitue: {
    type: Number,
    required: true
  },
  userLongitude: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
