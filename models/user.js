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
    required: true,
  },
  registeredEvents: {
    type: Array(String),
    default: [],
  }
});

module.exports = mongoose.model("User", userSchema);
