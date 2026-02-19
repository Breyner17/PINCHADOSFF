const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "user" // 👈 por defecto es usuario normal
  }

});

module.exports = mongoose.model("User", UserSchema);

