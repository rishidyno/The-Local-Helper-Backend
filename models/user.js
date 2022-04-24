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
  userLatitude: {
    type: String,
    required: true
  },
  userLongitude: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
